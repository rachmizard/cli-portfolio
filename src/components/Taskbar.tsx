import { useState, useEffect } from "react";
import type { AppWindow } from "../types";

interface TaskbarProps {
  windows: AppWindow[];
  onFocusWindow: (id: string) => void;
  onToggleMinimize: (id: string) => void;
}

function Taskbar({ windows, onFocusWindow, onToggleMinimize }: TaskbarProps) {
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
    <div className="taskbar h-10 flex items-center px-1 gap-1 z-50">
      <button className="bevel-out bg-secondary-container hover:brightness-110 px-3 py-0.5 rounded-full flex items-center gap-1 mr-2">
        <span className="material-symbols-outlined text-[18px] text-on-secondary-container">
          terminal
        </span>
        <span
          className="font-bold text-[13px] text-on-secondary-container"
          style={{ fontFamily: "'Work Sans', sans-serif" }}
        >
          Start
        </span>
      </button>

      <div className="h-8 w-[1px] bg-outline-variant/30" />

      <div className="flex-1 flex gap-1 overflow-x-auto">
        {windows.map((w) => {
          const visible = windows.filter((x) => !x.minimized);
          const topWindow = visible.sort((a, b) => b.zIndex - a.zIndex)[0];
          const isActive = !w.minimized && topWindow?.id === w.id;

          return (
            <button
              key={w.id}
              onClick={() => handleTaskClick(w.id, w.minimized)}
              className={`flex items-center gap-1 px-3 py-1 text-[12px] max-w-[160px] truncate transition-colors ${
                isActive
                  ? "bevel-in bg-surface-container-lowest"
                  : "bevel-out bg-surface-container-low"
              }`}
              style={{ fontFamily: "'Courier Prime', monospace" }}
            >
              <span className="material-symbols-outlined text-[14px] text-on-surface shrink-0">
                terminal
              </span>
              <span className="truncate text-on-surface">{w.title}</span>
            </button>
          );
        })}
      </div>

      <div className="h-8 w-[1px] bg-outline-variant/30" />

      <div
        className="bevel-in bg-surface-container-lowest px-2 py-0.5 text-[12px] text-on-surface shrink-0"
        style={{ fontFamily: "'Courier Prime', monospace" }}
      >
        {time}
      </div>
    </div>
  );
}

export default Taskbar;
