import { useState, useEffect } from "react";
import type { AppWindow } from "../types";
import { AppIcon, IconXPFlagWave, IconVolume, IconShowDesktop, IconIE, IconNetworkTray, IconShieldTray, IconClose } from "./Icons";
import { useWindowManager } from "../windowContext";
import { IE_CONTENT, PROJECTS_CONTENT } from "../content";
import { playBalloon, playClick } from "../lib/sound";

interface TaskbarProps {
  windows: AppWindow[];
  activeId: string;
  startMenuOpen: boolean;
  onFocusWindow: (id: string) => void;
  onToggleMinimize: (id: string) => void;
  onToggleStartMenu: () => void;
  onShowDesktop: () => void;
}

const BALLOON_SHOW_MS = 16000; // after the boot/welcome/smadav sequence settles
const BALLOON_HIDE_MS = 12000;

function Taskbar({ windows, activeId, startMenuOpen, onFocusWindow, onToggleMinimize, onToggleStartMenu, onShowDesktop }: TaskbarProps) {
  const [time, setTime] = useState("");
  const [fullDate, setFullDate] = useState("");
  const [balloon, setBalloon] = useState(false);
  const { openWindow } = useWindowManager();

  useEffect(() => {
    const update = () => {
      const now = new Date();
      setTime(
        now.toLocaleTimeString("en-US", {
          hour: "numeric",
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

  // One-shot XP security balloon
  useEffect(() => {
    const show = setTimeout(() => {
      setBalloon(true);
      playBalloon();
    }, BALLOON_SHOW_MS);
    return () => clearTimeout(show);
  }, []);

  useEffect(() => {
    if (!balloon) return;
    const hide = setTimeout(() => setBalloon(false), BALLOON_HIDE_MS);
    return () => clearTimeout(hide);
  }, [balloon]);

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

  const openIE = () => {
    playClick();
    openWindow("ie", "Rachmizard's Homepage - Microsoft Internet Explorer", "ie", IE_CONTENT, { w: 720, h: 540 });
  };

  const openBalloonTarget = () => {
    setBalloon(false);
    openWindow("projects", "Projects - File Explorer", "projects", PROJECTS_CONTENT);
  };

  return (
    <div className="taskbar flex items-center px-0.5 z-50">
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
      <div className="quick-launch flex items-center gap-0.5 px-1 shrink-0">
        <span className="ql-handle" aria-hidden="true" />
        <button onClick={openIE} data-tooltip="Launch Internet Explorer Browser" className="ql-btn flex items-center justify-center">
          <IconIE size={15} />
        </button>
        <button onClick={onShowDesktop} data-tooltip="Show Desktop" className="ql-btn flex items-center justify-center">
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
      <div className="tray bevel-in flex items-center gap-1.5">
        <span data-tooltip="Smadav is protecting your computer" className="flex items-center"><IconShieldTray /></span>
        <span data-tooltip="Local Area Connection — Speed: 100.0 Mbps" className="flex items-center"><IconNetworkTray /></span>
        <span data-tooltip="Volume" className="flex items-center"><IconVolume /></span>
        <span data-tooltip={fullDate}>{time}</span>
      </div>

      {/* Security balloon */}
      {balloon && (
        <div className="balloon" role="status">
          <button className="balloon-close" aria-label="Close" onClick={() => setBalloon(false)}>
            <IconClose size={8} />
          </button>
          <div className="balloon-title">
            <IconShieldTray size={15} />
            <span>Your portfolio might be at risk</span>
          </div>
          <p className="balloon-body">
            No project has been viewed for several minutes. Click this balloon to
            browse the Projects folder and fix this problem.
          </p>
          <button className="balloon-hit" aria-label="Open Projects" onClick={openBalloonTarget} />
        </div>
      )}
    </div>
  );
}

export default Taskbar;
