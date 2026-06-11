import { useState, useEffect } from "react";
import type { AppWindow } from "../types";

interface TaskbarProps {
  windows: AppWindow[];
  startMenuOpen: boolean;
  onFocusWindow: (id: string) => void;
  onToggleMinimize: (id: string) => void;
  onToggleStartMenu: () => void;
}

function Taskbar({ windows, startMenuOpen, onFocusWindow, onToggleMinimize, onToggleStartMenu }: TaskbarProps) {
  const [time, setTime] = useState("");

  useEffect(() => {
    const update = () => {
      setTime(
        new Date().toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
        }),
      );
    };
    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleTaskClick = (id: string, minimized: boolean) => {
    if (minimized) {
      onToggleMinimize(id);
      onFocusWindow(id);
    } else {
      const visible = windows.filter((x) => !x.minimized);
      const topWindow = visible.sort((a, b) => b.zIndex - a.zIndex)[0];
      if (topWindow?.id === id) {
        onToggleMinimize(id);
      } else {
        onFocusWindow(id);
      }
    }
  };

  return (
    <div className="taskbar h-[30px] flex items-center px-1 gap-0.5 z-50 text-[12px]">
      {/* Start Button */}
      <button
        onClick={onToggleStartMenu}
        className={`px-3 py-0.5 rounded-bl-xl rounded-tl-xl flex items-center gap-1 font-bold transition-all text-[13px] ${
          startMenuOpen
            ? "bevel-in bg-surface-container-lowest text-on-surface"
            : "bevel-out bg-secondary-container hover:brightness-110 text-on-secondary-container rounded-r-xl"
        }`}
      >
        <span className="text-[13px]">🪟</span>
        <span>Start</span>
      </button>

      <div className="h-6 w-[1px] bg-outline-variant/30 mx-0.5" />

      {/* Window Buttons */}
      <div className="flex-1 flex gap-0.5 overflow-x-auto">
        {windows.map((w) => {
          const visible = windows.filter((x) => !x.minimized);
          const topWindow = visible.sort((a, b) => b.zIndex - a.zIndex)[0];
          const isActive = !w.minimized && topWindow?.id === w.id;

          return (
            <button
              key={w.id}
              onClick={() => handleTaskClick(w.id, w.minimized)}
              className={`flex items-center gap-1 px-2 py-0.5 text-[11px] max-w-[160px] truncate transition-colors ${
                isActive
                  ? "bevel-in bg-surface-container-lowest"
                  : "bevel-out bg-surface-container-low"
              }`}
              style={{ fontFamily: "'Work Sans', sans-serif" }}
            >
              <span className="text-on-surface shrink-0 text-[14px]">🪟</span>
              <span className="truncate text-on-surface">{w.title}</span>
            </button>
          );
        })}
      </div>

      <div className="h-6 w-[1px] bg-outline-variant/30 mx-0.5" />

      {/* System tray */}
      <div className="bevel-in bg-surface-container-lowest px-1.5 py-0.5 text-[11px] text-on-surface shrink-0 flex items-center gap-1"
        style={{ fontFamily: "'Work Sans', sans-serif" }}>
        {time}
      </div>
    </div>
  );
}

export default Taskbar;
