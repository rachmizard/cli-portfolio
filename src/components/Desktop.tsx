import { useState, useEffect, useCallback, useRef, type ReactNode, type MouseEvent as ReactMouseEvent, type PointerEvent as ReactPointerEvent } from "react";
import Window from "./Window";
import { WELCOME_CONTENT, PROJECTS_CONTENT, ABOUT_CONTENT, WINAMP_CONTENT, COMPUTER_CONTENT, RECYCLE_CONTENT, MINESWEEPER_CONTENT, WORD_CONTENT } from "../content";
import { IconTerminal, IconWinamp, IconRecycleBin, IconMyComputerIco, IconFolderIco, IconTxtIco, IconMinesweeper, IconWord } from "./Icons";
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
  onOpenWindow: (id: string, title: string, icon: string, content: ReactNode, initialRect?: AppWindow["initialRect"]) => void;
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

interface IconPos {
  x: number;
  y: number;
}

// Grid metrics for default icon layout
const ICON_W = 76;
const ICON_H = 74;
const ICON_PAD = 8;
const DRAG_THRESHOLD = 5; // px of movement before a press counts as a drag, not a tap

function defaultLayout(): Record<string, IconPos> {
  const layout: Record<string, IconPos> = {};
  DESKTOP_ICONS.forEach((icon, i) => {
    layout[icon.id] = { x: ICON_PAD, y: ICON_PAD + i * ICON_H };
  });
  return layout;
}

const DESKTOP_ICONS: DesktopIcon[] = [
  { id: "computer", title: "My Computer", Icon: IconMyComputerIco, content: COMPUTER_CONTENT, windowTitle: "My Computer" },
  { id: "about", title: "About Me.txt", Icon: IconTxtIco, content: ABOUT_CONTENT, windowTitle: "About Me.txt - Notepad" },
  { id: "projects", title: "Projects", Icon: IconFolderIco, content: PROJECTS_CONTENT, windowTitle: "Projects - File Explorer" },
  { id: "skills", title: "Skills.exe", Icon: IconTerminal, content: WELCOME_CONTENT, windowTitle: "Skills.exe - Command Prompt" },
  { id: "cv", title: "CV.doc", Icon: IconWord, content: WORD_CONTENT, windowTitle: "CV.doc - Microsoft Word" },
  { id: "winamp", title: "Winamp", Icon: IconWinamp, content: null, windowTitle: "Winamp 2.91" },
  { id: "minesweeper", title: "Minesweeper", Icon: IconMinesweeper, content: MINESWEEPER_CONTENT, windowTitle: "Minesweeper" },
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
  const [positions, setPositions] = useState<Record<string, IconPos>>(defaultLayout);

  // Active drag bookkeeping (refs avoid stale closures inside global listeners)
  const dragId = useRef<string | null>(null);
  const dragStart = useRef({ x: 0, y: 0 });
  const posSnapshot = useRef<IconPos>({ x: 0, y: 0 });
  const moved = useRef(false);
  const lastPointerType = useRef<string>("mouse");

  const openIcon = useCallback((icon: DesktopIcon) => {
    if (icon.id === "winamp") {
      onOpenWindow(icon.id, icon.windowTitle, icon.id, WINAMP_CONTENT);
    } else if (icon.id === "cv") {
      onOpenWindow(icon.id, icon.windowTitle, "word", icon.content!, { w: 660, h: 560 });
    } else {
      onOpenWindow(icon.id, icon.windowTitle, icon.id, icon.content!);
    }
  }, [onOpenWindow]);

  const startIconDrag = useCallback((id: string, clientX: number, clientY: number) => {
    dragId.current = id;
    dragStart.current = { x: clientX, y: clientY };
    posSnapshot.current = positions[id];
    moved.current = false;
  }, [positions]);

  useEffect(() => {
    const onMove = (e: globalThis.PointerEvent) => {
      const id = dragId.current;
      if (!id) return;
      const dx = e.clientX - dragStart.current.x;
      const dy = e.clientY - dragStart.current.y;
      if (!moved.current && Math.hypot(dx, dy) < DRAG_THRESHOLD) return;
      moved.current = true;
      const snap = posSnapshot.current;
      const maxX = window.innerWidth - ICON_W;
      const maxY = window.innerHeight - ICON_H - 28; // leave room for taskbar
      const nx = Math.min(Math.max(snap.x + dx, 0), maxX);
      const ny = Math.min(Math.max(snap.y + dy, 0), maxY);
      setPositions((prev) => ({ ...prev, [id]: { x: nx, y: ny } }));
    };
    const onUp = () => { dragId.current = null; };
    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
    window.addEventListener("pointercancel", onUp);
    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
      window.removeEventListener("pointercancel", onUp);
    };
  }, []);

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
      <div className="absolute inset-0 z-0">
        {DESKTOP_ICONS.map((icon) => {
          const pos = positions[icon.id];
          return (
            <button
              key={icon.id}
              style={{ position: "absolute", left: pos.x, top: pos.y, width: ICON_W, touchAction: "none" }}
              onPointerDown={(e: ReactPointerEvent) => {
                e.stopPropagation();
                lastPointerType.current = e.pointerType;
                setSelectedIcon(icon.id);
                startIconDrag(icon.id, e.clientX, e.clientY);
              }}
              onClick={(e) => {
                e.stopPropagation();
                if (moved.current) return; // was a drag, not a tap
                // Single tap opens on touch/pen; mouse waits for double-click
                if (lastPointerType.current !== "mouse") openIcon(icon);
              }}
              onDoubleClick={(e) => {
                e.stopPropagation();
                openIcon(icon);
              }}
              className={`desktop-icon ${selectedIcon === icon.id ? "selected" : ""}`}
            >
              <div className="w-10 h-10 flex items-center justify-center pointer-events-none">
                <icon.Icon size={32} />
              </div>
              <span className="desktop-icon-text pointer-events-none">{icon.title}</span>
            </button>
          );
        })}
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
            initialRect={w.initialRect}
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
