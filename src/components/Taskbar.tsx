import { useState, useEffect } from "react";
import type { AppWindow } from "../types";
import { AppIcon } from "./Icons";

interface TaskbarProps {
  windows: AppWindow[];
  activeId: string;
  startMenuOpen: boolean;
  onFocusWindow: (id: string) => void;
  onToggleMinimize: (id: string) => void;
  onToggleStartMenu: () => void;
  onShowDesktop: () => void;
}

/** Authentic XP-style four-color wavy Windows flag */
function WinFlag() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" className="inline-block -mt-0.5 drop-shadow-sm">
      <defs>
        <clipPath id="xpflag">
          <path d="M2 5C6 3.5 10 3.5 14 5C18 6.5 21 6.5 22 6V18C20 18.8 17 18.5 14 17.3C10 15.8 6 15.8 2 17.3Z" />
        </clipPath>
      </defs>
      <g clipPath="url(#xpflag)" transform="rotate(-8 12 11)">
        <rect x="1" y="2" width="10.5" height="8" fill="#f24f4f" />
        <rect x="12.5" y="2" width="11" height="8" fill="#6fbf3f" />
        <rect x="1" y="11" width="10.5" height="9" fill="#3b8fe0" />
        <rect x="12.5" y="11" width="11" height="9" fill="#f6c23e" />
      </g>
    </svg>
  );
}

function IconVolume() {
  return (
    <svg width="14" height="14" viewBox="0 0 16 16">
      <path d="M2 6H5L9 3V13L5 10H2Z" fill="#fff" />
      <path d="M11 5C12.5 6.5 12.5 9.5 11 11M12.5 3C15 5.5 15 10.5 12.5 13" stroke="#fff" strokeWidth="1" fill="none" strokeLinecap="round" />
    </svg>
  );
}

function Taskbar({ windows, activeId, startMenuOpen, onFocusWindow, onToggleMinimize, onToggleStartMenu, onShowDesktop }: TaskbarProps) {
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
    } else if (activeId === id) {
      onToggleMinimize(id);
    } else {
      onFocusWindow(id);
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

      {/* Quick Launch */}
      <div className="quick-launch flex items-center px-1 shrink-0">
        <button onClick={onShowDesktop} title="Show Desktop" className="ql-btn flex items-center justify-center">
          <svg width="14" height="14" viewBox="0 0 16 16">
            <rect x="1" y="1" width="14" height="14" rx="1" fill="#d9b441" stroke="#9a7a20" strokeWidth="0.6" />
            <path d="M8 4L11 7H9V11H7V7H5Z" fill="#fff" transform="rotate(180 8 7.5)" />
            <rect x="3" y="11" width="10" height="1.5" fill="#fff" />
          </svg>
        </button>
      </div>

      {/* Window Buttons */}
      <div className="flex-1 flex gap-0.5 overflow-x-auto px-1">
        {windows.map((w) => {
          const isActive = !w.minimized && activeId === w.id;
          return (
            <button
              key={w.id}
              onClick={() => handleTaskClick(w.id, w.minimized)}
              className={`task-btn bevel-out-thin max-w-[170px] truncate flex items-center gap-1.5 ${
                isActive ? "active" : ""
              }`}
            >
              <span className="shrink-0 flex items-center"><AppIcon iconKey={w.icon} size={15} /></span>
              <span className="truncate">{w.title}</span>
            </button>
          );
        })}
      </div>

      {/* System Tray */}
      <div className="tray bevel-in flex items-center gap-2">
        <IconVolume />
        <span>{time}</span>
      </div>
    </div>
  );
}

export default Taskbar;
