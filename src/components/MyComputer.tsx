import { useState, type ReactNode } from "react";
import {
  IconNavBack, IconNavForward, IconNavUp, IconSearchGlass, IconFoldersPane,
  IconMyComputerIco, IconFolderIco, IconMyDocsIco, IconDriveIco, IconFloppy, IconCD,
  IconTaskDetails, IconNetworkIco, IconControlPanelIco,
} from "./Icons";
import ErrorDialog from "./ErrorDialog";
import { useWindowManager } from "../windowContext";
import { playClick } from "../lib/sound";
import { PROJECTS_CONTENT } from "../content";

interface XPError {
  title: string;
  message: string;
}

interface Tile {
  label: string;
  sub: string;
  Icon: (p: { size?: number }) => JSX.Element;
  action: () => void;
}

const MENUS = ["File", "Edit", "View", "Favorites", "Tools", "Help"];

function MyComputer() {
  const { openWindow, openDisplayProperties } = useWindowManager();
  const [error, setError] = useState<XPError | null>(null);

  const openProjects = () => {
    playClick();
    openWindow("projects", "Projects - File Explorer", "projects", PROJECTS_CONTENT);
  };

  const groups: { title: string; tiles: Tile[] }[] = [
    {
      title: "Files Stored on This Computer",
      tiles: [
        { label: "Shared Documents", sub: "File Folder", Icon: IconFolderIco, action: openProjects },
        { label: "Rachmizard's Documents", sub: "File Folder", Icon: IconMyDocsIco, action: openProjects },
      ],
    },
    {
      title: "Hard Disk Drives",
      tiles: [
        {
          label: "Local Disk (C:)", sub: "38.1 GB free of 74.5 GB", Icon: IconDriveIco,
          action: () => setError({ title: "C:\\ is not accessible", message: "Access is denied. This drive contains 7 years of production code and at least one commit message that just says \"fix\"." }),
        },
      ],
    },
    {
      title: "Devices with Removable Storage",
      tiles: [
        {
          label: "3½ Floppy (A:)", sub: "3½-Inch Floppy Disk", Icon: IconFloppy,
          action: () => setError({ title: "A:\\ is not accessible", message: "Please insert a disk into drive A:." }),
        },
        {
          label: "CD Drive (D:)", sub: "CD Drive", Icon: IconCD,
          action: () => setError({ title: "D:\\ is not accessible", message: "Please insert a disc into drive D:. Preferably a burned mixtape from 2004." }),
        },
      ],
    },
  ];

  const paneLink = (label: string, Icon: (p: { size?: number }) => JSX.Element, action: () => void): ReactNode => (
    <button key={label} className="xp-task-link text-[11px]" onClick={action}>
      <span className="shrink-0 flex items-center"><Icon size={16} /></span>
      <span>{label}</span>
    </button>
  );

  return (
    <div className="h-full flex flex-col bg-white font-body text-[11px]">
      {/* Menu bar */}
      <div className="xp-menubar select-none shrink-0">
        {MENUS.map((m) => (
          <button key={m} className="xp-menu-item">{m}</button>
        ))}
      </div>

      {/* Toolbar */}
      <div className="flex items-center gap-0.5 px-1 py-0.5 bg-surface border-b border-outline-variant shrink-0">
        <button className="xp-tb-btn" disabled><IconNavBack size={18} /><span>Back</span></button>
        <button className="xp-tb-btn" disabled><IconNavForward size={18} /></button>
        <button className="xp-tb-btn" disabled><IconNavUp size={16} /></button>
        <div className="xp-tb-sep" />
        <button className="xp-tb-btn"><IconSearchGlass size={15} /><span>Search</span></button>
        <button className="xp-tb-btn"><IconFoldersPane size={15} /><span>Folders</span></button>
      </div>

      {/* Address bar */}
      <div className="flex items-center gap-1.5 px-1.5 py-1 bg-surface border-b border-outline-variant shrink-0">
        <span className="text-outline">Address</span>
        <div className="xp-addressbar flex-1 flex items-center gap-1.5">
          <IconMyComputerIco size={14} />
          <span>My Computer</span>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Task pane */}
        <aside className="xp-taskpane explorer-sidebar shrink-0 pb-3">
          <div className="xp-task-section">
            <div className="xp-task-header"><span>System Tasks</span><span className="xp-task-chevron">︿</span></div>
            <div className="xp-task-body space-y-0.5">
              {paneLink("View system information", IconTaskDetails, () =>
                setError({ title: "System Properties", message: "Rachmizard XP Professional. Processor: Rachmizard Core @ 5.0 GHz. Memory: 1.00 GB RAM (of coffee)." }),
              )}
              {paneLink("Change a setting", IconControlPanelIco, () => { playClick(); openDisplayProperties(); })}
            </div>
          </div>
          <div className="xp-task-section">
            <div className="xp-task-header"><span>Other Places</span><span className="xp-task-chevron">︿</span></div>
            <div className="xp-task-body space-y-0.5">
              {paneLink("My Documents", IconMyDocsIco, openProjects)}
              {paneLink("My Network Places", IconNetworkIco, () =>
                setError({ title: "Network Error", message: "Unable to browse the network. The network is unreachable, which in 2003 usually meant someone was on the phone." }),
              )}
            </div>
          </div>
          <div className="xp-task-section">
            <div className="xp-task-header"><span>Details</span><span className="xp-task-chevron">︿</span></div>
            <div className="xp-task-body">
              <div className="xp-task-detail-line bold">My Computer</div>
              <div className="xp-task-detail-line">System Folder</div>
            </div>
          </div>
        </aside>

        {/* Tile groups */}
        <main className="flex-1 overflow-y-auto p-3 space-y-4 bg-white">
          {groups.map((g) => (
            <section key={g.title}>
              <div className="xp-group-title">{g.title}</div>
              <div className="xp-group-rule" />
              <div className="xp-tiles !p-0 mt-2">
                {g.tiles.map((t) => (
                  <button key={t.label} className="xp-tile" onDoubleClick={t.action} onClick={t.action}>
                    <span className="shrink-0 flex items-center"><t.Icon size={32} /></span>
                    <span className="min-w-0 text-left">
                      <span className="block truncate">{t.label}</span>
                      <span className="block xp-tile-sub truncate">{t.sub}</span>
                    </span>
                  </button>
                ))}
              </div>
            </section>
          ))}
        </main>
      </div>

      {error && <ErrorDialog title={error.title} message={error.message} onClose={() => setError(null)} />}
    </div>
  );
}

export default MyComputer;
