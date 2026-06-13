import { useState, useEffect, useCallback, useRef, type ReactNode, type MouseEvent, type TouchEvent, type AnimationEvent } from "react";
import { AppIcon, IconMinimize, IconMaximize, IconRestore, IconClose } from "./Icons";

interface WindowProps {
  title: string;
  iconKey: string;
  children: ReactNode;
  zIndex: number;
  maximized: boolean;
  active: boolean;
  onFocus: () => void;
  onMinimize: () => void;
  onMaximize: () => void;
  onClose: () => void;
  initialRect?: { x?: number; y?: number; w: number; h: number };
}

interface Rect {
  x: number;
  y: number;
  w: number;
  h: number;
}

/** Which edges a resize handle controls */
type ResizeDir = "n" | "s" | "e" | "w" | "ne" | "nw" | "se" | "sw";

const MIN_W = 220;
const MIN_H = 140;
const TASKBAR_H = 28;

const REDUCED_MOTION =
  typeof window !== "undefined" &&
  window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

function Window({ title, iconKey, children, zIndex, maximized, active, onFocus, onMinimize, onMaximize, onClose, initialRect }: WindowProps) {
  const [rect, setRect] = useState<Rect>({ x: 80, y: 60, w: 420, h: 320 });
  const [interaction, setInteraction] = useState<"none" | "drag" | "resize">("none");
  const [exiting, setExiting] = useState<"closing" | "minimizing" | null>(null);
  const interactionStart = useRef({ x: 0, y: 0 });
  const rectSnapshot = useRef<Rect>(rect);
  const resizeDir = useRef<ResizeDir>("se");
  const rectRef = useRef(rect);

  useEffect(() => { rectRef.current = rect; }, [rect]);

  // Random initial position — clamped for mobile
  useEffect(() => {
    const isMobile = window.innerWidth < 768;
    const defaultX = isMobile ? 5 : 40 + Math.random() * 120;
    const defaultY = isMobile ? 30 : 30 + Math.random() * 80;
    const defaultW = isMobile ? Math.min(window.innerWidth - 10, 420) : 420;
    const defaultH = isMobile ? Math.min(window.innerHeight - 120, 320) : 320;
    const r: Rect = initialRect
      ? {
          x: isMobile ? 5 : initialRect.x ?? defaultX,
          y: isMobile ? 30 : initialRect.y ?? defaultY,
          w: isMobile ? Math.min(window.innerWidth - 10, initialRect.w) : initialRect.w,
          h: isMobile ? Math.min(window.innerHeight - 120, initialRect.h) : initialRect.h,
        }
      : { x: defaultX, y: defaultY, w: defaultW, h: defaultH };
    setRect(r);
    rectSnapshot.current = r;
  }, [initialRect]);

  // Keep the title bar reachable: clamp so it never leaves the viewport
  const clampPos = useCallback((x: number, y: number, w: number): { x: number; y: number } => {
    const maxX = window.innerWidth - 60;
    const maxY = window.innerHeight - TASKBAR_H - 30;
    return {
      x: Math.min(Math.max(x, 60 - w), maxX),
      y: Math.min(Math.max(y, 0), maxY),
    };
  }, []);

  // ── Drag ──
  const startDrag = useCallback((clientX: number, clientY: number) => {
    if (maximized) return;
    onFocus();
    interactionStart.current = { x: clientX, y: clientY };
    rectSnapshot.current = { ...rectRef.current };
    setInteraction("drag");
  }, [maximized, onFocus]);

  const handleTitleMouseDown = useCallback((e: MouseEvent) => {
    e.preventDefault(); e.stopPropagation();
    startDrag(e.clientX, e.clientY);
  }, [startDrag]);
  const handleTitleTouchStart = useCallback((e: TouchEvent) => {
    e.preventDefault(); e.stopPropagation();
    startDrag(e.touches[0].clientX, e.touches[0].clientY);
  }, [startDrag]);

  // ── Resize ──
  const startResize = useCallback((dir: ResizeDir, clientX: number, clientY: number) => {
    if (maximized) return;
    onFocus();
    resizeDir.current = dir;
    interactionStart.current = { x: clientX, y: clientY };
    rectSnapshot.current = { ...rectRef.current };
    setInteraction("resize");
  }, [maximized, onFocus]);

  const resizeHandlers = useCallback((dir: ResizeDir) => ({
    onMouseDown: (e: MouseEvent) => {
      e.preventDefault(); e.stopPropagation();
      startResize(dir, e.clientX, e.clientY);
    },
  }), [startResize]);

  // ── Exit transitions (close/minimize play locally, then notify parent) ──
  const handleClose = useCallback(() => {
    if (REDUCED_MOTION) { onClose(); return; }
    setExiting("closing");
  }, [onClose]);
  const handleMinimize = useCallback(() => {
    if (REDUCED_MOTION) { onMinimize(); return; }
    setExiting("minimizing");
  }, [onMinimize]);
  const handleExitEnd = useCallback((e: AnimationEvent) => {
    if (e.target !== e.currentTarget) return;
    if (exiting === "closing") onClose();
    else if (exiting === "minimizing") { setExiting(null); onMinimize(); }
  }, [exiting, onClose, onMinimize]);

  // ── Global move listeners ──
  useEffect(() => {
    const handleMove = (clientX: number, clientY: number) => {
      if (interaction === "drag") {
        const snap = rectSnapshot.current;
        const pos = clampPos(
          snap.x + (clientX - interactionStart.current.x),
          snap.y + (clientY - interactionStart.current.y),
          snap.w,
        );
        setRect(prev => ({ ...prev, x: pos.x, y: pos.y }));
      } else if (interaction === "resize") {
        const dx = clientX - interactionStart.current.x;
        const dy = clientY - interactionStart.current.y;
        const snap = rectSnapshot.current;
        const dir = resizeDir.current;
        let nx = snap.x, ny = snap.y, nw = snap.w, nh = snap.h;

        if (dir.includes("e")) nw = Math.max(MIN_W, snap.w + dx);
        if (dir.includes("w")) { nw = Math.max(MIN_W, snap.w - dx); nx = snap.x + (snap.w - nw); }
        if (dir.includes("s")) nh = Math.max(MIN_H, snap.h + dy);
        if (dir.includes("n")) { nh = Math.max(MIN_H, snap.h - dy); ny = snap.y + (snap.h - nh); }

        setRect({ x: nx, y: ny, w: nw, h: nh });
      }
    };
    const onMouseMove = (e: globalThis.MouseEvent) => handleMove(e.clientX, e.clientY);
    const onTouchMove = (e: globalThis.TouchEvent) => {
      if (interaction === "drag" || interaction === "resize") {
        e.preventDefault();
        handleMove(e.touches[0].clientX, e.touches[0].clientY);
      }
    };
    const onUp = () => setInteraction("none");

    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onUp);
    window.addEventListener("touchmove", onTouchMove, { passive: false });
    window.addEventListener("touchend", onUp);
    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onUp);
      window.removeEventListener("touchmove", onTouchMove);
      window.removeEventListener("touchend", onUp);
    };
  }, [interaction, clampPos]);

  // ── Styles ──
  const winStyle = maximized
    ? { left: 0, top: 0, width: "100%", height: "calc(100% - 28px)", zIndex }
    : { left: rect.x, top: rect.y, width: rect.w, height: rect.h, zIndex };

  // Cursor for resize handles
  const cursorMap: Record<ResizeDir, string> = {
    n: "n-resize", s: "s-resize", e: "e-resize", w: "w-resize",
    ne: "ne-resize", nw: "nw-resize", se: "se-resize", sw: "sw-resize",
  };

  const resizeZones: ResizeDir[] = ["n", "s", "e", "w", "ne", "nw", "se", "sw"];

  const exitClass = exiting === "closing" ? "window-closing" : exiting === "minimizing" ? "window-minimizing" : "window-open";

  return (
    <div
      className={`absolute window flex flex-col ${active ? "window-active" : "window-inactive"} ${maximized ? "" : "raised-bevel rounded-t-lg"} ${exitClass}`}
      style={winStyle as React.CSSProperties}
      onMouseDown={onFocus}
      onTouchStart={onFocus}
      onAnimationEnd={handleExitEnd}
    >
      {/* Title Bar */}
      <div
        className={`title-bar flex items-center justify-between select-none touch-none ${active ? "" : "inactive"}`}
        style={{ cursor: maximized ? "default" : "move" }}
        onMouseDown={handleTitleMouseDown}
        onTouchStart={handleTitleTouchStart}
        onDoubleClick={onMaximize}
      >
        <div className="flex items-center gap-1.5 min-w-0">
          <AppIcon iconKey={iconKey} size={16} />
          <span className="truncate mr-2">{title}</span>
        </div>
        <div className="flex gap-[2px] shrink-0">
          <button onClick={(e) => { e.stopPropagation(); handleMinimize(); }} data-tooltip="Minimize" className="title-bar-buttons bevel-out flex items-center justify-center text-on-surface leading-none" aria-label="Minimize"><IconMinimize /></button>
          <button onClick={(e) => { e.stopPropagation(); onMaximize(); }} data-tooltip={maximized ? "Restore" : "Maximize"} className="title-bar-buttons bevel-out flex items-center justify-center text-on-surface leading-none" aria-label={maximized ? "Restore" : "Maximize"}>{maximized ? <IconRestore /> : <IconMaximize />}</button>
          <button onClick={(e) => { e.stopPropagation(); handleClose(); }} data-tooltip="Close" className="title-bar-buttons bevel-out flex items-center justify-center title-bar-close leading-none font-bold" aria-label="Close"><IconClose /></button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-hidden bg-surface-container-lowest">{children}</div>

      {/* Resize handles — desktop only, not when maximized */}
      {!maximized && (
        <>
          {resizeZones.map((dir) => (
            <div
              key={dir}
              {...resizeHandlers(dir)}
              className="absolute z-10"
              style={{
                cursor: cursorMap[dir],
                ...(dir === "n"  && { top: 0, left: 4, right: 4, height: 4 }),
                ...(dir === "s"  && { bottom: 0, left: 4, right: 4, height: 4 }),
                ...(dir === "e"  && { right: 0, top: 4, bottom: 4, width: 4 }),
                ...(dir === "w"  && { left: 0, top: 4, bottom: 4, width: 4 }),
                ...(dir === "ne" && { top: 0, right: 0, width: 8, height: 8 }),
                ...(dir === "nw" && { top: 0, left: 0, width: 8, height: 8 }),
                ...(dir === "se" && { bottom: 0, right: 0, width: 8, height: 8 }),
                ...(dir === "sw" && { bottom: 0, left: 0, width: 8, height: 8 }),
              }}
            />
          ))}
        </>
      )}
    </div>
  );
}

export default Window;
