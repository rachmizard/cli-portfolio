import { IconTerminal, IconFolder, IconInfo, IconWinamp, IconMyComputer, IconUser, IconLogOff, IconTurnOff, IconWord } from "./Icons";
import { WELCOME_CONTENT, PROJECTS_CONTENT, ABOUT_CONTENT, WINAMP_CONTENT, COMPUTER_CONTENT, WORD_CONTENT } from "../content";
import { playSound } from "../lib/sound";
import type { AppWindow } from "../types";

interface StartMenuProps {
  visible: boolean;
  onClose: () => void;
  onOpenWindow: (id: string, title: string, icon: string, content: React.ReactNode, initialRect?: AppWindow["initialRect"]) => void;
  onTurnOff: () => void;
}

interface ProgramItem {
  id: string;
  label: string;
  Icon: (p: { size?: number }) => JSX.Element;
  iconKey: string;
  title: string;
  content: React.ReactNode | null;
  initialRect?: AppWindow["initialRect"];
  href?: string;
}

// Left column — pinned + recent programs
const PROGRAMS: ProgramItem[] = [
  { id: "skills", label: "Skills", Icon: IconTerminal, iconKey: "skills", title: "Skills.exe - Command Prompt", content: WELCOME_CONTENT },
  { id: "about", label: "About Me", Icon: IconInfo, iconKey: "about", title: "About Me.txt - Notepad", content: ABOUT_CONTENT },
  { id: "winamp", label: "Winamp", Icon: IconWinamp, iconKey: "winamp", title: "Winamp 2.91", content: WINAMP_CONTENT },
  { id: "cv", label: "CV.doc", Icon: IconWord, iconKey: "word", title: "CV.doc - Microsoft Word", content: WORD_CONTENT, initialRect: { w: 660, h: 560 } },
];

// Right column — "My Places" style shortcuts
const PLACES: ProgramItem[] = [
  { id: "projects", label: "My Documents", Icon: IconFolder, iconKey: "projects", title: "Projects - File Explorer", content: PROJECTS_CONTENT },
  { id: "computer", label: "My Computer", Icon: IconMyComputer, iconKey: "computer", title: "My Computer", content: COMPUTER_CONTENT },
];

function StartMenu({ visible, onClose, onOpenWindow, onTurnOff }: StartMenuProps) {
  if (!visible) return null;

  const handle = (item: ProgramItem) => {
    if (item.href) {
      window.open(item.href, "_blank");
    } else {
      onOpenWindow(item.id, item.title || item.label, item.iconKey, item.content, item.initialRect);
    }
    onClose();
  };

  const handleLogOff = () => {
    playSound("/xp-logoff.mp3");
    onClose();
  };

  const handleTurnOff = () => {
    onTurnOff();
  };

  return (
    <>
      <div className="fixed inset-0 z-[9998]" onClick={onClose} />
      <div className="start-menu fixed bottom-[28px] left-0 z-[9999] w-[340px] max-w-[calc(100vw-4px)] shadow-2xl flex flex-col font-body text-[11px]">
        {/* Header — blue gradient with avatar */}
        <div className="start-header flex items-center gap-2 px-3 py-2">
          <div className="start-avatar shrink-0">
            <IconUser size={36} />
          </div>
          <span className="text-white font-bold text-[15px] drop-shadow">Rachmizard</span>
        </div>

        {/* Body — two columns */}
        <div className="flex">
          {/* Left — programs (white) */}
          <div className="start-col-left flex-1 py-1">
            {PROGRAMS.map((item) => (
              <button key={item.id} onClick={() => handle(item)} className="start-item w-full text-left flex items-center gap-2">
                <span className="w-7 h-7 flex items-center justify-center shrink-0"><item.Icon size={24} /></span>
                <span>{item.label}</span>
              </button>
            ))}
            <div className="start-sep" />
            <button onClick={onClose} className="start-item start-allprograms w-full text-left flex items-center justify-end gap-1 font-bold">
              <span>All Programs</span>
              <span className="text-[9px]">▶</span>
            </button>
          </div>

          {/* Right — places (light blue) */}
          <div className="start-col-right w-[140px] py-1">
            {PLACES.map((item) => (
              <button key={item.id} onClick={() => handle(item)} className="start-item start-item-right w-full text-left flex items-center gap-2">
                <span className="w-6 h-6 flex items-center justify-center shrink-0"><item.Icon size={20} /></span>
                <span>{item.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Footer — log off / turn off (green gradient) */}
        <div className="start-footer flex justify-end gap-3 px-3 py-1.5">
          <button onClick={handleLogOff} className="flex items-center gap-1.5 hover:underline text-white">
            <IconLogOff size={20} />
            <span>Log Off</span>
          </button>
          <button onClick={handleTurnOff} className="flex items-center gap-1.5 hover:underline text-white">
            <IconTurnOff size={20} />
            <span>Turn Off</span>
          </button>
        </div>
      </div>
    </>
  );
}

export default StartMenu;
