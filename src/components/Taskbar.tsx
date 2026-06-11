import { useState, useEffect } from "react";
import type { AppWindow } from "../types";

interface TaskbarProps {
  windows: AppWindow[];
  startMenuOpen: boolean;
  onFocusWindow: (id: string) => void;
  onToggleMinimize: (id: string) => void;
  onToggleStartMenu: () => void;
}

/** Windows flag (simplified XP-era logo) */
function WinFlag() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" className="inline-block -mt-0.5">
      <rect x="1" y="1" width="6" height="6" rx="1" fill="#fff" opacity="0.9" />
      <rect x="9" y="1" width="6" height="6" rx="1" fill="#fff" opacity="0.7" />
      <rect x="1" y="9" width="6" height="6" rx="1" fill="#fff" opacity="0.7" />
      <rect x="9" y="9" width="6" height="6" rx="1" fill="#fff" opacity="0.9" />
    </svg>
  );
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
    const interval = setInterval(update, 30000);
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
    <div className="taskbar h-[28px] flex items-center px-0.5 z-50">
      {/* Start Button */}
      <button
        onClick={onToggleStartMenu}
        className={`btn-start bevel-out-thin px-3 py-0.5 flex items-center gap-1 ${
          startMenuOpen ? "pressed" : ""
        }`}
      >
        <WinFlag />
        <span>start</span>
      </button>

      <div className="w-[3px]" />

      {/* Quick Launch area (optional) */}
      <div className="flex items-center gap-0.5 shrink-0" />

      {/* Window Buttons */}
      <div className="flex-1 flex gap-0.5 overflow-x-auto px-1">
        {windows.map((w) => {
          const visible = windows.filter((x) => !x.minimized);
          const topWindow = visible.sort((a, b) => b.zIndex - a.zIndex)[0];
          const isActive = !w.minimized && topWindow?.id === w.id;

          return (
            <button
              key={w.id}
              onClick={() => handleTaskClick(w.id, w.minimized)}
              className={`task-btn bevel-out-thin max-w-[170px] truncate flex items-center gap-1 ${
                isActive ? "active" : ""
              }`}
            >
              <span className="text-[13px] shrink-0">
                <WinFlag />
              </span>
              <span className="truncate">{w.title}</span>
            </button>
          );
        })}
      </div>

      {/* System Tray */}
      <div className="tray bevel-in flex items-center gap-1">
        {time}
      </div>
    </div>
  );
}

export default Taskbar;
