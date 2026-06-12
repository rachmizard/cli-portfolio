import { useState, useEffect, useCallback } from "react";
import { DEFAULT_WALLPAPER, type WallpaperValue } from "./wallpapers";

const STORAGE_KEY = "xp-wallpaper";

function load(): WallpaperValue {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_WALLPAPER;
    const parsed = JSON.parse(raw) as WallpaperValue;
    if (parsed?.kind === "builtin" && typeof parsed.id === "string") return parsed;
    if (parsed?.kind === "custom" && typeof parsed.dataUrl === "string") return parsed;
    return DEFAULT_WALLPAPER;
  } catch {
    return DEFAULT_WALLPAPER;
  }
}

export function useWallpaper() {
  const [wallpaper, setWallpaperState] = useState<WallpaperValue>(DEFAULT_WALLPAPER);

  // Hydrate from storage after mount (avoids SSR/initial mismatch)
  useEffect(() => {
    setWallpaperState(load());
  }, []);

  const setWallpaper = useCallback((v: WallpaperValue) => {
    setWallpaperState(v);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(v));
    } catch {
      // custom data URLs can exceed quota — fail silently, keep in-memory value
    }
  }, []);

  return { wallpaper, setWallpaper };
}
