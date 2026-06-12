import type { ReactNode } from "react";
import FileExplorer from "./components/FileExplorer";
import Winamp from "./components/Winamp";

export const WELCOME_CONTENT: ReactNode = (
  <div className="p-4 space-y-4 font-mono text-[13px] leading-[18px]">
    <div className="text-center">
      <h1 className="font-bold text-[24px] text-primary mb-1">Rachmizard</h1>
      <p className="text-on-surface-variant text-[14px]">Full-Stack Developer & UI Engineer</p>
    </div>
    <div className="bevel-in bg-surface-container-lowest p-3 space-y-1">
      <p className="text-secondary font-bold">C:\Users\rachmizard&gt; whoami</p>
      <p className="text-on-surface">
        A hard working and persistent web developer with over 7 years of experience. Previously worked at several IT companies, on both front-end and back-end. Proven skills in React, Next.js, and TanStack Start with TypeScript, mobile development with React Native and Flutter, plus Go and Node.js/Express web service APIs — a full-stack JavaScript developer.
      </p>
    </div>
    <div className="bevel-in bg-surface-container-lowest p-3 space-y-1">
      <p className="text-secondary font-bold">C:\Users\rachmizard&gt; skills --list</p>
      <div className="flex flex-wrap gap-2 mt-1">
        {["React", "Next.js", "TanStack Start", "TypeScript", "React Native", "Flutter", "Go", "Node.js", "Express", "PostgreSQL"].map((s) => (
          <span key={s} className="bg-primary-container text-on-primary-container px-2 py-0.5 text-[11px] bevel-out">{s}</span>
        ))}
      </div>
    </div>
  </div>
);

export const PROJECTS_CONTENT: ReactNode = <FileExplorer />;

export const WINAMP_CONTENT: ReactNode = <Winamp />;

export const COMPUTER_CONTENT: ReactNode = (
  <div className="p-4 font-body text-[11px] space-y-3 h-full overflow-y-auto bg-white">
    <div className="font-bold text-[12px] text-on-surface border-b border-outline-variant pb-1">Files Stored on This Computer</div>
    <div className="space-y-2">
      <div className="bevel-in bg-surface-container-lowest p-2">
        <p className="text-secondary font-bold">Hard Disk Drives</p>
        <p className="text-on-surface mt-1">Local Disk (C:) — 38.1 GB free of 74.5 GB</p>
      </div>
      <div className="bevel-in bg-surface-container-lowest p-2">
        <p className="text-secondary font-bold">Devices with Removable Storage</p>
        <p className="text-on-surface mt-1">3½ Floppy (A:)</p>
        <p className="text-on-surface">CD Drive (D:)</p>
      </div>
      <div className="bevel-in bg-surface-container-lowest p-2 space-y-1">
        <p className="text-tertiary">System: Windows XP Professional</p>
        <p className="text-tertiary">Processor: Rachmizard Core @ 5.0 GHz</p>
        <p className="text-tertiary">Memory: 1.00 GB RAM</p>
      </div>
    </div>
  </div>
);

export const RECYCLE_CONTENT: ReactNode = (
  <div className="flex flex-col items-center justify-center h-full font-body text-[11px] text-outline bg-white gap-2 p-6 text-center">
    <p className="text-[12px] text-on-surface">The Recycle Bin is empty.</p>
    <p>There are no items to display. Drag deleted regrets here.</p>
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
        <p><span className="text-tertiary">Experience:</span> <span className="text-on-surface">7+ years</span></p>
      </div>
    </div>
  </div>
);
