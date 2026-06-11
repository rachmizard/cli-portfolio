import type { ReactNode } from "react";

export interface AppWindow {
  id: string;
  title: string;
  icon: string;
  content: ReactNode;
  minimized: boolean;
  zIndex: number;
}
