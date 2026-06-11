import { IconTerminal, IconFolder, IconDocument, IconInfo } from "./Icons";

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
  };

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 z-[9998]" onClick={onClose} />

      {/* Menu */}
      <div className="fixed bottom-10 left-0 z-[9999] bevel-out bg-surface-container-lowest w-[220px] shadow-xl font-body">
        {/* User banner */}
        <div className="bg-primary text-on-primary px-4 py-3 flex items-center gap-2">
          <div className="w-10 h-10 rounded-full bg-surface-container-lowest flex items-center justify-center bevel-in">
            <span className="text-primary font-bold text-lg">JD</span>
          </div>
          <span className="font-bold text-[14px]">John Doe</span>
        </div>

        {/* Menu items */}
        <div className="py-1">
          {MENU_ITEMS.map((item, i) => {
            if ("divider" in item && item.divider) {
              return <div key={i} className="border-t border-outline-variant my-1" />;
            }
            const Icon = item.icon!;
            return (
              <button
                key={i}
                className="w-full text-left px-4 py-2 text-[13px] text-on-surface hover:bg-primary hover:text-on-primary flex items-center gap-3 font-body"
                onClick={() => {
                  if (item.role === "cv") {
                    window.open("/cv.pdf", "_blank");
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
                <div className="w-6 h-6 flex items-center justify-center">
                  <Icon />
                </div>
                {item.label}
              </button>
            );
          })}
        </div>

        {/* Bottom bar */}
        <div className="bg-primary-container/20 px-4 py-1.5 flex items-center justify-end gap-2">
          <span className="text-[10px] text-on-surface-variant">Log Off</span>
          <span className="text-[10px] text-on-surface-variant">Turn Off</span>
        </div>
      </div>
    </>
  );
}

export default StartMenu;
