import { createContext, useContext, type ReactNode } from "react";

export interface WindowManager {
  openWindow: (id: string, title: string, icon: string, content: ReactNode) => void;
}

const WindowManagerContext = createContext<WindowManager | null>(null);

export function WindowManagerProvider({
  value,
  children,
}: {
  value: WindowManager;
  children: ReactNode;
}) {
  return (
    <WindowManagerContext.Provider value={value}>
      {children}
    </WindowManagerContext.Provider>
  );
}

export function useWindowManager(): WindowManager {
  const ctx = useContext(WindowManagerContext);
  if (!ctx) {
    throw new Error("useWindowManager must be used within a WindowManagerProvider");
  }
  return ctx;
}
