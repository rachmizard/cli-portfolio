// One-time helper to obtain a Spotify refresh token for the recently-played API.
//
// Run locally (NEVER deploy this, never commit the output):
//   1. Set CLIENT_ID / CLIENT_SECRET below (or via env) from your Spotify app.
//   2. Add  http://127.0.0.1:8888/callback  as a Redirect URI in the app settings.
//   3. node scripts/get-spotify-token.mjs
//   4. Open the printed URL, approve, get redirected; the token prints to console.
//   5. Copy SPOTIFY_REFRESH_TOKEN into Vercel env vars. Delete nothing else.
//
// Uses only Node built-ins — no dependencies.

import http from "node:http";
import { URL } from "node:url";

const CLIENT_ID = process.env.SPOTIFY_CLIENT_ID || "PUT_CLIENT_ID_HERE";
const CLIENT_SECRET = process.env.SPOTIFY_CLIENT_SECRET || "PUT_CLIENT_SECRET_HERE";
const REDIRECT_URI = "http://127.0.0.1:8888/callback";
const SCOPE = "user-read-recently-played";
const PORT = 8888;

const authUrl =
  "https://accounts.spotify.com/authorize?" +
  new URLSearchParams({
    response_type: "code",
    client_id: CLIENT_ID,
    scope: SCOPE,
    redirect_uri: REDIRECT_URI,
  }).toString();

console.log("\n1. Open this URL in your browser and approve:\n");
console.log(authUrl + "\n");
console.log(`2. Waiting for redirect on ${REDIRECT_URI} ...\n`);

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, `http://127.0.0.1:${PORT}`);
  if (url.pathname !== "/callback") {
    res.writeHead(404).end();
    return;
  }
  const code = url.searchParams.get("code");
  if (!code) {
    res.writeHead(400).end("no code");
    return;
  }

  const basic = Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`).toString("base64");
  const tokenRes = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: {
      Authorization: `Basic ${basic}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      grant_type: "authorization_code",
      code,
      redirect_uri: REDIRECT_URI,
    }),
  });
  const data = await tokenRes.json();

  if (data.refresh_token) {
    console.log("\n✅ SUCCESS — set this in Vercel env vars:\n");
    console.log("SPOTIFY_REFRESH_TOKEN=" + data.refresh_token + "\n");
    res.writeHead(200, { "Content-Type": "text/plain" });
    res.end("Done. Refresh token printed to your terminal. You can close this tab.");
  } else {
    console.error("\n❌ Failed:", data);
    res.writeHead(500).end("token exchange failed; check terminal");
  }
  server.close();
});

server.listen(PORT);
