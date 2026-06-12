/** XP Luna palette — hex constants for SVG/JS use. Mirrors index.css @theme. */

export const XP = {
  // Surfaces
  surface: "#ece9d8",
  surfaceDim: "#d4d0c8",
  white: "#ffffff",
  // Outlines
  outline: "#808080",
  outlineVariant: "#c0c0c0",
  // Brand blue
  blue: "#0046b8",
  winBlue: "#3168d5",
  winBlueLight: "#5b8ef5",
  winBlueDark: "#1a4cc7",
  // Start green
  green: "#3c9a3e",
  // XP four-color flag
  flagRed: "#f24f4f",
  flagGreen: "#6fbf3f",
  flagBlue: "#3b8fe0",
  flagYellow: "#f6c23e",
  // Accents
  folder: "#f4c542",
  folderEdge: "#c8960c",
  amber: "#e8a33d",
  red: "#cc3333",
} as const;

export type XPColor = keyof typeof XP;
