export interface Wallpaper {
  id: string;
  name: string;
  css: string;
}

// Built-in wallpapers — bliss is the real photo; the rest are XP-styled CSS
// gradients so no binary assets need bundling. Drop more .jpg files in /public
// and add entries here, or use "Browse..." in Display Properties for a custom one.
export const WALLPAPERS: Wallpaper[] = [
  { id: "bliss", name: "Bliss", css: "url('/bliss.jpg') center / cover no-repeat" },
  { id: "xp-blue", name: "Windows XP", css: "linear-gradient(180deg,#5a8fd6 0%,#3a6ea5 55%,#2a5685 100%)" },
  { id: "azul", name: "Azul", css: "radial-gradient(circle at 50% 38%,#2a6fd6 0%,#0a2a6a 100%)" },
  { id: "autumn", name: "Autumn", css: "linear-gradient(180deg,#d98c3a 0%,#a8521a 60%,#5a2a0a 100%)" },
  { id: "crystal", name: "Crystal", css: "linear-gradient(180deg,#7fe0e8 0%,#2aa0c0 60%,#0a5a7a 100%)" },
  { id: "red-desert", name: "Red Moon Desert", css: "linear-gradient(180deg,#e87a3a 0%,#a83a2a 50%,#3a0a0a 100%)" },
  { id: "teal", name: "Windows Classic", css: "#3a6ea5" },
  { id: "none", name: "(None)", css: "#0a4a6a" },
];

export const DEFAULT_WALLPAPER_ID = "bliss";

export type WallpaperValue =
  | { kind: "builtin"; id: string }
  | { kind: "custom"; dataUrl: string };

export const DEFAULT_WALLPAPER: WallpaperValue = { kind: "builtin", id: DEFAULT_WALLPAPER_ID };

export function resolveCss(v: WallpaperValue): string {
  if (v.kind === "custom") return `url('${v.dataUrl}') center / cover no-repeat`;
  const w = WALLPAPERS.find((x) => x.id === v.id) ?? WALLPAPERS[0];
  return w.css;
}
