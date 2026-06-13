import { useState, useMemo } from "react";
import {
  IconFolder, IconDocument, IconTerminal, IconPDF, IconMyComputer,
  IconNavBack, IconNavForward, IconNavUp, IconSearchGlass, IconFoldersPane,
  IconViewTiles, IconViewIcons, IconViewList, IconViewDetails,
  IconTaskRename, IconTaskMove, IconTaskCopy, IconTaskPublish, IconTaskShare,
  IconTaskEmail, IconTaskDelete, IconTaskNewFolder, IconTaskDetails,
} from "./Icons";
import { useWindowManager } from "../windowContext";
import { PROJECTS } from "../projects";
import ProjectWindow from "./ProjectWindow";

type IconCmp = (p: { size?: number }) => JSX.Element;
type EntryKind = "folder" | "file";

interface Entry {
  name: string;
  kind: EntryKind;
  ext?: string;
  desc?: string;
  size?: number;
  modified: string;
  open?: () => void;
  projectId?: string;
}

interface FolderDef {
  id: string;
  label: string;
  path: string;
  parent: string | null;
  entries: Entry[];
}

const FS: Record<string, FolderDef> = {
  desktop: {
    id: "desktop", label: "Desktop", parent: null,
    path: "Desktop",
    entries: [
      { name: "My Documents", kind: "folder", desc: "Personal files", modified: "6/12/2026 9:15 AM" },
      { name: "My Computer", kind: "folder", desc: "System drives", modified: "6/01/2026 8:00 AM" },
    ],
  },
  mydocs: {
    id: "mydocs", label: "My Documents", parent: "desktop",
    path: "C:\\Documents and Settings\\rachmizard\\My Documents",
    entries: [
      { name: "Projects", kind: "folder", desc: "Code repositories", modified: "6/11/2026 10:42 AM" },
      { name: "resume.pdf", kind: "file", ext: "pdf", desc: "Latest CV — updated June 2026", size: 248, modified: "6/09/2026 4:30 PM", open: () => window.open("/cv.pdf", "_blank") },
      { name: "readme.txt", kind: "file", ext: "txt", desc: "Project overview and setup guide", size: 3, modified: "5/28/2026 1:12 PM" },
    ],
  },
  projects: {
    id: "projects", label: "Projects", parent: "mydocs",
    path: "C:\\Documents and Settings\\rachmizard\\My Documents\\Projects",
    entries: [
      { name: "nexus-ui", kind: "folder", desc: "Component library with retro OS design tokens", modified: "6/10/2026 3:21 PM" },
      { name: "cli-portfolio", kind: "folder", desc: "This portfolio — Windows XP simulation on the web", modified: "6/11/2026 10:42 AM" },
      { name: "api-gateway", kind: "folder", desc: "GraphQL gateway aggregating 5 microservices", modified: "5/30/2026 11:08 AM" },
      { name: "fintrack", kind: "folder", desc: "Personal finance tracker with Telegram bot", modified: "4/22/2026 6:55 PM", projectId: "fintrack" },
      { name: "maha-hr-v2", kind: "folder", desc: "HR attendance app with selfie verification", modified: "6/02/2026 9:40 AM" },
    ],
  },
  mycomputer: {
    id: "mycomputer", label: "My Computer", parent: "desktop",
    path: "My Computer",
    entries: [
      { name: "Local Disk (C:)", kind: "folder", desc: "Local Disk", modified: "6/01/2026 8:00 AM" },
      { name: "DVD Drive (D:)", kind: "folder", desc: "CD Drive", modified: "6/01/2026 8:00 AM" },
    ],
  },
};

const FOLDER_BY_NAME: Record<string, string> = {
  "My Documents": "mydocs",
  "My Computer": "mycomputer",
  "Projects": "projects",
};

type ViewMode = "tiles" | "icons" | "list" | "details";

const VIEW_OPTIONS: { mode: ViewMode; Icon: IconCmp; title: string }[] = [
  { mode: "tiles", Icon: IconViewTiles, title: "Tiles" },
  { mode: "icons", Icon: IconViewIcons, title: "Icons" },
  { mode: "list", Icon: IconViewList, title: "List" },
  { mode: "details", Icon: IconViewDetails, title: "Details" },
];

function entryIcon(e: Entry): IconCmp {
  if (e.kind === "folder") return e.name === "My Computer" ? IconMyComputer : IconFolder;
  if (e.ext === "pdf") return IconPDF;
  if (e.ext === "txt") return IconDocument;
  return IconTerminal;
}

function entryType(e: Entry): string {
  if (e.kind === "folder") return "File Folder";
  return `${e.ext?.toUpperCase()} File`;
}

function FileExplorer() {
  const { openWindow } = useWindowManager();
  const [history, setHistory] = useState<string[]>(["projects"]);
  const [cursor, setCursor] = useState(0);
  const [viewMode, setViewMode] = useState<ViewMode>("tiles");
  const [selected, setSelected] = useState<string | null>(null);
  const [openSections, setOpenSections] = useState({ tasks: true, places: true, details: true });

  const currentId = history[cursor];
  const folder = FS[currentId];
  const canBack = cursor > 0;
  const canForward = cursor < history.length - 1;
  const canUp = folder.parent !== null;

  const navigate = (id: string) => {
    if (!FS[id] || id === currentId) return;
    const next = history.slice(0, cursor + 1);
    next.push(id);
    setHistory(next);
    setCursor(next.length - 1);
    setSelected(null);
  };
  const goBack = () => { if (canBack) { setCursor(cursor - 1); setSelected(null); } };
  const goForward = () => { if (canForward) { setCursor(cursor + 1); setSelected(null); } };
  const goUp = () => { if (folder.parent) navigate(folder.parent); };

  const openEntry = (e: Entry) => {
    if (e.projectId && PROJECTS[e.projectId]) {
      const project = PROJECTS[e.projectId];
      openWindow(
        `project-${project.id}`,
        `${project.name} - Properties`,
        "projects",
        <ProjectWindow project={project} />,
      );
      return;
    }
    if (e.open) { e.open(); return; }
    const target = FOLDER_BY_NAME[e.name];
    if (target) navigate(target);
  };

  const selectedEntry = useMemo(
    () => folder.entries.find((e) => e.name === selected) ?? null,
    [folder, selected],
  );

  const toggleSection = (key: keyof typeof openSections) =>
    setOpenSections((s) => ({ ...s, [key]: !s[key] }));

  const otherPlaces = useMemo(() => {
    const places: { name: string; id: string }[] = [];
    if (folder.parent) places.push({ name: FS[folder.parent].label, id: folder.parent });
    places.push({ name: "My Documents", id: "mydocs" });
    places.push({ name: "My Computer", id: "mycomputer" });
    return places.filter((p, i, arr) => p.id !== currentId && arr.findIndex((x) => x.id === p.id) === i);
  }, [folder, currentId]);

  return (
    <div className="flex flex-col h-full font-body text-[12px] select-none">
      {/* Menu Bar */}
      <div className="flex items-center bg-surface-container-low border-b border-outline-variant px-1 py-[2px] gap-0">
        {["File", "Edit", "View", "Favorites", "Tools", "Help"].map((m) => (
          <button key={m} className="px-2 py-[1px] hover:bg-primary hover:text-on-primary">{m}</button>
        ))}
      </div>

      {/* Toolbar */}
      <div className="flex items-center bg-surface-container-low border-b border-outline-variant px-1 py-[3px] gap-[2px] text-[11px]">
        <button onClick={goBack} disabled={!canBack} title="Back" className="xp-tb-btn"><IconNavBack /> <span>Back</span></button>
        <button onClick={goForward} disabled={!canForward} title="Forward" className="xp-tb-btn"><IconNavForward /></button>
        <button onClick={goUp} disabled={!canUp} title="Up" className="xp-tb-btn"><IconNavUp /></button>
        <div className="xp-tb-sep" />
        <button disabled title="Search" className="xp-tb-btn"><IconSearchGlass /> <span>Search</span></button>
        <button disabled title="Folders" className="xp-tb-btn"><IconFoldersPane /> <span>Folders</span></button>
      </div>

      {/* Address Bar */}
      <div className="flex items-center bg-surface-container-low border-b border-outline-variant px-2 py-[2px] gap-2">
        <span className="text-outline text-[10px] shrink-0">Address</span>
        <div className="flex-1 bevel-in bg-white px-2 py-[2px] flex items-center gap-1 min-w-0">
          <span className="shrink-0 flex items-center">{folder.id === "mycomputer" ? <IconMyComputer size={14} /> : <IconFolder size={14} />}</span>
          <span className="text-on-surface text-[11px] truncate">{folder.path}</span>
        </div>
        <button className="bevel-out-thin px-3 py-[2px] text-[10px] bg-surface-container-low">Go</button>
      </div>

      {/* Main area: Blue task pane + content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Task Pane */}
        <div className="xp-taskpane explorer-sidebar">
          {selectedEntry && (
            <TaskSection title={selectedEntry.kind === "folder" ? "Folder Tasks" : "File Tasks"} open={openSections.tasks} onToggle={() => toggleSection("tasks")}>
              <TaskLink Icon={IconTaskRename} label={`Rename this ${selectedEntry.kind}`} />
              <TaskLink Icon={IconTaskMove} label={`Move this ${selectedEntry.kind}`} />
              <TaskLink Icon={IconTaskCopy} label={`Copy this ${selectedEntry.kind}`} />
              {selectedEntry.kind === "folder"
                ? <TaskLink Icon={IconTaskPublish} label="Publish this folder to the Web" />
                : <TaskLink Icon={IconTaskEmail} label="E-mail this file" />}
              <TaskLink Icon={IconTaskShare} label={`Share this ${selectedEntry.kind}`} />
              <TaskLink Icon={IconTaskDelete} label={`Delete this ${selectedEntry.kind}`} />
            </TaskSection>
          )}
          {!selectedEntry && (
            <TaskSection title="File and Folder Tasks" open={openSections.tasks} onToggle={() => toggleSection("tasks")}>
              <TaskLink Icon={IconTaskNewFolder} label="Make a new folder" />
              <TaskLink Icon={IconTaskPublish} label="Publish this folder to the Web" />
              <TaskLink Icon={IconTaskShare} label="Share this folder" />
            </TaskSection>
          )}

          <TaskSection title="Other Places" open={openSections.places} onToggle={() => toggleSection("places")}>
            {otherPlaces.map((p) => (
              <TaskLink key={p.id} Icon={p.id === "mycomputer" ? IconMyComputer : IconFolder} label={p.name} onClick={() => navigate(p.id)} />
            ))}
          </TaskSection>

          <TaskSection title="Details" open={openSections.details} onToggle={() => toggleSection("details")}>
            {selectedEntry ? (
              <>
                <div className="xp-task-detail-line bold">{selectedEntry.name}</div>
                <div className="xp-task-detail-line">{entryType(selectedEntry)}</div>
                {selectedEntry.size != null && <div className="xp-task-detail-line">Size: {selectedEntry.size} KB</div>}
                <div className="xp-task-detail-line">Date Modified: {selectedEntry.modified}</div>
              </>
            ) : (
              <>
                <div className="xp-task-detail-line bold">{folder.label}</div>
                <div className="xp-task-detail-line">File Folder</div>
                <div className="xp-task-detail-line">{folder.entries.length} objects</div>
              </>
            )}
          </TaskSection>
        </div>

        {/* Content Pane */}
        <div className="flex-1 bg-white overflow-y-auto flex flex-col">
          {/* Content header with view switcher */}
          <div className="flex items-center border-b border-outline-variant bg-surface-container-low px-2 py-[2px] text-[10px] font-bold text-on-surface shrink-0">
            <div className="flex items-center gap-1 flex-1">
              {folder.id === "mycomputer" ? <IconMyComputer size={14} /> : <IconFolder size={14} />}
              <span>{folder.label}</span>
            </div>
            <div className="flex gap-[1px]">
              {VIEW_OPTIONS.map((v) => (
                <button key={v.mode} onClick={() => setViewMode(v.mode)} title={v.title} className={`xp-view-btn ${viewMode === v.mode ? "active" : ""}`}>
                  <v.Icon size={15} />
                </button>
              ))}
            </div>
          </div>

          {viewMode === "details" && <DetailsView folder={folder} selected={selected} onSelect={setSelected} onOpen={openEntry} />}
          {viewMode === "list" && <ListView folder={folder} selected={selected} onSelect={setSelected} onOpen={openEntry} />}
          {viewMode === "tiles" && <TilesView folder={folder} selected={selected} onSelect={setSelected} onOpen={openEntry} />}
          {viewMode === "icons" && <IconsView folder={folder} selected={selected} onSelect={setSelected} onOpen={openEntry} />}
        </div>
      </div>

      {/* Status Bar */}
      <div className="flex items-center border-t border-outline-variant bg-surface-container-low px-2 py-[2px] text-[10px] text-outline gap-4 shrink-0">
        <span>{selectedEntry ? "1 object selected" : `${folder.entries.length} objects`}</span>
        {selectedEntry?.size != null && <span className="text-on-surface">{selectedEntry.size} KB</span>}
      </div>
    </div>
  );
}

interface ViewProps {
  folder: FolderDef;
  selected: string | null;
  onSelect: (name: string) => void;
  onOpen: (e: Entry) => void;
}

function DetailsView({ folder, selected, onSelect, onOpen }: ViewProps) {
  return (
    <div className="flex-1">
      <div className="flex items-center border-b border-outline-variant px-2 py-[2px] text-[10px] text-outline bg-surface-container-lowest">
        <span className="flex-1 pl-6">Name</span>
        <span className="w-[60px] text-right">Size</span>
        <span className="w-[80px] text-right">Type</span>
        <span className="w-[110px] text-right pr-2">Date Modified</span>
      </div>
      {folder.entries.map((e) => {
        const Icon = entryIcon(e);
        const sel = selected === e.name;
        return (
          <button key={e.name} onClick={() => onSelect(e.name)} onDoubleClick={() => onOpen(e)}
            className={`flex items-center w-full text-left px-3 py-[5px] text-[12px] border-b border-outline-variant/30 ${sel ? "bg-primary text-on-primary" : "hover:bg-surface-container-low"}`}>
            <div className="flex items-center gap-2 flex-1"><Icon size={16} /><span>{e.name}</span></div>
            <span className={`w-[60px] text-right text-[10px] ${sel ? "text-on-primary" : "text-outline"}`}>{e.size != null ? `${e.size} KB` : ""}</span>
            <span className={`w-[80px] text-right text-[10px] ${sel ? "text-on-primary" : "text-outline"}`}>{entryType(e)}</span>
            <span className={`w-[110px] text-right text-[10px] pr-2 ${sel ? "text-on-primary" : "text-outline"}`}>{e.modified}</span>
          </button>
        );
      })}
    </div>
  );
}

function ListView({ folder, selected, onSelect, onOpen }: ViewProps) {
  return (
    <div className="p-2 flex flex-col flex-wrap content-start gap-x-6 max-h-full">
      {folder.entries.map((e) => {
        const Icon = entryIcon(e);
        const sel = selected === e.name;
        return (
          <button key={e.name} onClick={() => onSelect(e.name)} onDoubleClick={() => onOpen(e)}
            className={`flex items-center gap-1.5 text-left px-1 py-[2px] text-[12px] w-[180px] ${sel ? "bg-primary text-on-primary" : "hover:bg-surface-container-low"}`}>
            <Icon size={16} /><span className="truncate">{e.name}</span>
          </button>
        );
      })}
    </div>
  );
}

function TilesView({ folder, selected, onSelect, onOpen }: ViewProps) {
  return (
    <div className="xp-tiles">
      {folder.entries.map((e) => {
        const Icon = entryIcon(e);
        const sel = selected === e.name;
        return (
          <button key={e.name} onClick={() => onSelect(e.name)} onDoubleClick={() => onOpen(e)} className={`xp-tile ${sel ? "selected" : ""}`}>
            <Icon size={32} />
            <div className="min-w-0">
              <div className="truncate font-bold">{e.name}</div>
              <div className="xp-tile-sub truncate">{e.kind === "folder" ? "File Folder" : entryType(e)}</div>
            </div>
          </button>
        );
      })}
    </div>
  );
}

function IconsView({ folder, selected, onSelect, onOpen }: ViewProps) {
  return (
    <div className="xp-icons">
      {folder.entries.map((e) => {
        const Icon = entryIcon(e);
        const sel = selected === e.name;
        return (
          <button key={e.name} onClick={() => onSelect(e.name)} onDoubleClick={() => onOpen(e)} className={`xp-icon-cell ${sel ? "selected" : ""}`}>
            <Icon size={32} /><span className="text-[11px] leading-tight break-words">{e.name}</span>
          </button>
        );
      })}
    </div>
  );
}

interface TaskSectionProps {
  title: string;
  open: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}

function TaskSection({ title, open, onToggle, children }: TaskSectionProps) {
  return (
    <div className="xp-task-section">
      <button className="xp-task-header w-full" onClick={onToggle}>
        <span>{title}</span>
        <span className="xp-task-chevron">{open ? "\u25B2" : "\u25BC"}</span>
      </button>
      {open && <div className="xp-task-body">{children}</div>}
    </div>
  );
}

function TaskLink({ Icon, label, onClick }: { Icon: IconCmp; label: string; onClick?: () => void }) {
  return (
    <button className="xp-task-link" onClick={onClick}>
      <span className="shrink-0 flex items-center"><Icon size={16} /></span>
      <span>{label}</span>
    </button>
  );
}

export default FileExplorer;
