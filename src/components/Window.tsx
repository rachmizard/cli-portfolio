import { useState, useEffect, useCallback, useRef, type ReactNode, type MouseEvent, type TouchEvent } from "react";

interface WindowProps {
  title: string;
  children: ReactNode;
  zIndex: number;
  maximized: boolean;
  onFocus: () => void;
  onMinimize: () => void;
  onMaximize: () => void;
  onClose: () => void;
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

function Window({ title, children, zIndex, maximized, onFocus, onMinimize, onMaximize, onClose }: WindowProps) {
  const [rect, setRect] = useState<Rect>({ x: 80, y: 60, w: 420, h: 320 });
  const [interaction, setInteraction] = useState<"none" | "drag" | "resize">("none");
  const interactionStart = useRef({ x: 0, y: 0 });
  const rectSnapshot = useRef<Rect>(rect);
  const resizeDir = useRef<ResizeDir>("se");
  const rectRef = useRef(rect);

  useEffect(() => { rectRef.current = rect; }, [rect]);

  // Random initial position — clamped for mobile
  useEffect(() => {
    const isMobile = window.innerWidth < 768;
    const r: Rect = {
      x: isMobile ? 5 : 40 + Math.random() * 120,
      y: isMobile ? 30 : 30 + Math.random() * 80,
      w: isMobile ? Math.min(window.innerWidth - 10, 420) : 420,
      h: isMobile ? Math.min(window.innerHeight - 120, 320) : 320,
    };
    setRect(r);
    rectSnapshot.current = r;
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

  // ── Global move listeners ──
  useEffect(() => {
    const onMouseMove = (e: globalThis.MouseEvent) => {
      if (interaction === "drag") {
        setRect(prev => ({
          ...prev,
          x: rectSnapshot.current.x + (e.clientX - interactionStart.current.x),
          y: rectSnapshot.current.y + (e.clientY - interactionStart.current.y),
        }));
      } else if (interaction === "resize") {
        const dx = e.clientX - interactionStart.current.x;
        const dy = e.clientY - interactionStart.current.y;
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
    const onTouchMove = (e: globalThis.TouchEvent) => {
      if (interaction === "drag" || interaction === "resize") {
        e.preventDefault();
        onMouseMove({ clientX: e.touches[0].clientX, clientY: e.touches[0].clientY } as any);
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
  }, [interaction]);

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

  return (
    <div
      className={`absolute window flex flex-col shadow-xl ${maximized ? "" : "raised-bevel rounded-t-lg"}`}
      style={winStyle as React.CSSProperties}
      onMouseDown={onFocus}
      onTouchStart={onFocus}
    >
      {/* Title Bar */}
      <div
        className="title-bar flex items-center justify-between select-none touch-none"
        style={{ cursor: maximized ? "default" : "move" }}
        onMouseDown={handleTitleMouseDown}
        onTouchStart={handleTitleTouchStart}
      >
        <span className="truncate mr-2">{title}</span>
        <div className="flex gap-[2px] shrink-0">
          <button onClick={onMinimize} className="title-bar-buttons bevel-out flex items-center justify-center text-on-surface leading-none" aria-label="Minimize">_</button>
          <button onClick={onMaximize} className="title-bar-buttons bevel-out flex items-center justify-center text-on-surface leading-none" aria-label="Maximize">□</button>
          <button onClick={onClose} className="title-bar-buttons bevel-out flex items-center justify-center title-bar-close leading-none font-bold" aria-label="Close">✕</button>
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
