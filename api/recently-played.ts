// Vercel serverless function — returns the owner's recently-played Spotify tracks.
//
// SECURITY: the refresh token lives ONLY in Vercel env vars, never in the
// frontend bundle. Visitors hit this endpoint; the token never leaves the server.
//
// Required env vars (set in Vercel dashboard → Settings → Environment Variables):
//   SPOTIFY_CLIENT_ID
//   SPOTIFY_CLIENT_SECRET
//   SPOTIFY_REFRESH_TOKEN
// See SPOTIFY_SETUP.md for how to obtain these.

// Minimal Vercel Node handler types (avoids a @vercel/node dependency)
interface Req {
  method?: string;
}
interface Res {
  status: (code: number) => Res;
  json: (body: unknown) => void;
  setHeader: (name: string, value: string) => void;
}

interface OutTrack {
  id: string;
  artist: string;
  title: string;
  duration: string;
  album: string;
  albumArt: string;
  spotifyUrl: string;
  previewUrl: string;
  playedAt: string;
}

const TOKEN_URL = "https://accounts.spotify.com/api/token";
const RECENT_URL = "https://api.spotify.com/v1/me/player/recently-played?limit=50";

function fmtDuration(ms: number): string {
  const total = Math.round(ms / 1000);
  const m = Math.floor(total / 60);
  const s = total % 60;
  return `${m}:${s.toString().padStart(2, "0")}`;
}

async function getAccessToken(id: string, secret: string, refresh: string): Promise<string> {
  const basic = Buffer.from(`${id}:${secret}`).toString("base64");
  const res = await fetch(TOKEN_URL, {
    method: "POST",
    headers: {
      Authorization: `Basic ${basic}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({ grant_type: "refresh_token", refresh_token: refresh }),
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`token exchange failed: ${res.status} ${text}`);
  }
  const data = (await res.json()) as { access_token: string };
  return data.access_token;
}

export default async function handler(req: Req, res: Res) {
  if (req.method !== "GET") {
    res.status(405).json({ error: "method not allowed" });
    return;
  }

  const clientId = process.env.SPOTIFY_CLIENT_ID;
  const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;
  const refreshToken = process.env.SPOTIFY_REFRESH_TOKEN;

  if (!clientId || !clientSecret || !refreshToken) {
    res.status(503).json({ error: "spotify not configured", tracks: [] });
    return;
  }

  try {
    const accessToken = await getAccessToken(clientId, clientSecret, refreshToken);
    const recent = await fetch(RECENT_URL, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    if (!recent.ok) {
      const text = await recent.text();
      throw new Error(`recently-played failed: ${recent.status} ${text}`);
    }
    const data = (await recent.json()) as {
      items: Array<{
        played_at: string;
        track: {
          id: string;
          name: string;
          duration_ms: number;
          preview_url: string | null;
          artists: Array<{ name: string }>;
          album: { name: string; images: Array<{ url: string }> };
          external_urls: { spotify: string };
        };
      }>;
    };

    // De-dupe by track id, preserving most-recent order
    const seen = new Set<string>();
    const tracks: OutTrack[] = [];
    for (const item of data.items ?? []) {
      const t = item.track;
      if (!t || seen.has(t.id)) continue;
      seen.add(t.id);
      tracks.push({
        id: t.id,
        artist: t.artists.map((a) => a.name).join(", "),
        title: t.name,
        duration: fmtDuration(t.duration_ms),
        album: t.album?.name ?? "",
        albumArt: t.album?.images?.[t.album.images.length - 1]?.url ?? "",
        spotifyUrl: t.external_urls?.spotify ?? "",
        previewUrl: t.preview_url ?? "",
        playedAt: item.played_at,
      });
    }

    // Cache at the edge for 5 min; serve stale up to 10 min while revalidating
    res.setHeader("Cache-Control", "s-maxage=300, stale-while-revalidate=600");
    res.status(200).json({ tracks });
  } catch (err) {
    res.status(502).json({ error: String(err), tracks: [] });
  }
}
