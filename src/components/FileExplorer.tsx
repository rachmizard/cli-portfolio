import { useState } from "react";
import { IconFolder, IconDocument, IconTerminal, IconPDF } from "./Icons";

interface Project {
  name: string;
  desc: string;
  tags: string[];
  type: "folder" | "file";
  ext?: string;
}

const PROJECTS: Project[] = [
  { name: "nexus-ui", desc: "Component library with retro OS design tokens", tags: ["React", "TypeScript", "Tailwind"], type: "folder" },
  { name: "cli-portfolio", desc: "This portfolio — Windows XP simulation on the web", tags: ["Vite", "React", "CSS"], type: "folder" },
  { name: "api-gateway", desc: "GraphQL gateway aggregating 5 microservices", tags: ["Node.js", "GraphQL", "Redis"], type: "folder" },
  { name: "fintrack", desc: "Personal finance tracker with Telegram bot", tags: ["Next.js", "Turso", "Drizzle"], type: "folder" },
  { name: "maha-hr-v2", desc: "HR attendance app with selfie verification", tags: ["TanStack Start", "React 19", "Neon PG"], type: "folder" },
  { name: "resume.pdf", desc: "Latest CV — updated June 2026", tags: ["PDF"], type: "file", ext: "pdf" },
  { name: "readme.txt", desc: "Project overview and setup guide", tags: ["Text"], type: "file", ext: "txt" },
];

type ViewMode = "details" | "list";

function FileExplorer() {
  const [selectedFolder, setSelectedFolder] = useState("Projects");
  const [viewMode, setViewMode] = useState<ViewMode>("details");
  const [selectedFile, setSelectedFile] = useState<string | null>(null);

  const folderTree = [
    { name: "Desktop", icon: IconFolder, children: [] },
    { name: "My Documents", icon: IconFolder, children: [
      { name: "Projects", icon: IconFolder, active: true, children: [] },
    ]},
    { name: "My Computer", icon: IconFolder, children: [] },
    { name: "My Network Places", icon: IconFolder, children: [] },
    { name: "Recycle Bin", icon: IconFolder, children: [] },
  ];

  const getFileIcon = (project: Project) => {
    if (project.type === "folder") return IconFolder;
    if (project.ext === "pdf") return IconPDF;
    if (project.ext === "txt") return IconDocument;
    return IconTerminal;
  };

  return (
    <div className="flex flex-col h-full font-body text-[12px] select-none">
      {/* Menu Bar */}
      <div className="flex items-center bg-surface-container-low border-b border-outline-variant px-1 py-[2px] gap-0">
        {["File", "Edit", "View", "Favorites", "Tools", "Help"].map((m) => (
          <button
            key={m}
            className="px-2 py-[1px] hover:bg-primary hover:text-on-primary"
          >
            {m}
          </button>
        ))}
      </div>

      {/* Toolbar */}
      <div className="flex items-center bg-surface-container-low border-b border-outline-variant px-1 py-[2px] gap-[2px]">
        {[
          { label: "Back", title: "Back" },
          { label: "", title: "Forward" },
          { label: "Up", title: "Up" },
        ].map((btn, i) => (
          <button
            key={i}
            title={btn.title}
            disabled
            className="bevel-out-thin px-2 py-[2px] text-[10px] text-outline bg-surface-container-low cursor-default"
          >
            {btn.label || "→"}
          </button>
        ))}
        <div className="w-[2px]" />
        <button
          disabled
          className="bevel-out-thin px-3 py-[2px] text-[10px] text-outline bg-surface-container-low cursor-default flex items-center gap-1"
        >
          🔍 Search
        </button>
        <button
          disabled
          className="bevel-out-thin px-3 py-[2px] text-[10px] text-outline bg-surface-container-low cursor-default"
        >
          📁 Folders
        </button>
      </div>

      {/* Address Bar */}
      <div className="flex items-center bg-surface-container-low border-b border-outline-variant px-2 py-[2px] gap-2">
        <span className="text-outline text-[10px] shrink-0">Address</span>
        <div className="flex-1 bevel-in bg-white px-2 py-[2px] flex items-center gap-1">
          <IconFolder />
          <span className="text-on-surface text-[11px]">C:\Documents and Settings\rachmizard\My Documents\Projects</span>
        </div>
        <button className="bevel-out-thin px-3 py-[2px] text-[10px] bg-surface-container-low">Go</button>
      </div>

      {/* Main area: Sidebar + File List */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Sidebar — Folder Tree */}
        <div className="w-[180px] min-w-[140px] border-r border-outline-variant bg-white overflow-y-auto p-2 explorer-sidebar">
          <div className="text-[11px] font-bold text-outline px-1 py-[3px]">Folders</div>
          {folderTree.map((folder, i) => (
            <div key={i}>
              <button
                className={`flex items-center gap-1.5 w-full text-left px-1 py-[3px] hover:bg-primary hover:text-on-primary ${
                  folder.name === "My Documents" ? "font-bold" : ""
                }`}
              >
                <folder.icon />
                <span className="truncate text-[12px]">{folder.name}</span>
              </button>
              {folder.children.map((child, j) => (
                <button
                  key={j}
                  onClick={() => setSelectedFolder(child.name)}
                  className={`flex items-center gap-1.5 w-full text-left pl-6 py-[3px] text-[12px] ${
                    selectedFolder === child.name
                      ? "bg-primary text-on-primary"
                      : "hover:bg-primary hover:text-on-primary"
                  }`}
                >
                  <child.icon />
                  <span className="truncate">{child.name}</span>
                </button>
              ))}
            </div>
          ))}
        </div>

        {/* Right Pane — File List */}
        <div className="flex-1 bg-white overflow-y-auto">
          {/* Header */}
          <div className="flex items-center border-b border-outline-variant bg-surface-container-low px-2 py-[2px] text-[10px] font-bold text-on-surface">
            <div className="flex items-center gap-1 flex-1">
              <IconFolder />
              <span>{selectedFolder}</span>
            </div>
            <div className="flex gap-0">
              <button
                onClick={() => setViewMode("details")}
                className={`px-2 py-[1px] text-[10px] ${viewMode === "details" ? "bg-primary text-on-primary" : ""}`}
              >
                📋
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`px-2 py-[1px] text-[10px] ${viewMode === "list" ? "bg-primary text-on-primary" : ""}`}
              >
                📄
              </button>
            </div>
          </div>

          {/* Column headers (details view) */}
          {viewMode === "details" && (
            <div className="flex items-center border-b border-outline-variant px-2 py-[2px] text-[10px] text-outline bg-surface-container-lowest">
              <span className="flex-1 pl-6">Name</span>
              <span className="w-[60px] text-right">Size</span>
              <span className="w-[70px] text-right">Type</span>
              <span className="w-[100px] text-right pr-2">Date Modified</span>
            </div>
          )}

          {/* File rows */}
          {PROJECTS.map((project, i) => {
            const FileIcon = getFileIcon(project);
            const isSelected = selectedFile === project.name;

            return (
              <button
                key={i}
                onClick={() => setSelectedFile(project.name)}
                onDoubleClick={() => {
                  if (project.name === "resume.pdf") {
                    window.open("/cv.pdf", "_blank");
                  }
                }}
                className={`flex items-center w-full text-left px-3 py-[5px] text-[12px] border-b border-outline-variant/30 ${
                  isSelected
                    ? "bg-primary text-on-primary"
                    : "hover:bg-surface-container-low"
                }`}
              >
                {viewMode === "details" ? (
                  <>
                    <div className="flex items-center gap-2 flex-1">
                      <FileIcon />
                      <span className={isSelected ? "text-on-primary" : "text-on-surface"}>
                        {project.name}
                      </span>
                    </div>
                    <span className="w-[60px] text-right text-outline text-[10px]">4 KB</span>
                    <span className="w-[70px] text-right text-outline text-[10px]">
                      {project.type === "folder" ? "File Folder" : `${project.ext?.toUpperCase()} File`}
                    </span>
                    <span className="w-[100px] text-right text-outline text-[10px] pr-2">
                      6/11/2026 10:42 AM
                    </span>
                  </>
                ) : (
                  <div className="flex items-center gap-2">
                    <FileIcon />
                    <span className={isSelected ? "text-on-primary" : "text-on-surface"}>
                      {project.name}
                    </span>
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Status Bar */}
      <div className="flex items-center border-t border-outline-variant bg-surface-container-low px-2 py-[2px] text-[10px] text-outline gap-4">
        <span>{PROJECTS.length} objects</span>
        {selectedFile && (
          <span className="text-on-surface">Selected: {selectedFile}</span>
        )}
      </div>
    </div>
  );
}

export default FileExplorer;
