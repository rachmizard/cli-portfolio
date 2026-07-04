import { useEffect, useState } from "react";
import {
  IconTerminal, IconInfo, IconWinamp, IconWord, IconIE, IconEmail, IconRun,
  IconLogOff, IconTurnOff, IconUserIco, IconMyDocsIco, IconMyPicturesIco,
  IconMyMusicIco, IconMyComputerIco, IconControlPanelIco, IconHelpIco,
  IconSearchGlass, IconMinesweeperIco, IconFolderIco, IconSettings,
} from "./Icons";
import {
  WELCOME_CONTENT, PROJECTS_CONTENT, ABOUT_CONTENT, WINAMP_CONTENT,
  COMPUTER_CONTENT, WORD_CONTENT, MINESWEEPER_CONTENT, IE_CONTENT,
} from "../content";
import ErrorDialog from "./ErrorDialog";
import { useWindowManager } from "../windowContext";
import { playSound, playClick } from "../lib/sound";
import type { AppWindow } from "../types";

interface StartMenuProps {
  visible: boolean;
  onClose: () => void;
  onOpenWindow: (id: string, title: string, icon: string, content: React.ReactNode, initialRect?: AppWindow["initialRect"]) => void;
  onOpenRun: () => void;
  onTurnOff: () => void;
}

interface ProgramItem {
  id: string;
  label: string;
  sub?: string;
  Icon: (p: { size?: number }) => JSX.Element;
  iconKey: string;
  title?: string;
  content?: React.ReactNode;
  initialRect?: AppWindow["initialRect"];
  href?: string;
}

// Pinned Internet / E-mail rows (top-left, like a real XP start menu)
const PINNED: ProgramItem[] = [
  { id: "ie", label: "Internet", sub: "Internet Explorer", Icon: IconIE, iconKey: "ie", title: "Rachmizard's Homepage - Microsoft Internet Explorer", content: IE_CONTENT, initialRect: { w: 720, h: 540 } },
  { id: "email", label: "E-mail", sub: "Outlook Express", Icon: IconEmail, iconKey: "about", href: "mailto:rachmizard11072000@gmail.com" },
];

// "Recently used" programs below the pinned area
const PROGRAMS: ProgramItem[] = [
  { id: "skills", label: "Skills", Icon: IconTerminal, iconKey: "skills", title: "Skills.exe - Command Prompt", content: WELCOME_CONTENT },
  { id: "about", label: "About Me", Icon: IconInfo, iconKey: "about", title: "About Me.txt - Notepad", content: ABOUT_CONTENT },
  { id: "winamp", label: "Winamp", Icon: IconWinamp, iconKey: "winamp", title: "Winamp 2.91", content: WINAMP_CONTENT },
  { id: "minesweeper", label: "Minesweeper", Icon: IconMinesweeperIco, iconKey: "minesweeper", title: "Minesweeper", content: MINESWEEPER_CONTENT },
  { id: "cv", label: "CV.doc", Icon: IconWord, iconKey: "word", title: "CV.doc - Microsoft Word", content: WORD_CONTENT, initialRect: { w: 660, h: 560 } },
];

// All Programs flyout — everything in one place
const ALL_PROGRAMS: ProgramItem[] = [
  ...PINNED.slice(0, 1),
  ...PROGRAMS,
  { id: "projects", label: "Projects", Icon: IconFolderIco, iconKey: "projects", title: "Projects - File Explorer", content: PROJECTS_CONTENT },
  { id: "computer", label: "My Computer", Icon: IconMyComputerIco, iconKey: "computer", title: "My Computer", content: COMPUTER_CONTENT },
];

function StartMenu({ visible, onClose, onOpenWindow, onOpenRun, onTurnOff }: StartMenuProps) {
  const [allOpen, setAllOpen] = useState(false);
  const [error, setError] = useState<{ title: string; message: string } | null>(null);
  const { openDisplayProperties } = useWindowManager();

  // Reset the flyout whenever the menu closes
  useEffect(() => {
    if (!visible) setAllOpen(false);
  }, [visible]);

  if (!visible) return null;

  const handle = (item: ProgramItem) => {
    playClick();
    if (item.href) {
      window.open(item.href, "_blank");
    } else if (item.content) {
      onOpenWindow(item.id, item.title || item.label, item.iconKey, item.content, item.initialRect);
    }
    onClose();
  };

  const handleLogOff = () => {
    playSound("/xp-logoff.mp3");
    onClose();
  };

  return (
    <>
      <div className="fixed inset-0 z-[9998]" onClick={onClose} />
      <div className="start-menu fixed left-0 z-[9999] w-[360px] max-w-[calc(100vw-4px)] shadow-2xl flex flex-col font-body text-[11px]" style={{ bottom: "var(--taskbar-h)" }}>
        {/* Header — blue gradient with avatar */}
        <div className="start-header flex items-center gap-2 px-3 py-2">
          <div className="start-avatar shrink-0">
            <IconUserIco size={38} />
          </div>
          <span className="text-white font-bold text-[15px] drop-shadow">Rachmizard</span>
        </div>

        {/* Body — two columns */}
        <div className="flex relative">
          {/* Left — programs (white) */}
          <div className="start-col-left flex-1 py-1 flex flex-col">
            {PINNED.map((item) => (
              <button key={item.id} onClick={() => handle(item)} className="start-item w-full text-left flex items-center gap-2">
                <span className="w-8 h-8 flex items-center justify-center shrink-0"><item.Icon size={28} /></span>
                <span className="min-w-0">
                  <span className="block font-bold truncate">{item.label}</span>
                  <span className="block start-item-sub truncate">{item.sub}</span>
                </span>
              </button>
            ))}
            <div className="start-sep" />
            {PROGRAMS.map((item) => (
              <button key={item.id} onClick={() => handle(item)} className="start-item w-full text-left flex items-center gap-2">
                <span className="w-7 h-7 flex items-center justify-center shrink-0"><item.Icon size={24} /></span>
                <span className="truncate">{item.label}</span>
              </button>
            ))}
            <div className="mt-auto">
              <div className="start-sep" />
              <button
                onClick={() => setAllOpen((o) => !o)}
                className={`start-item start-allprograms w-full text-left flex items-center justify-end gap-1.5 font-bold ${allOpen ? "bg-win-blue text-white" : ""}`}
              >
                <span>All Programs</span>
                <span className="start-allprograms-arrow">▶</span>
              </button>
            </div>
          </div>

          {/* Right — places (light blue) */}
          <div className="start-col-right w-[150px] py-1">
            {[
              { label: "My Documents", Icon: IconMyDocsIco, bold: true, action: () => handle({ id: "projects", label: "My Documents", Icon: IconMyDocsIco, iconKey: "projects", title: "Projects - File Explorer", content: PROJECTS_CONTENT }) },
              { label: "My Pictures", Icon: IconMyPicturesIco, bold: true, action: () => setError({ title: "My Pictures", message: "This folder contains no photos. Only screenshots of terminal output. See the Projects folder instead." }) },
              { label: "My Music", Icon: IconMyMusicIco, bold: true, action: () => handle({ id: "winamp", label: "Winamp", Icon: IconWinamp, iconKey: "winamp", title: "Winamp 2.91", content: WINAMP_CONTENT }) },
              { label: "My Computer", Icon: IconMyComputerIco, bold: true, action: () => handle({ id: "computer", label: "My Computer", Icon: IconMyComputerIco, iconKey: "computer", title: "My Computer", content: COMPUTER_CONTENT }) },
              { divider: true } as const,
              { label: "Control Panel", Icon: IconControlPanelIco, action: () => { playClick(); openDisplayProperties(); onClose(); } },
              { label: "Display Properties", Icon: IconSettings, action: () => { playClick(); openDisplayProperties(); onClose(); } },
              { divider: true } as const,
              { label: "Help and Support", Icon: IconHelpIco, action: () => handle({ id: "about", label: "About Me", Icon: IconInfo, iconKey: "about", title: "About Me.txt - Notepad", content: ABOUT_CONTENT }) },
              { label: "Search", Icon: IconSearchGlass, action: () => setError({ title: "Search Companion", message: "The search dog Rover has been let go. Try the Run… command instead." }) },
              { label: "Run...", Icon: IconRun, action: () => { playClick(); onOpenRun(); onClose(); } },
            ].map((item, i) => {
              if ("divider" in item) return <div key={`d${i}`} className="start-sep" />;
              return (
                <button key={item.label} onClick={item.action} className={`start-item start-item-right w-full text-left flex items-center gap-2 ${item.bold ? "" : "!font-normal"}`}>
                  <span className="w-6 h-6 flex items-center justify-center shrink-0"><item.Icon size={22} /></span>
                  <span className="truncate">{item.label}</span>
                </button>
              );
            })}
          </div>

          {/* All Programs flyout */}
          {allOpen && (
            <div className="start-flyout" role="menu">
              {ALL_PROGRAMS.map((item) => (
                <button key={item.id} onClick={() => handle(item)} className="start-item w-full text-left flex items-center gap-2" role="menuitem">
                  <span className="w-6 h-6 flex items-center justify-center shrink-0"><item.Icon size={20} /></span>
                  <span className="truncate">{item.sub ?? item.label}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Footer — log off / turn off (blue gradient) */}
        <div className="start-footer flex justify-end gap-3 px-3 py-1.5">
          <button onClick={handleLogOff} className="flex items-center gap-1.5 hover:underline text-white">
            <IconLogOff size={20} />
            <span>Log Off</span>
          </button>
          <button onClick={onTurnOff} className="flex items-center gap-1.5 hover:underline text-white">
            <IconTurnOff size={20} />
            <span>Turn Off Computer</span>
          </button>
        </div>
      </div>
      {error && <ErrorDialog title={error.title} message={error.message} onClose={() => setError(null)} />}
    </>
  );
}

export default StartMenu;
