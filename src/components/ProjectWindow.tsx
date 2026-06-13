import { useState } from "react";
import { IconMyComputer, IconTaskPublish, IconTaskShare } from "./Icons";
import type { Project } from "../projects";

interface ProjectWindowProps {
  project: Project;
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-secondary font-bold text-[11px] mb-1">{children}</p>
  );
}

type TabKey = "summary" | "tech" | "features" | "links";

export default function ProjectWindow({ project }: ProjectWindowProps) {
  const tabs: { key: TabKey; label: string }[] = [
    { key: "summary", label: "Summary" },
    { key: "tech", label: "Tech" },
    { key: "features", label: "Features" },
    ...(project.links.length > 0
      ? [{ key: "links" as TabKey, label: "Links" }]
      : []),
  ];

  const [activeTab, setActiveTab] = useState<TabKey>("summary");

  return (
    <div className="h-full flex flex-col bg-white font-body text-[12px]">
      {/* ── Hero Banner (XP Luna gradient) ── */}
      <div
        className="flex items-start gap-3 px-4 py-3 shrink-0"
        style={{
          background:
            "linear-gradient(180deg, #0054e3 0%, #3c6df0 10%, #6b9fff 40%, #3c6df0 80%, #1a4cc7 100%)",
          borderBottom: "1px solid rgba(255,255,255,0.3)",
          boxShadow:
            "inset 0 1px 0 rgba(255,255,255,0.4), inset 0 -1px 0 rgba(0,0,0,0.15)",
        }}
      >
        <IconMyComputer size={44} />
        <div className="min-w-0">
          <h1
            className="font-bold text-[20px] leading-tight"
            style={{
              color: "#ffffff",
              textShadow: "1px 1px 1px rgba(0,0,0,0.4)",
            }}
          >
            {project.name}
          </h1>
          <p
            className="text-[12px] mt-0.5"
            style={{ color: "rgba(255,255,255,0.85)" }}
          >
            {project.tagline}
          </p>
        </div>
      </div>

      {/* ── Tab Strip (XP property-sheet style) ── */}
      <div className="flex gap-1 shrink-0 bg-surface-container-high pt-1.5 px-3 border-b border-outline-variant">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.key;
          return (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`px-5 py-1.5 text-[11px] font-body cursor-pointer ${
                isActive
                  ? "bg-white text-on-surface font-bold -mb-px"
                  : "text-on-surface-variant bevel-out-thin bg-surface-container-low hover:bg-surface-container"
              }`}
              style={
                isActive
                  ? {
                      borderTop: "2px solid #3168d5",
                      borderLeft: "1px solid #808080",
                      borderRight: "1px solid #808080",
                      borderBottom: "2px solid white",
                    }
                  : undefined
              }
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* ── Tab Content Panel (scrollable) ── */}
      <div className="flex-1 overflow-y-auto p-5 space-y-3">
        {activeTab === "summary" && (
          <>
            {/* Screenshot / Preview */}
            <div className="bevel-in bg-surface-container-lowest p-1">
              {project.screenshot ? (
                <img
                  src={project.screenshot}
                  alt={`${project.name} preview`}
                  className="w-full object-contain max-h-[200px]"
                />
              ) : (
                <div className="flex items-center justify-center h-[120px] text-outline text-[11px]">
                  Preview not available
                </div>
              )}
            </div>

            {/* Summary */}
            <div>
              <SectionLabel>Summary</SectionLabel>
              <p className="text-on-surface">{project.summary}</p>
            </div>

            {/* My Role */}
            <div className="bevel-in bg-surface-container-lowest p-2">
              <SectionLabel>My Role</SectionLabel>
              <p className="text-on-surface">{project.role}</p>
            </div>

            {/* Architecture */}
            {project.architecture.length > 0 && (
              <div>
                <SectionLabel>Architecture</SectionLabel>
                <ul className="space-y-1">
                  {project.architecture.map((line, i) => (
                    <li key={i} className="text-on-surface flex gap-1.5">
                      <span className="text-primary shrink-0">▸</span>
                      <span>{line}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </>
        )}

        {activeTab === "tech" && (
          <div className="space-y-1.5">
            {project.stack.map((group) => (
              <div key={group.label}>
                <SectionLabel>{group.label}</SectionLabel>
                <span className="flex flex-wrap gap-1.5 mt-0.5">
                  {group.items.map((item) => (
                    <span
                      key={item}
                      className="bg-primary-container text-on-primary-container px-2 py-0.5 text-[11px] bevel-out"
                    >
                      {item}
                    </span>
                  ))}
                </span>
              </div>
            ))}
          </div>
        )}

        {activeTab === "features" && (
          <div
            className="gap-x-4 gap-y-1.5"
            style={{
              display: "grid",
              gridTemplateColumns:
                "repeat(auto-fill, minmax(160px, 1fr))",
            }}
          >
            {project.features.map((feat, i) => (
              <div
                key={i}
                className="text-on-surface flex gap-1.5 items-start"
              >
                <span
                  className="shrink-0 text-[11px] font-bold"
                  style={{ color: "#3c9a3e" }}
                >
                  ✓
                </span>
                <span className="text-[11px]">{feat}</span>
              </div>
            ))}
          </div>
        )}

        {activeTab === "links" && project.links.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {project.links.map((link) => (
              <button
                key={link.url}
                onClick={() => window.open(link.url, "_blank")}
                className="bevel-out-thin px-3 py-1 text-[11px] bg-surface-container-low text-on-surface hover:bg-surface-container cursor-pointer flex items-center gap-1.5"
              >
                {link.kind === "demo" ? (
                  <IconTaskPublish size={14} />
                ) : (
                  <IconTaskShare size={14} />
                )}
                {link.label}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}