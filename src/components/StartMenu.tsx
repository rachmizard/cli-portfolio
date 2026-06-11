import { IconTerminal, IconFolder, IconDocument, IconInfo, IconWinamp } from "./Icons";
import { WINAMP_CONTENT } from "../content";

interface StartMenuProps {
  visible: boolean;
  onClose: () => void;
  onOpenWindow: (id: string, title: string, icon: string, content: React.ReactNode) => void;
  aboutContent: React.ReactNode;
  projectsContent: React.ReactNode;
  skillsContent: React.ReactNode;
}

const MENU_ITEMS = [
  { id: "about", label: "About Me", icon: IconInfo, role: "about" as const },
  { id: "projects", label: "Projects", icon: IconFolder, role: "projects" as const },
  { divider: true },
  { id: "skills", label: "Skills", icon: IconTerminal, role: "skills" as const },
  { divider: true },
  { id: "winamp", label: "Winamp", icon: IconWinamp, role: "winamp" as const },
  { id: "cv", label: "CV.pdf", icon: IconDocument, role: "cv" as const },
];

function StartMenu({
  visible,
  onClose,
  onOpenWindow,
  aboutContent,
  projectsContent,
  skillsContent,
}: StartMenuProps) {
  if (!visible) return null;

  const contentMap: Record<string, React.ReactNode> = {
    about: aboutContent,
    projects: projectsContent,
    skills: skillsContent,
    winamp: null, // handled separately via import
  };

  return (
    <>
      <div className="fixed inset-0 z-[9998]" onClick={onClose} />
      <div className="fixed bottom-[28px] left-0 z-[9999] bevel-out-thin bg-surface-container-lowest max-w-[380px] w-[calc(100vw-4px)] shadow-xl flex font-body text-[11px]">
        {/* Left side - user banner (vertical) */}
        <div className="start-menu-user w-[28px] flex items-end justify-center pb-2 shrink-0">
          <span className="[writing-mode:vertical-rl] rotate-180 text-[18px] tracking-[3px]">
            Rachmizard
          </span>
        </div>

        {/* Menu items */}
        <div className="flex-1 py-1">
          {MENU_ITEMS.map((item: any, i: number) => {
            if (item.divider) {
              return <div key={i} className="border-t border-outline-variant my-1 mx-2" />;
            }
            const Icon = item.icon;
            return (
              <button
                key={i}
                className="start-menu-item w-full text-left flex items-center gap-3"
                onClick={() => {
                  if (item.role === "cv") {
                    window.open("/cv.pdf", "_blank");
                  } else if (item.role === "winamp") {
                    onOpenWindow(item.id!, "Winamp 2.91", item.id!, WINAMP_CONTENT);
                  } else {
                    const titles: Record<string, string> = {
                      about: "About Me.txt - Notepad",
                      projects: "Projects - File Explorer",
                      skills: "Skills.exe - Command Prompt",
                    };
                    onOpenWindow(item.id!, titles[item.role!] || item.label!, item.id!, contentMap[item.role!]);
                  }
                  onClose();
                }}
              >
                <div className="w-7 h-7 flex items-center justify-center">
                  <Icon />
                </div>
                <span>{item.label}</span>
              </button>
            );
          })}

          <div className="border-t border-outline-variant my-1 mx-2" />

          <div className="start-menu-footer flex justify-end gap-4 px-4 py-1">
            <button className="hover:underline flex items-center gap-1">
              <span>🔓</span> Log Off
            </button>
            <button className="hover:underline flex items-center gap-1">
              <span>⏻</span> Turn Off
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

export default StartMenu;
