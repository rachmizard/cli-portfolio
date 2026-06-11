import { useState, useEffect } from "react";
import Desktop from "./components/Desktop";
import Taskbar from "./components/Taskbar";
import StartMenu from "./components/StartMenu";
import { WELCOME_CONTENT, PROJECTS_CONTENT, ABOUT_CONTENT } from "./content";
import type { AppWindow } from "./types";

function App() {
  const [windows, setWindows] = useState<AppWindow[]>([]);
  const [nextZ, setNextZ] = useState(1);
  const [startMenuOpen, setStartMenuOpen] = useState(false);

  useEffect(() => {
    setWindows([
      {
        id: "welcome",
        title: "Welcome.exe",
        icon: "terminal",
        content: WELCOME_CONTENT,
        minimized: false,
        maximized: false,
        zIndex: 1,
      },
    ]);
    setNextZ(2);
  }, []);

  const openWindow = (
    id: string,
    title: string,
    icon: string,
    content: React.ReactNode,
  ) => {
    setWindows((prev) => {
      const existing = prev.find((w) => w.id === id);
      if (existing) {
        return prev.map((w) =>
          w.id === id
            ? { ...w, minimized: false, maximized: false, zIndex: nextZ }
            : w,
        );
      }
      return [
        ...prev,
        { id, title, icon, content, minimized: false, maximized: false, zIndex: nextZ },
      ];
    });
    setNextZ((z) => z + 1);
  };

  const focusWindow = (id: string) => {
    if (!id) return;
    setWindows((prev) =>
      prev.map((w) => (w.id === id ? { ...w, zIndex: nextZ } : w)),
    );
    setNextZ((z) => z + 1);
  };

  const toggleMinimize = (id: string) => {
    setWindows((prev) =>
      prev.map((w) =>
        w.id === id ? { ...w, minimized: !w.minimized } : w,
      ),
    );
  };

  const toggleMaximize = (id: string) => {
    setWindows((prev) =>
      prev.map((w) =>
        w.id === id ? { ...w, maximized: !w.maximized } : w,
      ),
    );
  };

  const closeWindow = (id: string) => {
    setWindows((prev) => prev.filter((w) => w.id !== id));
  };

  return (
    <div className="h-full flex flex-col">
      <Desktop
        windows={windows}
        onOpenWindow={openWindow}
        onFocusWindow={focusWindow}
        onCloseWindow={closeWindow}
        onToggleMinimize={toggleMinimize}
        onMaximizeWindow={toggleMaximize}
        onStartMenuOpen={() => setStartMenuOpen(true)}
      />
      <Taskbar
        windows={windows}
        startMenuOpen={startMenuOpen}
        onFocusWindow={focusWindow}
        onToggleMinimize={toggleMinimize}
        onToggleStartMenu={() => setStartMenuOpen((s) => !s)}
      />
      <StartMenu
        visible={startMenuOpen}
        onClose={() => setStartMenuOpen(false)}
        onOpenWindow={openWindow}
        aboutContent={ABOUT_CONTENT}
        projectsContent={PROJECTS_CONTENT}
        skillsContent={WELCOME_CONTENT}
      />
    </div>
  );
}

export default App;
