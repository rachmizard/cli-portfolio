# Spotify "Recently Played" Setup

The Winamp window shows your real recently-played Spotify tracks. It works through a
Vercel serverless function so your credentials never touch the frontend bundle.

> **Note on audio:** Spotify deprecated 30-second `preview_url`s (Nov 2024), so tracks
> are **metadata-only** — title, artist, album art, and a link. Play/Stop are disabled;
> double-click a playlist row to open the track in Spotify. The Winamp UI is unchanged.

Until you complete this setup, the app falls back to a curated list automatically.

## 1. Create a Spotify app

1. Go to <https://developer.spotify.com/dashboard> and create an app.
2. Copy the **Client ID** and **Client Secret**.
3. In the app's settings, add this Redirect URI: `http://127.0.0.1:8888/callback`

## 2. Get a refresh token (one-time, local)

```bash
SPOTIFY_CLIENT_ID=xxx SPOTIFY_CLIENT_SECRET=yyy node scripts/get-spotify-token.mjs
```

Open the printed URL, approve access, and the script prints your
`SPOTIFY_REFRESH_TOKEN`. This token is long-lived — keep it secret.

## 3. Add env vars to Vercel

Vercel dashboard → your project → **Settings → Environment Variables**:

| Name | Value |
|------|-------|
| `SPOTIFY_CLIENT_ID` | from step 1 |
| `SPOTIFY_CLIENT_SECRET` | from step 1 |
| `SPOTIFY_REFRESH_TOKEN` | from step 2 |

Redeploy. The function at `/api/recently-played` is now live and the Winamp title bar
shows `● spotify` when reading live data.

## Local development

`vite` does not run the `/api` function, so `bun dev` always shows the fallback list.
To test the function locally, use the Vercel CLI:

```bash
npx vercel dev
```

with the three env vars set (e.g. in a local `.env`, which is gitignored).

## Security notes

- The refresh token lives **only** in Vercel env vars / your local `.env` — never in
  the committed code or the frontend bundle.
- `scripts/get-spotify-token.mjs` is a local helper. Do not deploy it or paste the
  token anywhere public.
- The API response is edge-cached 5 minutes to stay well under Spotify rate limits.
