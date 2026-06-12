import { useState, useEffect, useCallback, type ReactNode, type MouseEvent as ReactMouseEvent } from "react";
import Window from "./Window";
import { WELCOME_CONTENT, PROJECTS_CONTENT, ABOUT_CONTENT, WINAMP_CONTENT, COMPUTER_CONTENT, RECYCLE_CONTENT } from "../content";
import { IconDocument, IconFolder, IconTerminal, IconPDF, IconWinamp, IconMyComputer, IconRecycleBin } from "./Icons";
import type { AppWindow } from "../types";

interface DesktopIcon {
  id: string;
  title: string;
  Icon: (p: { size?: number }) => JSX.Element;
  content: ReactNode | null;
  windowTitle: string;
}

interface DesktopProps {
  windows: AppWindow[];
  activeId: string;
  wallpaperCss: string;
  onOpenWindow: (id: string, title: string, icon: string, content: ReactNode) => void;
  onFocusWindow: (id: string) => void;
  onCloseWindow: (id: string) => void;
  onToggleMinimize: (id: string) => void;
  onMaximizeWindow: (id: string) => void;
  onOpenDisplayProperties: () => void;
}

interface ContextMenu {
  x: number;
  y: number;
  visible: boolean;
}

const DESKTOP_ICONS: DesktopIcon[] = [
  { id: "computer", title: "My Computer", Icon: IconMyComputer, content: COMPUTER_CONTENT, windowTitle: "My Computer" },
  { id: "about", title: "About Me.txt", Icon: IconDocument, content: ABOUT_CONTENT, windowTitle: "About Me.txt - Notepad" },
  { id: "projects", title: "Projects", Icon: IconFolder, content: PROJECTS_CONTENT, windowTitle: "Projects - File Explorer" },
  { id: "skills", title: "Skills.exe", Icon: IconTerminal, content: WELCOME_CONTENT, windowTitle: "Skills.exe - Command Prompt" },
  { id: "cv", title: "CV.pdf", Icon: IconPDF, content: null, windowTitle: "" },
  { id: "winamp", title: "Winamp", Icon: IconWinamp, content: null, windowTitle: "Winamp 2.91" },
  { id: "recycle", title: "Recycle Bin", Icon: IconRecycleBin, content: RECYCLE_CONTENT, windowTitle: "Recycle Bin" },
];

function Desktop({
  windows,
  activeId,
  wallpaperCss,
  onOpenWindow,
  onFocusWindow,
  onCloseWindow,
  onToggleMinimize,
  onMaximizeWindow,
  onOpenDisplayProperties,
}: DesktopProps) {
  const [selectedIcon, setSelectedIcon] = useState<string | null>(null);
  const [contextMenu, setContextMenu] = useState<ContextMenu>({ x: 0, y: 0, visible: false });

  const handleContextMenu = useCallback((e: ReactMouseEvent) => {
    e.preventDefault();
    setContextMenu({ x: e.clientX, y: e.clientY, visible: true });
  }, []);

  const hideContextMenu = useCallback(() => {
    setContextMenu((prev) => ({ ...prev, visible: false }));
  }, []);

  useEffect(() => {
    if (contextMenu.visible) {
      const handler = () => hideContextMenu();
      window.addEventListener("click", handler);
      return () => window.removeEventListener("click", handler);
    }
  }, [contextMenu.visible, hideContextMenu]);

  const handleDesktopClick = () => {
    setSelectedIcon(null);
    onFocusWindow("");
    hideContextMenu();
  };

  return (
    <div
      className="flex-1 relative desktop select-none"
      style={{ background: wallpaperCss }}
      onContextMenu={handleContextMenu}
      onClick={handleDesktopClick}
    >
      {/* Desktop Icons */}
      <div className="absolute top-0 left-0 p-3 grid grid-cols-1 gap-1 w-24 z-0">
        {DESKTOP_ICONS.map((icon) => (
          <button
            key={icon.id}
            onClick={(e) => {
              e.stopPropagation();
              setSelectedIcon(icon.id);
            }}
            onDoubleClick={(e) => {
              e.stopPropagation();
              if (icon.id === "cv") {
                window.open("/cv.pdf", "_blank");
              } else if (icon.id === "winamp") {
                onOpenWindow(icon.id, icon.windowTitle, icon.id, WINAMP_CONTENT);
              } else {
                onOpenWindow(icon.id, icon.windowTitle, icon.id, icon.content!);
              }
            }}
            className={`desktop-icon ${selectedIcon === icon.id ? "selected" : ""}`}
          >
            <div className="w-10 h-10 flex items-center justify-center pointer-events-none">
              <icon.Icon size={32} />
            </div>
            <span className="desktop-icon-text">{icon.title}</span>
          </button>
        ))}
      </div>

      {/* Windows */}
      {windows
        .filter((w) => !w.minimized)
        .sort((a, b) => a.zIndex - b.zIndex)
        .map((w) => (
          <Window
            key={w.id}
            title={w.title}
            iconKey={w.icon}
            zIndex={w.zIndex}
            maximized={w.maximized}
            active={w.id === activeId}
            onFocus={() => onFocusWindow(w.id)}
            onMinimize={() => onToggleMinimize(w.id)}
            onMaximize={() => onMaximizeWindow(w.id)}
            onClose={() => onCloseWindow(w.id)}
          >
            {w.content}
          </Window>
        ))}

      {/* Context Menu */}
      {contextMenu.visible && (
        <div
          className="fixed z-[9999] bevel-out-thin bg-surface-container-lowest py-0.5 min-w-[180px] font-body text-[11px]"
          style={{ left: contextMenu.x, top: contextMenu.y }}
          onClick={(e) => e.stopPropagation()}
        >
          {[
            { label: "Arrange Icons By", disabled: true },
            { label: "Refresh", action: () => window.location.reload() },
            { divider: true },
            { label: "Paste", disabled: true },
            { label: "Paste Shortcut", disabled: true },
            { divider: true },
            { label: "New", disabled: true },
            { divider: true },
            { label: "Properties", action: onOpenDisplayProperties },
          ].map((item, i) => {
            if ("divider" in item) {
              return <div key={i} className="border-t border-outline-variant my-0.5" />;
            }
            return (
              <button
                key={i}
                disabled={item.disabled}
                className={`w-full text-left px-6 py-1 hover:bg-primary hover:text-on-primary ${
                  item.disabled ? "text-outline" : "text-on-surface"
                }`}
                onClick={item.action}
              >
                {item.label}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default Desktop;
