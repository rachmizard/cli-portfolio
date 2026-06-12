import { useState, useEffect } from "react";
import Desktop from "./components/Desktop";
import Taskbar from "./components/Taskbar";
import StartMenu from "./components/StartMenu";
import { WELCOME_CONTENT } from "./content";
import type { AppWindow } from "./types";

function App() {
  const [windows, setWindows] = useState<AppWindow[]>([]);
  const [nextZ, setNextZ] = useState(1);
  const [activeId, setActiveId] = useState<string>("welcome");
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
            ? { ...w, minimized: false, zIndex: nextZ }
            : w,
        );
      }
      return [
        ...prev,
        { id, title, icon, content, minimized: false, maximized: false, zIndex: nextZ },
      ];
    });
    setActiveId(id);
    setNextZ((z) => z + 1);
  };

  const focusWindow = (id: string) => {
    if (!id) {
      setActiveId("");
      return;
    }
    setWindows((prev) =>
      prev.map((w) => (w.id === id ? { ...w, zIndex: nextZ } : w)),
    );
    setActiveId(id);
    setNextZ((z) => z + 1);
  };

  const toggleMinimize = (id: string) => {
    setWindows((prev) =>
      prev.map((w) =>
        w.id === id ? { ...w, minimized: !w.minimized } : w,
      ),
    );
    setActiveId((cur) => (cur === id ? "" : cur));
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
    setActiveId((cur) => (cur === id ? "" : cur));
  };

  const showDesktop = () => {
    setWindows((prev) => prev.map((w) => ({ ...w, minimized: true })));
    setActiveId("");
  };

  return (
    <div className="h-full flex flex-col">
      <Desktop
        windows={windows}
        activeId={activeId}
        onOpenWindow={openWindow}
        onFocusWindow={focusWindow}
        onCloseWindow={closeWindow}
        onToggleMinimize={toggleMinimize}
        onMaximizeWindow={toggleMaximize}
        onStartMenuOpen={() => setStartMenuOpen(true)}
      />
      <Taskbar
        windows={windows}
        activeId={activeId}
        startMenuOpen={startMenuOpen}
        onFocusWindow={focusWindow}
        onToggleMinimize={toggleMinimize}
        onToggleStartMenu={() => setStartMenuOpen((s) => !s)}
        onShowDesktop={showDesktop}
      />
      <StartMenu
        visible={startMenuOpen}
        onClose={() => setStartMenuOpen(false)}
        onOpenWindow={openWindow}
      />
    </div>
  );
}

export default App;
