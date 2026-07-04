import { useState, type ReactNode } from "react";
import { IconRun, IconClose } from "./Icons";
import ErrorDialog from "./ErrorDialog";
import { useWindowManager } from "../windowContext";
import {
  WELCOME_CONTENT, PROJECTS_CONTENT, ABOUT_CONTENT, WINAMP_CONTENT,
  COMPUTER_CONTENT, MINESWEEPER_CONTENT, WORD_CONTENT, IE_CONTENT,
} from "../content";
import type { AppWindow } from "../types";

interface RunDialogProps {
  onClose: () => void;
}

interface RunTarget {
  id: string;
  title: string;
  icon: string;
  content: ReactNode;
  initialRect?: AppWindow["initialRect"];
}

const TARGETS: Record<string, RunTarget> = {
  cmd: { id: "skills", title: "Skills.exe - Command Prompt", icon: "skills", content: WELCOME_CONTENT },
  notepad: { id: "about", title: "About Me.txt - Notepad", icon: "about", content: ABOUT_CONTENT },
  winamp: { id: "winamp", title: "Winamp 2.91", icon: "winamp", content: WINAMP_CONTENT },
  winmine: { id: "minesweeper", title: "Minesweeper", icon: "minesweeper", content: MINESWEEPER_CONTENT },
  winword: { id: "cv", title: "CV.doc - Microsoft Word", icon: "word", content: WORD_CONTENT, initialRect: { w: 660, h: 560 } },
  explorer: { id: "projects", title: "Projects - File Explorer", icon: "projects", content: PROJECTS_CONTENT },
  iexplore: { id: "ie", title: "Rachmizard's Homepage - Microsoft Internet Explorer", icon: "ie", content: IE_CONTENT, initialRect: { w: 720, h: 540 } },
  mycomputer: { id: "computer", title: "My Computer", icon: "computer", content: COMPUTER_CONTENT },
};

// Friendly aliases people will actually type
const ALIASES: Record<string, string> = {
  skills: "cmd", terminal: "cmd", about: "notepad", music: "winamp",
  minesweeper: "winmine", word: "winword", cv: "winword", projects: "explorer",
  ie: "iexplore", internet: "iexplore", browser: "iexplore", computer: "mycomputer",
};

/** XP Run… dialog — bottom-left, launches apps by name. */
function RunDialog({ onClose }: RunDialogProps) {
  const { openWindow } = useWindowManager();
  const [cmd, setCmd] = useState("");
  const [error, setError] = useState<string | null>(null);

  const run = () => {
    const raw = cmd.trim().toLowerCase().replace(/\.exe$/, "");
    if (!raw) return;
    const target = TARGETS[ALIASES[raw] ?? raw];
    if (target) {
      openWindow(target.id, target.title, target.icon, target.content, target.initialRect);
      onClose();
    } else {
      setError(cmd.trim());
    }
  };

  return (
    <>
      <div className="fixed z-[98000] left-1 bottom-[calc(var(--taskbar-h)+6px)] window window-active flex flex-col w-[380px] max-w-[calc(100vw-8px)]">
        <div className="title-bar flex items-center justify-between select-none">
          <span>Run</span>
          <button
            onClick={onClose}
            className="title-bar-buttons flex items-center justify-center title-bar-close leading-none font-bold"
            aria-label="Close"
          >
            <IconClose />
          </button>
        </div>
        <div className="window-body bg-surface p-3 flex flex-col gap-3 font-body text-[11px]">
          <div className="flex items-start gap-3">
            <span className="shrink-0 mt-0.5"><IconRun size={32} /></span>
            <p className="leading-[1.45]">
              Type the name of a program, folder, document, or Internet resource,
              and Windows will open it for you.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <label htmlFor="run-input" className="shrink-0">Open:</label>
            <input
              id="run-input"
              value={cmd}
              onChange={(e) => setCmd(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") run();
                if (e.key === "Escape") onClose();
              }}
              autoFocus
              spellCheck={false}
              placeholder="winamp, winmine, notepad, iexplore…"
              className="xp-input flex-1 min-w-0"
            />
          </div>
          <div className="flex justify-end gap-1.5 pt-1">
            <button className="xp-btn min-w-[75px]" onClick={run}>OK</button>
            <button className="xp-btn min-w-[75px]" onClick={onClose}>Cancel</button>
            <button className="xp-btn min-w-[75px]" disabled>Browse…</button>
          </div>
        </div>
      </div>
      {error && (
        <ErrorDialog
          title={error}
          message={`Windows cannot find '${error}'. Make sure you typed the name correctly, and then try again. To search for a file, click the Start button, and then click Search.`}
          onClose={() => setError(null)}
        />
      )}
    </>
  );
}

export default RunDialog;
