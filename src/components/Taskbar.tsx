import { useState, useEffect } from "react";
import type { AppWindow } from "../types";
import { AppIcon, IconXPFlagWave, IconVolume, IconShowDesktop } from "./Icons";

interface TaskbarProps {
  windows: AppWindow[];
  activeId: string;
  startMenuOpen: boolean;
  onFocusWindow: (id: string) => void;
  onToggleMinimize: (id: string) => void;
  onToggleStartMenu: () => void;
  onShowDesktop: () => void;
}

function Taskbar({ windows, activeId, startMenuOpen, onFocusWindow, onToggleMinimize, onToggleStartMenu, onShowDesktop }: TaskbarProps) {
  const [time, setTime] = useState("");
  const [fullDate, setFullDate] = useState("");

  useEffect(() => {
    const update = () => {
      const now = new Date();
      setTime(
        now.toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
        }),
      );
      setFullDate(
        now.toLocaleDateString("en-US", {
          weekday: "long",
          year: "numeric",
          month: "long",
          day: "numeric",
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
        <IconXPFlagWave size={18} />
        <span>start</span>
      </button>

      <div className="w-[3px]" />

      {/* Quick Launch */}
      <div className="quick-launch flex items-center px-1 shrink-0">
        <button onClick={onShowDesktop} title="Show Desktop" className="ql-btn flex items-center justify-center">
          <IconShowDesktop size={14} />
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
        <span data-tooltip="Volume" className="flex items-center"><IconVolume /></span>
        <span data-tooltip={fullDate}>{time}</span>
      </div>
    </div>
  );
}

export default Taskbar;
