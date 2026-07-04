import { useState } from "react";
import {
  IconNavBack, IconNavForward, IconNavUp, IconSearchGlass, IconFoldersPane,
  IconRecycleBin, IconTaskDelete, IconMyDocsIco, IconMyComputerIco,
} from "./Icons";
import ErrorDialog from "./ErrorDialog";
import { useWindowManager } from "../windowContext";
import { playClick } from "../lib/sound";
import { PROJECTS_CONTENT } from "../content";

const MENUS = ["File", "Edit", "View", "Favorites", "Tools", "Help"];

function RecycleBin() {
  const { openWindow } = useWindowManager();
  const [error, setError] = useState<string | null>(null);

  const openProjects = () => {
    playClick();
    openWindow("projects", "Projects - File Explorer", "projects", PROJECTS_CONTENT);
  };

  return (
    <div className="h-full flex flex-col bg-white font-body text-[11px]">
      <div className="xp-menubar select-none shrink-0">
        {MENUS.map((m) => (
          <button key={m} className="xp-menu-item">{m}</button>
        ))}
      </div>

      <div className="flex items-center gap-0.5 px-1 py-0.5 bg-surface border-b border-outline-variant shrink-0">
        <button className="xp-tb-btn" disabled><IconNavBack size={18} /><span>Back</span></button>
        <button className="xp-tb-btn" disabled><IconNavForward size={18} /></button>
        <button className="xp-tb-btn" disabled><IconNavUp size={16} /></button>
        <div className="xp-tb-sep" />
        <button className="xp-tb-btn"><IconSearchGlass size={15} /><span>Search</span></button>
        <button className="xp-tb-btn"><IconFoldersPane size={15} /><span>Folders</span></button>
      </div>

      <div className="flex items-center gap-1.5 px-1.5 py-1 bg-surface border-b border-outline-variant shrink-0">
        <span className="text-outline">Address</span>
        <div className="xp-addressbar flex-1 flex items-center gap-1.5">
          <IconRecycleBin size={14} />
          <span>Recycle Bin</span>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        <aside className="xp-taskpane explorer-sidebar shrink-0 pb-3">
          <div className="xp-task-section">
            <div className="xp-task-header"><span>Recycle Bin Tasks</span><span className="xp-task-chevron">︿</span></div>
            <div className="xp-task-body space-y-0.5">
              <button className="xp-task-link text-[11px]" onClick={() => setError("The Recycle Bin is already empty. Deleted regrets, rejected designs and jQuery are gone for good.")}>
                <span className="shrink-0 flex items-center"><IconTaskDelete size={16} /></span>
                <span>Empty the Recycle Bin</span>
              </button>
            </div>
          </div>
          <div className="xp-task-section">
            <div className="xp-task-header"><span>Other Places</span><span className="xp-task-chevron">︿</span></div>
            <div className="xp-task-body space-y-0.5">
              <button className="xp-task-link text-[11px]" onClick={openProjects}>
                <span className="shrink-0 flex items-center"><IconMyDocsIco size={16} /></span>
                <span>My Documents</span>
              </button>
              <button className="xp-task-link text-[11px]" onClick={openProjects}>
                <span className="shrink-0 flex items-center"><IconMyComputerIco size={16} /></span>
                <span>My Computer</span>
              </button>
            </div>
          </div>
        </aside>

        <main className="flex-1 bg-white" />
      </div>

      {/* Status bar */}
      <div className="flex items-center gap-4 px-2 py-0.5 bg-surface border-t border-outline-variant text-outline shrink-0">
        <span>0 objects</span>
        <span className="ml-auto">0 bytes</span>
      </div>

      {error && <ErrorDialog title="Empty Recycle Bin" message={error} onClose={() => setError(null)} />}
    </div>
  );
}

export default RecycleBin;
