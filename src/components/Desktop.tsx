import type { ReactNode } from "react";
import Window from "./Window";
import { WELCOME_CONTENT, PROJECTS_CONTENT, ABOUT_CONTENT } from "../content";
import type { AppWindow } from "../types";

interface DesktopIcon {
  id: string;
  title: string;
  icon: string;
  iconColor: string;
  content: ReactNode | null;
  windowTitle: string;
}

interface DesktopProps {
  windows: AppWindow[];
  onOpenWindow: (id: string, title: string, icon: string, content: ReactNode) => void;
  onFocusWindow: (id: string) => void;
  onCloseWindow: (id: string) => void;
  onToggleMinimize: (id: string) => void;
}

const DESKTOP_ICONS: DesktopIcon[] = [
  { id: "about", title: "About Me.txt", icon: "description", iconColor: "text-on-surface", content: ABOUT_CONTENT, windowTitle: "About Me.txt - Notepad" },
  { id: "projects", title: "Projects", icon: "folder", iconColor: "text-tertiary", content: PROJECTS_CONTENT, windowTitle: "Projects - File Explorer" },
  { id: "skills", title: "Skills.exe", icon: "build", iconColor: "text-on-surface", content: WELCOME_CONTENT, windowTitle: "Skills.exe" },
  { id: "cv", title: "CV.pdf", icon: "picture_as_pdf", iconColor: "text-error", content: null, windowTitle: "" },
];

function Desktop({
  windows,
  onOpenWindow,
  onFocusWindow,
  onCloseWindow,
  onToggleMinimize,
}: DesktopProps) {
  return (
    <div className="flex-1 relative desktop">
      <div className="absolute top-0 left-0 p-4 grid grid-cols-1 gap-6 w-24 z-0">
        {DESKTOP_ICONS.map((icon) => (
          <button
            key={icon.id}
            onDoubleClick={() => {
              if (icon.id === "cv") {
                window.open("/cv.pdf", "_blank");
              } else {
                onOpenWindow(icon.id, icon.windowTitle, icon.icon, icon.content!);
              }
            }}
            className="flex flex-col items-center group focus:outline-none cursor-pointer"
          >
            <span
              className={`material-symbols-outlined text-4xl ${icon.iconColor} drop-shadow-md`}
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              {icon.icon}
            </span>
            <span className="text-white font-mono text-[11px] text-center px-1 bg-primary/80 mt-1">
              {icon.title}
            </span>
          </button>
        ))}
      </div>

      {windows
        .filter((w) => !w.minimized)
        .sort((a, b) => a.zIndex - b.zIndex)
        .map((w) => (
          <Window
            key={w.id}
            title={w.title}
            zIndex={w.zIndex}
            onFocus={() => onFocusWindow(w.id)}
            onMinimize={() => onToggleMinimize(w.id)}
            onClose={() => onCloseWindow(w.id)}
          >
            {w.content}
          </Window>
        ))}
    </div>
  );
}

export default Desktop;
