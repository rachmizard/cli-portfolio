import { useState, useEffect, useCallback, type ReactNode, type MouseEvent as ReactMouseEvent } from "react";
import Window from "./Window";
import { WELCOME_CONTENT, PROJECTS_CONTENT, ABOUT_CONTENT } from "../content";
import { IconDocument, IconFolder, IconTerminal, IconPDF } from "./Icons";
import type { AppWindow } from "../types";

interface DesktopIcon {
  id: string;
  title: string;
  Icon: () => JSX.Element;
  content: ReactNode | null;
  windowTitle: string;
}

interface DesktopProps {
  windows: AppWindow[];
  onOpenWindow: (id: string, title: string, icon: string, content: ReactNode) => void;
  onFocusWindow: (id: string) => void;
  onCloseWindow: (id: string) => void;
  onToggleMinimize: (id: string) => void;
  onMaximizeWindow: (id: string) => void;
  onStartMenuOpen: () => void;
}

interface ContextMenu {
  x: number;
  y: number;
  visible: boolean;
}

const DESKTOP_ICONS: DesktopIcon[] = [
  { id: "about", title: "About Me.txt", Icon: IconDocument, content: ABOUT_CONTENT, windowTitle: "About Me.txt - Notepad" },
  { id: "projects", title: "Projects", Icon: IconFolder, content: PROJECTS_CONTENT, windowTitle: "Projects - File Explorer" },
  { id: "skills", title: "Skills.exe", Icon: IconTerminal, content: WELCOME_CONTENT, windowTitle: "Skills.exe - Command Prompt" },
  { id: "cv", title: "CV.pdf", Icon: IconPDF, content: null, windowTitle: "" },
];

function Desktop({
  windows,
  onOpenWindow,
  onFocusWindow,
  onCloseWindow,
  onToggleMinimize,
  onMaximizeWindow,
  onStartMenuOpen,
}: DesktopProps) {
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

  return (
    <div
      className="flex-1 relative desktop"
      onContextMenu={handleContextMenu}
      onClick={() => onFocusWindow("")}
    >
      {/* Desktop Icons */}
      <div className="absolute top-0 left-0 p-4 grid grid-cols-1 gap-6 w-24 z-0">
        {DESKTOP_ICONS.map((icon) => (
          <button
            key={icon.id}
            onDoubleClick={() => {
              if (icon.id === "cv") {
                window.open("/cv.pdf", "_blank");
              } else {
                onOpenWindow(icon.id, icon.windowTitle, icon.id, icon.content!);
              }
            }}
            className="flex flex-col items-center group focus:outline-none cursor-pointer"
          >
            <div className="w-10 h-10 mb-1 flex items-center justify-center">
              <icon.Icon />
            </div>
            <span className="text-white font-mono text-[11px] text-center px-1 bg-primary/80 leading-tight">
              {icon.title}
            </span>
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
            zIndex={w.zIndex}
            maximized={w.maximized}
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
          className="fixed z-[9999] bevel-out bg-surface-container-lowest py-1 min-w-[180px] shadow-lg"
          style={{ left: contextMenu.x, top: contextMenu.y }}
        >
          {[
            { label: "Arrange Icons By", sub: ["Name", "Type", "Size", "Date"] },
            { label: "Refresh", action: () => window.location.reload() },
            { divider: true },
            { label: "New", sub: ["Folder", "Text Document"] },
            { divider: true },
            { label: "Properties", action: () => onStartMenuOpen() },
          ].map((item, i) => {
            if ("divider" in item) {
              return <div key={i} className="border-t border-outline-variant my-1" />;
            }
            return (
              <button
                key={i}
                className="w-full text-left px-6 py-1 text-[13px] text-on-surface hover:bg-primary hover:text-on-primary font-body flex items-center justify-between"
                onClick={item.action}
              >
                {item.label}
                {item.sub && <span className="text-[10px] text-outline">▶</span>}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default Desktop;
