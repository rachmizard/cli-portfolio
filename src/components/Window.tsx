import { useState, useEffect, useCallback, type ReactNode, type MouseEvent } from "react";

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

interface DragState {
  startX: number;
  startY: number;
  origX: number;
  origY: number;
}

function Window({ title, children, zIndex, maximized, onFocus, onMinimize, onMaximize, onClose }: WindowProps) {
  const [pos, setPos] = useState<Position>({ x: 80, y: 60 });
  const [size, setSize] = useState<{ w: number; h: number }>({ w: 420, h: 320 });
  const [dragging, setDragging] = useState(false);
  const [dragRef] = useState<DragState>(() => ({ startX: 0, startY: 0, origX: 0, origY: 0 }));

  useEffect(() => {
    setPos({
      x: 40 + Math.random() * 120,
      y: 30 + Math.random() * 80,
    });
  }, []);

  const handleMouseDown = useCallback(
    (e: MouseEvent) => {
      if (maximized) return;
      onFocus();
      setDragging(true);
      dragRef.startX = e.clientX;
      dragRef.startY = e.clientY;
      dragRef.origX = pos.x;
      dragRef.origY = pos.y;
    },
    [pos, onFocus, dragRef, maximized],
  );

  useEffect(() => {
    if (!dragging) return;
    const handleMove = (e: globalThis.MouseEvent) => {
      setPos({
        x: dragRef.origX + (e.clientX - dragRef.startX),
        y: dragRef.origY + (e.clientY - dragRef.startY),
      });
    };
    const handleUp = () => setDragging(false);
    window.addEventListener("mousemove", handleMove);
    window.addEventListener("mouseup", handleUp);
    return () => {
      window.removeEventListener("mousemove", handleMove);
      window.removeEventListener("mouseup", handleUp);
    };
  }, [dragging, dragRef]);

  const winStyle = maximized
    ? {
        left: 0,
        top: 0,
        width: "100%",
        height: "calc(100% - 40px)",
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
    >
      {/* Title Bar */}
      <div
        className="title-bar flex items-center justify-between cursor-default select-none"
        onMouseDown={handleMouseDown}
      >
        <span className="truncate mr-2">{title}</span>
        <div className="flex gap-[2px] shrink-0">
          <button
            onClick={onMinimize}
            className="title-bar-buttons bevel-out flex items-center justify-center text-on-surface leading-none"
          >
            _
          </button>
          <button
            onClick={onMaximize}
            className="title-bar-buttons bevel-out flex items-center justify-center text-on-surface leading-none"
          >
            □
          </button>
          <button
            onClick={onClose}
            className="title-bar-buttons bevel-out flex items-center justify-center title-bar-close leading-none font-bold"
          >
            ✕
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto bg-surface-container-lowest">{children}</div>
    </div>
  );
}

export default Window;
