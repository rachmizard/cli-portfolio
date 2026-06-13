import { RESUME } from "../data/cv";

// ── Authentic Microsoft Word 2003 palette ──
const WD = {
  titleBg: "linear-gradient(180deg, #4a7dc7 0%, #2b579a 50%, #1e3f73 100%)",
  menuBg: "#f1f1f1",
  toolbarBg: "#f1f1f1",
  canvasBg: "#808080",
  pageBg: "#ffffff",
  rulerBg: "#f1f1f1",
  statusBg: "#f0f0f0",
  border: "#d0d0d0",
  blue: "#2b579a",
} as const;

const MENU_ITEMS = [
  "File",
  "Edit",
  "View",
  "Insert",
  "Format",
  "Tools",
  "Table",
  "Window",
  "Help",
] as const;

const RULER_TICKS = Array.from({ length: 32 });

function SectionHeading({ children }: { children: string }) {
  return (
    <h2 className="text-[13px] font-bold uppercase tracking-wide mt-5 mb-1 border-b border-black pb-[2px]">
      {children}
    </h2>
  );
}

function WordWindow() {
  return (
    <div className="h-full flex flex-col select-none font-body">
      {/* ── Inner Word title strip ── */}
      <div
        className="flex items-center gap-1 px-2 text-white text-[11px]"
        style={{ background: WD.titleBg, height: 22, flex: "0 0 auto" }}
      >
        <span className="font-bold text-[12px] leading-none">W</span>
        <span>CV.doc - Microsoft Word</span>
      </div>

      {/* ── Menu bar ── */}
      <div
        className="flex items-center px-1"
        style={{
          background: WD.menuBg,
          borderBottom: `1px solid ${WD.border}`,
          flex: "0 0 auto",
        }}
      >
        {MENU_ITEMS.map((m) => (
          <button
            key={m}
            tabIndex={-1}
            className="px-2 py-[1px] text-[12px] font-body hover:bg-[#316ac5] hover:text-white"
          >
            {m}
          </button>
        ))}
      </div>

      {/* ── Standard toolbar ── */}
      <div
        aria-hidden="true"
        className="flex items-center px-1 gap-[2px] text-[11px]"
        style={{
          background: WD.toolbarBg,
          borderBottom: `1px solid ${WD.border}`,
          height: 26,
          flex: "0 0 auto",
        }}
      >
        <button tabIndex={-1} title="New" className="xp-tb-btn">📄</button>
        <button tabIndex={-1} title="Open" className="xp-tb-btn">📂</button>
        <button tabIndex={-1} title="Save" className="xp-tb-btn">💾</button>
        <div className="xp-tb-sep" />
        <button tabIndex={-1} title="Print" className="xp-tb-btn">🖨️</button>
        <button tabIndex={-1} title="Print Preview" className="xp-tb-btn">🔍</button>
        <div className="xp-tb-sep" />
        <button tabIndex={-1} title="Cut" className="xp-tb-btn">✂️</button>
        <button tabIndex={-1} title="Copy" className="xp-tb-btn">📋</button>
        <button tabIndex={-1} title="Paste" className="xp-tb-btn">📌</button>
        <div className="xp-tb-sep" />
        <button tabIndex={-1} title="Undo" className="xp-tb-btn">↶</button>
        <button tabIndex={-1} title="Redo" className="xp-tb-btn">↷</button>
      </div>

      {/* ── Formatting toolbar ── */}
      <div
        aria-hidden="true"
        className="flex items-center px-1 gap-[2px] text-[11px]"
        style={{
          background: WD.toolbarBg,
          borderBottom: `1px solid ${WD.border}`,
          height: 26,
          flex: "0 0 auto",
        }}
      >
        <div
          className="bevel-in bg-white text-[11px] px-1 flex items-center"
          style={{ width: 70, height: 18 }}
        >
          Normal
        </div>
        <div
          className="bevel-in bg-white text-[11px] px-1 flex items-center"
          style={{ width: 120, height: 18 }}
        >
          Times New Roman
        </div>
        <div
          className="bevel-in bg-white text-[11px] px-1 flex items-center"
          style={{ width: 36, height: 18 }}
        >
          12
        </div>
        <div className="xp-tb-sep" />
        <button tabIndex={-1} title="Bold" className="xp-tb-btn font-bold">B</button>
        <button tabIndex={-1} title="Italic" className="xp-tb-btn italic">I</button>
        <button tabIndex={-1} title="Underline" className="xp-tb-btn underline">U</button>
        <div className="xp-tb-sep" />
        <button tabIndex={-1} title="Align Left" className="xp-tb-btn">☰</button>
        <button tabIndex={-1} title="Center" className="xp-tb-btn">≡</button>
        <button tabIndex={-1} title="Align Right" className="xp-tb-btn">☰</button>
        <button tabIndex={-1} title="Justify" className="xp-tb-btn">▤</button>
      </div>

      {/* ── Ruler ── */}
      <div
        aria-hidden="true"
        className="flex items-end overflow-hidden px-8"
        style={{
          background: WD.rulerBg,
          borderBottom: `1px solid ${WD.border}`,
          height: 18,
          flex: "0 0 auto",
        }}
      >
        {RULER_TICKS.map((_, i) => (
          <div
            key={i}
            style={{
              width: 1,
              height: i % 4 === 0 ? 8 : 4,
              marginRight: 15,
              background: "#999",
            }}
          />
        ))}
      </div>

      {/* ── Document canvas ── */}
      <div
        style={{ background: WD.canvasBg }}
        className="flex-1 overflow-y-auto px-8 py-6"
      >
        <div
          style={{
            background: WD.pageBg,
            maxWidth: "640px",
            margin: "0 auto",
            padding: "48px 56px",
            minHeight: "800px",
            boxShadow: "2px 2px 6px rgba(0,0,0,0.4)",
            border: "1px solid #999",
          }}
          className="font-doc text-[13px] leading-[1.5] text-black"
        >
          {/* Header */}
          <h1 className="text-[22px] font-bold tracking-wide text-center">
            {RESUME.name}
          </h1>
          <div className="text-[13px] text-center">{RESUME.title}</div>
          <div className="text-[12px] text-center text-gray-600">
            {RESUME.location}
          </div>
          <div className="text-[12px] text-center mt-1">
            {RESUME.contacts.map((c, i) => {
              const isMail = c.href?.startsWith("mailto:");
              return (
                <span key={c.label}>
                  {i > 0 && " | "}
                  {c.href ? (
                    <a
                      href={c.href}
                      className="text-blue-700 underline"
                      {...(isMail
                        ? {}
                        : { target: "_blank", rel: "noopener noreferrer" })}
                    >
                      {c.value}
                    </a>
                  ) : (
                    c.value
                  )}
                </span>
              );
            })}
          </div>

          <hr className="my-3 border-black" />

          {/* Summary */}
          <p>{RESUME.summary}</p>

          {/* Work Experience */}
          <SectionHeading>Work Experience</SectionHeading>
          {RESUME.experience.map((exp) => (
            <div key={exp.company} className="mt-2">
              <div className="font-bold">
                {exp.company}
                <span className="font-normal">
                  {" — "}
                  {exp.location}
                </span>
              </div>
              {exp.roles.map((role) => (
                <div
                  key={role.title + role.period}
                  className="flex justify-between"
                >
                  <span className="italic">{role.title}</span>
                  <span>{role.period}</span>
                </div>
              ))}
              <ul className="list-disc pl-5 mt-1 space-y-[2px]">
                {exp.bullets.map((b, i) => (
                  <li key={i}>{b}</li>
                ))}
              </ul>
            </div>
          ))}

          {/* Education */}
          <SectionHeading>Education</SectionHeading>
          {RESUME.education.map((edu) => (
            <div key={edu.school} className="mt-2">
              <div className="flex justify-between">
                <span className="font-bold">{edu.school}</span>
                <span>{edu.period}</span>
              </div>
              <div>{edu.location}</div>
              <div className="italic">{edu.degree}</div>
              {edu.note && <div className="text-gray-700">{edu.note}</div>}
            </div>
          ))}

          {/* Skills */}
          <SectionHeading>Skills</SectionHeading>
          {RESUME.skills.map((group) => (
            <div key={group.label} className="mt-1">
              <span className="font-bold">{group.label}: </span>
              {group.items.join(", ")}
            </div>
          ))}

          {/* Certifications */}
          <SectionHeading>Certifications</SectionHeading>
          <ul className="list-disc pl-5 space-y-[2px]">
            {RESUME.certifications.map((cert, i) => (
              <li key={i}>{cert}</li>
            ))}
          </ul>

          {/* Portfolio */}
          <SectionHeading>Portfolio</SectionHeading>
          {RESUME.portfolio.map((p) => (
            <div key={p.href} className="mt-1">
              <a
                href={p.href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-700 underline"
              >
                {p.label}
              </a>
              {p.note && <span className="text-gray-700">{" — "}{p.note}</span>}
            </div>
          ))}
        </div>
      </div>

      {/* ── Status bar ── */}
      <div
        className="flex items-center justify-between px-2 text-[11px] font-body"
        style={{
          background: WD.statusBg,
          borderTop: `1px solid ${WD.border}`,
          height: 20,
          flex: "0 0 auto",
        }}
      >
        <span>Page 1 of 1&nbsp;&nbsp;|&nbsp;&nbsp;Section 1</span>
        <span>English (US)&nbsp;&nbsp;|&nbsp;&nbsp;INS</span>
      </div>
    </div>
  );
}

export default WordWindow;
