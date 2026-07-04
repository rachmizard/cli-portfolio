import { useState, useEffect, useCallback, useRef, type ReactNode, type MouseEvent as ReactMouseEvent, type PointerEvent as ReactPointerEvent } from "react";
import Window from "./Window";
import { WELCOME_CONTENT, PROJECTS_CONTENT, ABOUT_CONTENT, WINAMP_CONTENT, COMPUTER_CONTENT, RECYCLE_CONTENT, MINESWEEPER_CONTENT, WORD_CONTENT, IE_CONTENT } from "../content";
import { IconTerminal, IconWinamp, IconRecycleBin, IconMyComputerIco, IconFolderIco, IconTxtIco, IconMinesweeperIco, IconWord, IconIE } from "./Icons";
import { playClick } from "../lib/sound";
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
  { id: "ie", title: "Internet Explorer", Icon: IconIE, content: IE_CONTENT, windowTitle: "Rachmizard's Homepage - Microsoft Internet Explorer" },
  { id: "about", title: "About Me.txt", Icon: IconTxtIco, content: ABOUT_CONTENT, windowTitle: "About Me.txt - Notepad" },
  { id: "projects", title: "Projects", Icon: IconFolderIco, content: PROJECTS_CONTENT, windowTitle: "Projects - File Explorer" },
  { id: "skills", title: "Skills.exe", Icon: IconTerminal, content: WELCOME_CONTENT, windowTitle: "Skills.exe - Command Prompt" },
  { id: "cv", title: "CV.doc", Icon: IconWord, content: WORD_CONTENT, windowTitle: "CV.doc - Microsoft Word" },
  { id: "winamp", title: "Winamp", Icon: IconWinamp, content: null, windowTitle: "Winamp 2.91" },
  { id: "minesweeper", title: "Minesweeper", Icon: IconMinesweeperIco, content: MINESWEEPER_CONTENT, windowTitle: "Minesweeper" },
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
  const [selectedIcons, setSelectedIcons] = useState<Set<string>>(new Set());
  const [contextMenu, setContextMenu] = useState<ContextMenu>({ x: 0, y: 0, visible: false });
  const [positions, setPositions] = useState<Record<string, IconPos>>(defaultLayout);
  const [marquee, setMarquee] = useState<{ x0: number; y0: number; x1: number; y1: number } | null>(null);

  // Active drag bookkeeping (refs avoid stale closures inside global listeners)
  const dragId = useRef<string | null>(null);
  const dragStart = useRef({ x: 0, y: 0 });
  const posSnapshot = useRef<IconPos>({ x: 0, y: 0 });
  const moved = useRef(false);
  const lastPointerType = useRef<string>("mouse");
  const rootRef = useRef<HTMLDivElement>(null);
  const marqueeActive = useRef(false);
  const marqueeMoved = useRef(false);
  const positionsRef = useRef(positions);

  useEffect(() => { positionsRef.current = positions; }, [positions]);

  const openIcon = useCallback((icon: DesktopIcon) => {
    playClick();
    if (icon.id === "winamp") {
      onOpenWindow(icon.id, icon.windowTitle, icon.id, WINAMP_CONTENT);
    } else if (icon.id === "cv") {
      onOpenWindow(icon.id, icon.windowTitle, "word", icon.content!, { w: 660, h: 560 });
    } else if (icon.id === "ie") {
      onOpenWindow(icon.id, icon.windowTitle, icon.id, icon.content!, { w: 720, h: 540 });
    } else {
      onOpenWindow(icon.id, icon.windowTitle, icon.id, icon.content!);
    }
  }, [onOpenWindow]);

  // ── Marquee (rubber-band) selection over the empty desktop ──
  const startMarquee = useCallback((clientX: number, clientY: number) => {
    const box = rootRef.current?.getBoundingClientRect();
    const x = clientX - (box?.left ?? 0);
    const y = clientY - (box?.top ?? 0);
    marqueeActive.current = true;
    marqueeMoved.current = false;
    setMarquee({ x0: x, y0: y, x1: x, y1: y });
  }, []);

  useEffect(() => {
    const onMove = (e: globalThis.PointerEvent) => {
      if (!marqueeActive.current) return;
      const box = rootRef.current?.getBoundingClientRect();
      const x = e.clientX - (box?.left ?? 0);
      const y = e.clientY - (box?.top ?? 0);
      setMarquee((prev) => {
        if (!prev) return prev;
        const next = { ...prev, x1: x, y1: y };
        if (Math.abs(next.x1 - next.x0) + Math.abs(next.y1 - next.y0) > 4) marqueeMoved.current = true;
        // Select every icon intersecting the rubber band
        const left = Math.min(next.x0, next.x1);
        const top = Math.min(next.y0, next.y1);
        const right = Math.max(next.x0, next.x1);
        const bottom = Math.max(next.y0, next.y1);
        const hit = new Set<string>();
        for (const icon of DESKTOP_ICONS) {
          const p = positionsRef.current[icon.id];
          if (p && p.x < right && p.x + ICON_W > left && p.y < bottom && p.y + ICON_H > top) {
            hit.add(icon.id);
          }
        }
        setSelectedIcons(hit);
        return next;
      });
    };
    const onUp = () => {
      if (!marqueeActive.current) return;
      marqueeActive.current = false;
      setMarquee(null);
    };
    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
    window.addEventListener("pointercancel", onUp);
    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
      window.removeEventListener("pointercancel", onUp);
    };
  }, []);

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
      const maxY = window.innerHeight - ICON_H - 30; // leave room for taskbar
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
    if (marqueeMoved.current) {
      // A rubber-band drag just ended; keep its selection
      marqueeMoved.current = false;
      hideContextMenu();
      return;
    }
    setSelectedIcons(new Set());
    onFocusWindow("");
    hideContextMenu();
  };

  return (
    <div
      ref={rootRef}
      className="flex-1 relative desktop select-none"
      style={{ background: wallpaperCss }}
      onContextMenu={handleContextMenu}
      onClick={handleDesktopClick}
    >
      {/* Desktop Icons */}
      <div
        className="absolute inset-0 z-0"
        onPointerDown={(e: ReactPointerEvent) => {
          // Only empty desktop starts a rubber band (icons stopPropagation)
          if (e.target === e.currentTarget && e.button === 0) {
            startMarquee(e.clientX, e.clientY);
          }
        }}
      >
        {DESKTOP_ICONS.map((icon) => {
          const pos = positions[icon.id];
          return (
            <button
              key={icon.id}
              style={{ position: "absolute", left: pos.x, top: pos.y, width: ICON_W, touchAction: "none" }}
              onPointerDown={(e: ReactPointerEvent) => {
                e.stopPropagation();
                lastPointerType.current = e.pointerType;
                setSelectedIcons(new Set([icon.id]));
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
              className={`desktop-icon ${selectedIcons.has(icon.id) ? "selected" : ""}`}
            >
              <div className="w-10 h-10 flex items-center justify-center pointer-events-none">
                <icon.Icon size={32} />
              </div>
              <span className="desktop-icon-text pointer-events-none">{icon.title}</span>
            </button>
          );
        })}

        {/* Rubber-band rectangle */}
        {marquee && (
          <div
            className="marquee"
            style={{
              left: Math.min(marquee.x0, marquee.x1),
              top: Math.min(marquee.y0, marquee.y1),
              width: Math.abs(marquee.x1 - marquee.x0),
              height: Math.abs(marquee.y1 - marquee.y0),
            }}
          />
        )}
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
