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

interface Position {
  x: number;
  y: number;
}

function Window({ title, children, zIndex, maximized, onFocus, onMinimize, onMaximize, onClose }: WindowProps) {
  const [pos, setPos] = useState<Position>({ x: 80, y: 60 });
  const [size, setSize] = useState<{ w: number; h: number }>({ w: 420, h: 320 });
  const dragging = useRef(false);
  const dragStart = useRef({ x: 0, y: 0 });
  const dragOrig = useRef({ x: 0, y: 0 });
  const posRef = useRef(pos);

  // keep posRef in sync for event handlers
  useEffect(() => {
    posRef.current = pos;
  }, [pos]);

  // Random initial position — clamped for mobile
  useEffect(() => {
    const isMobile = window.innerWidth < 768;
    setPos({
      x: isMobile ? 5 : 40 + Math.random() * 120,
      y: isMobile ? 30 : 30 + Math.random() * 80,
    });
    if (isMobile) {
      setSize({ w: Math.min(window.innerWidth - 10, 420), h: Math.min(window.innerHeight - 120, 320) });
    }
  }, []);

  // Shared drag start logic
  const startDrag = useCallback(
    (clientX: number, clientY: number) => {
      if (maximized) return;
      onFocus();
      dragging.current = true;
      dragStart.current = { x: clientX, y: clientY };
      dragOrig.current = { ...posRef.current };
    },
    [maximized, onFocus],
  );

  // Stop drag
  const stopDrag = useCallback(() => {
    dragging.current = false;
  }, []);

  // Mouse handlers
  const handleMouseDown = useCallback(
    (e: MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      startDrag(e.clientX, e.clientY);
    },
    [startDrag],
  );

  // Touch handlers
  const handleTouchStart = useCallback(
    (e: TouchEvent) => {
      e.preventDefault();
      e.stopPropagation();
      const touch = e.touches[0];
      startDrag(touch.clientX, touch.clientY);
    },
    [startDrag],
  );

  // Global move/end listeners
  useEffect(() => {
    const handleMove = (clientX: number, clientY: number) => {
      if (!dragging.current) return;
      setPos({
        x: dragOrig.current.x + (clientX - dragStart.current.x),
        y: dragOrig.current.y + (clientY - dragStart.current.y),
      });
    };

    const onMouseMove = (e: globalThis.MouseEvent) => handleMove(e.clientX, e.clientY);
    const onTouchMove = (e: globalThis.TouchEvent) => {
      e.preventDefault();
      const touch = e.touches[0];
      handleMove(touch.clientX, touch.clientY);
    };
    const onMouseUp = () => stopDrag();
    const onTouchEnd = () => stopDrag();

    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);
    window.addEventListener("touchmove", onTouchMove, { passive: false });
    window.addEventListener("touchend", onTouchEnd);

    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
      window.removeEventListener("touchmove", onTouchMove);
      window.removeEventListener("touchend", onTouchEnd);
    };
  }, [stopDrag]);

  const winStyle = maximized
    ? {
        left: 0,
        top: 0,
        width: "100%",
        height: "calc(100% - 28px)",
        zIndex,
      }
    : {
        left: pos.x,
        top: pos.y,
        width: size.w,
        minHeight: size.h,
        maxHeight: "70vh",
        zIndex,
      };

  return (
    <div
      className={`absolute window flex flex-col shadow-xl ${maximized ? "" : "raised-bevel rounded-t-lg"}`}
      style={winStyle as React.CSSProperties}
      onMouseDown={onFocus}
      onTouchStart={onFocus}
    >
      {/* Title Bar */}
      <div
        className="title-bar flex items-center justify-between cursor-default select-none touch-none"
        onMouseDown={handleMouseDown}
        onTouchStart={handleTouchStart}
      >
        <span className="truncate mr-2">{title}</span>
        <div className="flex gap-[2px] shrink-0">
          <button
            onClick={onMinimize}
            className="title-bar-buttons bevel-out flex items-center justify-center text-on-surface leading-none"
            aria-label="Minimize"
          >
            _
          </button>
          <button
            onClick={onMaximize}
            className="title-bar-buttons bevel-out flex items-center justify-center text-on-surface leading-none"
            aria-label="Maximize"
          >
            □
          </button>
          <button
            onClick={onClose}
            className="title-bar-buttons bevel-out flex items-center justify-center title-bar-close leading-none font-bold"
            aria-label="Close"
          >
            ✕
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-hidden bg-surface-container-lowest">{children}</div>
    </div>
  );
}

export default Window;
