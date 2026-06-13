import type { ReactNode } from "react";

export interface AppWindow {
  id: string;
  title: string;
  icon: string;
  content: ReactNode;
  minimized: boolean;
  maximized: boolean;
  zIndex: number;
  initialRect?: { x?: number; y?: number; w: number; h: number };
}
