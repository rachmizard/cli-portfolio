import type { ReactNode } from "react";

export const WELCOME_CONTENT: ReactNode = (
  <div className="p-4 space-y-4 font-mono text-[13px] leading-[18px]">
    <div className="text-center">
      <h1 className="font-bold text-[24px] text-primary mb-1">Rachmizard</h1>
      <p className="text-on-surface-variant text-[14px]">Full-Stack Developer & UI Engineer</p>
    </div>
    <div className="bevel-in bg-surface-container-lowest p-3 space-y-1">
      <p className="text-secondary font-bold">C:\Users\rachmizard&gt; whoami</p>
      <p className="text-on-surface">
        Full-stack developer with 5+ years building web apps. Love clean architecture, typed APIs, and retro UIs.
      </p>
    </div>
    <div className="bevel-in bg-surface-container-lowest p-3 space-y-1">
      <p className="text-secondary font-bold">C:\Users\rachmizard&gt; skills --list</p>
      <div className="flex flex-wrap gap-2 mt-1">
        {["React", "TypeScript", "Next.js", "Node.js", "Tailwind", "PostgreSQL", "Docker", "REST APIs"].map((s) => (
          <span key={s} className="bg-primary-container text-on-primary-container px-2 py-0.5 text-[11px] bevel-out">{s}</span>
        ))}
      </div>
    </div>
  </div>
);

export const PROJECTS_CONTENT: ReactNode = (
  <div className="p-4 space-y-3 font-mono text-[13px]">
    {([
      { name: "nexus-ui", desc: "Component library with retro OS design tokens", tags: ["React", "TypeScript", "Tailwind"] },
      { name: "cli-portfolio", desc: "This portfolio — Windows XP simulation on the web", tags: ["Vite", "React", "CSS"] },
      { name: "api-gateway", desc: "GraphQL gateway aggregating 5 microservices", tags: ["Node.js", "GraphQL", "Redis"] },
    ]).map((p) => (
      <div key={p.name} className="bevel-in bg-surface-container-lowest p-3 hover:bg-surface-container transition-colors cursor-pointer">
        <div className="flex items-center gap-2 mb-2">
          <span className="material-symbols-outlined text-tertiary text-[20px]">folder</span>
          <span className="font-bold text-primary">src/projects/{p.name}.js</span>
        </div>
        <p className="text-on-surface-variant mb-2">{p.desc}</p>
        <div className="flex flex-wrap gap-1">
          {p.tags.map((t) => (
            <span key={t} className="bg-surface-container text-on-surface-variant px-2 py-0.5 text-[11px] bevel-out">{t}</span>
          ))}
        </div>
      </div>
    ))}
  </div>
);

export const ABOUT_CONTENT: ReactNode = (
  <div className="p-4 font-mono text-[13px] leading-[18px] space-y-3">
    <div className="bevel-in bg-surface-container-lowest p-3">
      <p className="text-secondary font-bold mb-1">C:\Users\rachmizard\Documents\resume.txt</p>
      <div className="space-y-2">
        <p><span className="text-tertiary">Name:</span> <span className="text-on-surface">Rachmizard</span></p>
        <p><span className="text-tertiary">Role:</span> <span className="text-on-surface">Senior Full-Stack Developer</span></p>
        <p><span className="text-tertiary">Location:</span> <span className="text-on-surface">Jakarta, Indonesia</span></p>
        <p><span className="text-tertiary">Experience:</span> <span className="text-on-surface">5+ years</span></p>
      </div>
    </div>
  </div>
);
