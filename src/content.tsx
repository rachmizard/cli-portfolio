import type { ReactNode } from "react";
import FileExplorer from "./components/FileExplorer";
import Winamp from "./components/Winamp";
import Minesweeper from "./components/Minesweeper";
import WordWindow from "./components/WordWindow";
import Notepad from "./components/Notepad";
import MyComputer from "./components/MyComputer";
import RecycleBin from "./components/RecycleBin";
import InternetExplorer from "./components/InternetExplorer";

export const WELCOME_CONTENT: ReactNode = (
  <div className="h-full overflow-y-auto p-4 space-y-4 font-mono text-[13px] leading-[18px]">
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

export const MINESWEEPER_CONTENT: ReactNode = <Minesweeper />;

export const WORD_CONTENT: ReactNode = <WordWindow />;

export const COMPUTER_CONTENT: ReactNode = <MyComputer />;

export const RECYCLE_CONTENT: ReactNode = <RecycleBin />;

export const IE_CONTENT: ReactNode = <InternetExplorer />;

export const ABOUT_CONTENT: ReactNode = <Notepad />;
