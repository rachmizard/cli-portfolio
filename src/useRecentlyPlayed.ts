import { useState, useEffect } from "react";
import { FALLBACK_TRACKS, type Track } from "./tracks";

type Status = "loading" | "live" | "fallback";

interface ApiResponse {
  tracks?: Track[];
  error?: string;
}

// Fetches the owner's recently-played from /api/recently-played.
// Falls back to the curated list if the endpoint is missing, errors, or returns
// empty (e.g. running on static hosting with no function, or env not configured).
export function useRecentlyPlayed() {
  const [tracks, setTracks] = useState<Track[]>(FALLBACK_TRACKS);
  const [status, setStatus] = useState<Status>("loading");

  useEffect(() => {
    let cancelled = false;
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 6000);

    fetch("/api/recently-played", { signal: controller.signal })
      .then((r) => (r.ok ? (r.json() as Promise<ApiResponse>) : Promise.reject(new Error(String(r.status)))))
      .then((data) => {
        if (cancelled) return;
        if (data.tracks && data.tracks.length > 0) {
          setTracks(data.tracks);
          setStatus("live");
        } else {
          setStatus("fallback");
        }
      })
      .catch(() => {
        if (!cancelled) setStatus("fallback");
      })
      .finally(() => clearTimeout(timeout));

    return () => {
      cancelled = true;
      controller.abort();
      clearTimeout(timeout);
    };
  }, []);

  return { tracks, status };
}
