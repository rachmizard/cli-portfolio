import { useState, useEffect } from "react";
import Desktop from "./components/Desktop";
import Taskbar from "./components/Taskbar";
import StartMenu from "./components/StartMenu";
import DisplayProperties from "./components/DisplayProperties";
import ShutdownScreen from "./components/ShutdownScreen";
import BootScreen from "./components/BootScreen";
import WelcomeScreen from "./components/WelcomeScreen";
import SmadavScreen from "./components/SmadavScreen";
import { WELCOME_CONTENT } from "./content";
import { useWallpaper } from "./useWallpaper";
import { resolveCss } from "./wallpapers";
import { WindowManagerProvider } from "./windowContext";
import type { AppWindow } from "./types";

function App() {
  const [windows, setWindows] = useState<AppWindow[]>([]);
  const [nextZ, setNextZ] = useState(1);
  const [activeId, setActiveId] = useState<string>("welcome");
  const [startMenuOpen, setStartMenuOpen] = useState(false);
  const [shuttingDown, setShuttingDown] = useState(false);
  const [booting, setBooting] = useState(true);
  const [welcoming, setWelcoming] = useState(false);
  const [smadav, setSmadav] = useState(false);
  const { wallpaper, setWallpaper } = useWallpaper();

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
    initialRect?: AppWindow["initialRect"],
  ) => {
    setWindows((prev) => {
      const existing = prev.find((w) => w.id === id);
      if (existing) {
        return prev.map((w) =>
          w.id === id
            ? { ...w, minimized: false, zIndex: nextZ, content }
            : w,
        );
      }
      return [
        ...prev,
        { id, title, icon, content, minimized: false, maximized: false, zIndex: nextZ, initialRect },
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

  const openDisplayProperties = () => {
    openWindow(
      "display",
      "Display Properties",
      "settings",
      <DisplayProperties
        current={wallpaper}
        onApply={setWallpaper}
        onClose={() => closeWindow("display")}
      />,
    );
  };

  return (
    <div className="h-full flex flex-col">
      <WindowManagerProvider value={{ openWindow }}>
      {booting && <BootScreen onComplete={() => { setBooting(false); setWelcoming(true); }} />}
      {welcoming && <WelcomeScreen onComplete={() => { setWelcoming(false); setSmadav(true); }} />}
      {smadav && <SmadavScreen onComplete={() => setSmadav(false)} />}
      <Desktop
        windows={windows}
        activeId={activeId}
        wallpaperCss={resolveCss(wallpaper)}
        onOpenWindow={openWindow}
        onFocusWindow={focusWindow}
        onCloseWindow={closeWindow}
        onToggleMinimize={toggleMinimize}
        onMaximizeWindow={toggleMaximize}
        onOpenDisplayProperties={openDisplayProperties}
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
        onTurnOff={() => {
          setStartMenuOpen(false);
          setShuttingDown(true);
        }}
      />
      {shuttingDown && <ShutdownScreen onComplete={() => {}} />}
      </WindowManagerProvider>
    </div>
  );
}

export default App;
