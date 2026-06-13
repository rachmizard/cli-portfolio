import { IconFolder, IconTaskPublish, IconTaskShare } from "./Icons";
import type { Project } from "../projects";

interface ProjectWindowProps {
  project: Project;
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-secondary font-bold text-[11px] mb-1">{children}</p>
  );
}

export default function ProjectWindow({ project }: ProjectWindowProps) {
  return (
    <div className="p-4 space-y-3 h-full overflow-y-auto bg-white font-body text-[12px]">
      {/* ── Header: icon + name + tagline ── */}
      <div className="flex items-start gap-3 pb-3 border-b border-outline-variant">
        <IconFolder size={48} />
        <div className="min-w-0">
          <h1 className="font-bold text-[20px] text-primary leading-tight">{project.name}</h1>
          <p className="text-on-surface-variant text-[12px] mt-0.5">{project.tagline}</p>
        </div>
      </div>

      {/* ── Screenshot / Preview ── */}
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

      {/* ── Summary ── */}
      <div>
        <SectionLabel>Summary</SectionLabel>
        <p className="text-on-surface">{project.summary}</p>
      </div>

      {/* ── My Role ── */}
      <div className="bevel-in bg-surface-container-lowest p-2">
        <SectionLabel>My Role</SectionLabel>
        <p className="text-on-surface">{project.role}</p>
      </div>

      {/* ── Tech Stack ── */}
      <div>
        <SectionLabel>Tech Stack</SectionLabel>
        <div className="space-y-1.5">
          {project.stack.map((group) => (
            <div key={group.label}>
              <span className="text-on-surface-variant text-[11px] font-bold">{group.label}:</span>{" "}
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
      </div>

      {/* ── Architecture ── */}
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

      {/* ── Features ── */}
      {project.features.length > 0 && (
        <div>
          <SectionLabel>Features</SectionLabel>
          <ul className="space-y-1 columns-1 sm:columns-2 gap-x-4">
            {project.features.map((feat, i) => (
              <li key={i} className="text-on-surface flex gap-1.5 break-inside-avoid">
                <span className="text-primary shrink-0">▸</span>
                <span>{feat}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* ── Links ── */}
      {project.links.length > 0 && (
        <div>
          <SectionLabel>Links</SectionLabel>
          <div className="flex flex-wrap gap-2">
            {project.links.map((link) => (
              <button
                key={link.url}
                onClick={() => window.open(link.url, "_blank")}
                className="bevel-out-thin px-3 py-1 text-[11px] bg-surface-container-low text-on-surface hover:bg-surface-container cursor-pointer flex items-center gap-1.5"
              >
                {link.kind === "demo" ? <IconTaskPublish size={14} /> : <IconTaskShare size={14} />}
                {link.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}