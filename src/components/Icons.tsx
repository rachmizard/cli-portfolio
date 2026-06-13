/** Windows XP-style SVG icons — pixel art, size-configurable */

import { useId } from "react";
import { XP } from "../theme";

interface IconProps {
  size?: number;
}

/** Render a real Windows XP .ico from public/icons via <img>. */
export const IcoIcon = ({ name, size = 32 }: { name: string; size?: number }) => (
  <img
    src={`/icons/${encodeURIComponent(name)}.ico`}
    width={size}
    height={size}
    alt=""
    draggable={false}
    className="pointer-events-none select-none object-contain"
    style={{ width: size, height: size }}
  />
);

/** XP four-color flag — rounded-rect variant (boot/shutdown splash) */
export const IconXPFlag = ({ size = 64 }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" className="drop-shadow-lg">
    <g transform="rotate(-8 12 11)">
      <rect x="1" y="2" width="10.5" height="8" rx="1" fill={XP.flagRed} />
      <rect x="12.5" y="2" width="11" height="8" rx="1" fill={XP.flagGreen} />
      <rect x="1" y="11" width="10.5" height="9" rx="1" fill={XP.flagBlue} />
      <rect x="12.5" y="11" width="11" height="9" rx="1" fill={XP.flagYellow} />
    </g>
  </svg>
);

/** XP four-color flag — wavy clipped variant (start button) */
export const IconXPFlagWave = ({ size = 18 }: IconProps) => {
  const clip = useId();
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" className="inline-block -mt-0.5 drop-shadow-sm">
      <defs>
        <clipPath id={clip}>
          <path d="M2 5C6 3.5 10 3.5 14 5C18 6.5 21 6.5 22 6V18C20 18.8 17 18.5 14 17.3C10 15.8 6 15.8 2 17.3Z" />
        </clipPath>
      </defs>
      <g clipPath={`url(#${clip})`} transform="rotate(-8 12 11)">
        <rect x="1" y="2" width="10.5" height="8" fill={XP.flagRed} />
        <rect x="12.5" y="2" width="11" height="8" fill={XP.flagGreen} />
        <rect x="1" y="11" width="10.5" height="9" fill={XP.flagBlue} />
        <rect x="12.5" y="11" width="11" height="9" fill={XP.flagYellow} />
      </g>
    </svg>
  );
};

/** System tray volume speaker */
export const IconVolume = ({ size = 14 }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 16 16">
    <path d="M2 6H5L9 3V13L5 10H2Z" fill="#fff" />
    <path d="M11 5C12.5 6.5 12.5 9.5 11 11M12.5 3C15 5.5 15 10.5 12.5 13" stroke="#fff" strokeWidth="1" fill="none" strokeLinecap="round" />
  </svg>
);

/** Quick-launch "show desktop" */
export const IconShowDesktop = ({ size = 14 }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 16 16">
    <rect x="1" y="1" width="14" height="14" rx="1" fill="#d9b441" stroke="#9a7a20" strokeWidth="0.6" />
    <path d="M8 4L11 7H9V11H7V7H5Z" fill="#fff" transform="rotate(180 8 7.5)" />
    <rect x="3" y="11" width="10" height="1.5" fill="#fff" />
  </svg>
);

/** Start menu footer — log off (amber clock) */
export const IconLogOff = ({ size = 20 }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 20 20">
    <circle cx="10" cy="10" r="9" fill={XP.amber} stroke="#fff" strokeWidth="1" />
    <path d="M10 5V10L13 12" stroke="#fff" strokeWidth="1.5" fill="none" strokeLinecap="round" />
  </svg>
);

/** Start menu footer — turn off (red power) */
export const IconTurnOff = ({ size = 20 }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 20 20">
    <circle cx="10" cy="10" r="9" fill={XP.red} stroke="#fff" strokeWidth="1" />
    <path d="M10 4V10M6 6.5C4.5 8 4.5 12 7 13.5C9 14.7 11 14.7 13 13.5C15.5 12 15.5 8 14 6.5" stroke="#fff" strokeWidth="1.5" fill="none" strokeLinecap="round" />
  </svg>
);

export const IconMyComputer = ({ size = 32 }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 32 32" fill="none">
    <rect x="3" y="2" width="26" height="19" rx="2" fill="#ECE9D8" stroke="#808080" strokeWidth="1" />
    <rect x="5" y="4" width="22" height="15" rx="1" fill="#0046B8" />
    <rect x="12" y="22" width="8" height="4" rx="1" fill="#ECE9D8" stroke="#808080" strokeWidth="1" />
    <rect x="8" y="26" width="16" height="3" rx="1" fill="#ECE9D8" stroke="#808080" strokeWidth="1" />
  </svg>
);

export const IconFolder = ({ size = 32 }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 32 32" fill="none">
    <path d="M2 8C2 6.9 2.9 6 4 6H12L15 9H28C29.1 9 30 9.9 30 11V13H2V8Z" fill="#F4C542" stroke="#C8960C" strokeWidth="1" />
    <rect x="2" y="12" width="28" height="14" rx="1" fill="#FADB5F" stroke="#C8960C" strokeWidth="1" />
    <rect x="2" y="9" width="12" height="4" fill="#F4C542" />
  </svg>
);

export const IconDocument = ({ size = 32 }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 32 32" fill="none">
    <path d="M6 2H20L26 8V29C26 30.1 25.1 31 24 31H6C4.9 31 4 30.1 4 29V4C4 2.9 4.9 2 6 2Z" fill="#FFFFFF" stroke="#808080" strokeWidth="1" />
    <path d="M20 2V8H26" fill="#E0E0E0" stroke="#808080" strokeWidth="1" />
    <line x1="8" y1="14" x2="22" y2="14" stroke="#A0A0C0" strokeWidth="2" />
    <line x1="8" y1="18" x2="22" y2="18" stroke="#A0A0C0" strokeWidth="2" />
    <line x1="8" y1="22" x2="18" y2="22" stroke="#A0A0C0" strokeWidth="2" />
  </svg>
);

export const IconPDF = ({ size = 32 }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 32 32" fill="none">
    <path d="M6 2H20L26 8V29C26 30.1 25.1 31 24 31H6C4.9 31 4 30.1 4 29V4C4 2.9 4.9 2 6 2Z" fill="#FFFFFF" stroke="#808080" strokeWidth="1" />
    <path d="M20 2V8H26" fill="#FFE0E0" stroke="#808080" strokeWidth="1" />
    <rect x="8" y="13" width="16" height="7" rx="1" fill="#DC143C" />
    <text x="16" y="19" textAnchor="middle" fill="white" fontSize="7" fontWeight="bold" fontFamily="Arial">PDF</text>
  </svg>
);

export const IconTerminal = ({ size = 32 }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 32 32" fill="none">
    <rect x="2" y="2" width="28" height="24" rx="2" fill="#1E1E1E" stroke="#808080" strokeWidth="1" />
    <rect x="2" y="2" width="28" height="5" rx="2" fill="#0046B8" />
    <text x="6" y="6" fill="white" fontSize="4" fontFamily="monospace">C:\WINDOWS\system32\cmd.exe</text>
    <text x="5" y="14" fill="#6A9955" fontSize="5" fontFamily="monospace">&gt;</text>
    <text x="11" y="14" fill="#DCDCAA" fontSize="5" fontFamily="monospace">npm run start</text>
    <text x="5" y="20" fill="#6A9955" fontSize="5" fontFamily="monospace">&gt;</text>
    <text x="1" y="24" fill="#D4D4D4" fontSize="5" fontFamily="monospace">_</text>
  </svg>
);

export const IconSettings = ({ size = 32 }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 32 32" fill="none">
    <rect x="2" y="2" width="28" height="28" rx="2" fill="#ECE9D8" stroke="#808080" strokeWidth="1" />
    <rect x="2" y="2" width="28" height="6" fill="#0046B8" />
    <circle cx="16" cy="16" r="6" fill="#ECE9D8" stroke="#808080" strokeWidth="1" />
    <circle cx="16" cy="16" r="3" fill="#0046B8" />
  </svg>
);

export const IconInfo = ({ size = 32 }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 32 32" fill="none">
    <rect x="2" y="2" width="28" height="28" rx="2" fill="#ECE9D8" stroke="#808080" strokeWidth="1" />
    <rect x="2" y="2" width="28" height="6" fill="#0046B8" />
    <text x="16" y="18" textAnchor="middle" fill="#0046B8" fontSize="10" fontWeight="bold" fontFamily="Arial">i</text>
    <circle cx="16" cy="18" r="5" fill="none" stroke="#0046B8" strokeWidth="1" />
  </svg>
);

export const IconWinamp = ({ size = 32 }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 32 32" fill="none">
    {/* Bolt icon — classic Winamp lightning bolt */}
    <rect x="2" y="2" width="28" height="28" rx="3" fill="#1a1a2e" stroke="#5a5a7e" strokeWidth="1" />
    <polygon points="18,4 8,16 14,16 12,28 24,14 17,14 20,4" fill="#20ff60" stroke="#0a0" strokeWidth="0.5" />
  </svg>
);

export const IconRecycleBin = ({ size = 32 }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 32 32" fill="none">
    {/* recycle arrows on lid */}
    <ellipse cx="16" cy="8" rx="11" ry="3.5" fill="#C8CDD6" stroke="#808080" strokeWidth="1" />
    <path d="M6 8C6 8 7 26 7.5 28C7.8 29.3 9 30 10.5 30H21.5C23 30 24.2 29.3 24.5 28C25 26 26 8 26 8" fill="#DDE2EA" stroke="#808080" strokeWidth="1" />
    <path d="M13 12L11 18L9 16M19 12L21 18L23 16M11.5 18C11.5 18 14 19.5 16 19.5C18 19.5 20.5 18 20.5 18" stroke="#3c9a3e" strokeWidth="1.4" fill="none" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const IconUser = ({ size = 32 }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 32 32" fill="none">
    <rect x="1" y="1" width="30" height="30" rx="4" fill="#f3a23c" />
    <rect x="2" y="2" width="28" height="28" rx="3" fill="#fcd28a" />
    <circle cx="16" cy="12" r="6" fill="#ffe9c7" stroke="#c98a3c" strokeWidth="1" />
    <path d="M5 30C5 22 11 19 16 19C21 19 27 22 27 30Z" fill="#ffe9c7" stroke="#c98a3c" strokeWidth="1" />
  </svg>
);

/** Explorer toolbar glyphs (16px) */
export const IconNavBack = ({ size = 16 }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 16 16" fill="none">
    <circle cx="8" cy="8" r="7" fill="#3c9a3e" stroke="#2a7a2c" strokeWidth="1" />
    <path d="M9.5 4.5L6 8l3.5 3.5" stroke="#fff" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);
export const IconNavForward = ({ size = 16 }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 16 16" fill="none">
    <circle cx="8" cy="8" r="7" fill="#3c9a3e" stroke="#2a7a2c" strokeWidth="1" />
    <path d="M6.5 4.5L10 8l-3.5 3.5" stroke="#fff" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);
export const IconNavUp = ({ size = 16 }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 16 16" fill="none">
    <path d="M1 5C1 4.4 1.4 4 2 4h4l1.5 1.5H14c.6 0 1 .4 1 1V12c0 .6-.4 1-1 1H2c-.6 0-1-.4-1-1V5Z" fill="#F4C542" stroke="#C8960C" strokeWidth="0.8" />
    <path d="M8 5.5L10.5 8.5H9V11.5H7V8.5H5.5Z" fill="#2a5a1e" />
  </svg>
);
export const IconSearchGlass = ({ size = 16 }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 16 16" fill="none">
    <circle cx="6.5" cy="6.5" r="4" fill="#bfe0ff" stroke="#1a4cc7" strokeWidth="1.4" />
    <path d="M9.5 9.5L14 14" stroke="#1a4cc7" strokeWidth="2" strokeLinecap="round" />
  </svg>
);
export const IconFoldersPane = ({ size = 16 }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 16 16" fill="none">
    <rect x="1" y="2" width="14" height="12" rx="1" fill="#fff" stroke="#808080" strokeWidth="1" />
    <rect x="1" y="2" width="5" height="12" fill="#3168d5" />
    <path d="M8 5h5M8 8h5M8 11h3" stroke="#808080" strokeWidth="1" />
  </svg>
);

/** Explorer view-mode glyphs (16px) */
export const IconViewTiles = ({ size = 16 }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 16 16" fill="none">
    <rect x="1" y="2" width="4" height="4" fill="#3168d5" />
    <path d="M6 2.5h8M6 4.5h6" stroke="#808080" strokeWidth="1" />
    <rect x="1" y="9" width="4" height="4" fill="#3168d5" />
    <path d="M6 9.5h8M6 11.5h6" stroke="#808080" strokeWidth="1" />
  </svg>
);
export const IconViewIcons = ({ size = 16 }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 16 16" fill="none">
    <rect x="1" y="1" width="6" height="6" fill="#3168d5" />
    <rect x="9" y="1" width="6" height="6" fill="#3168d5" />
    <rect x="1" y="9" width="6" height="6" fill="#3168d5" />
    <rect x="9" y="9" width="6" height="6" fill="#3168d5" />
  </svg>
);
export const IconViewList = ({ size = 16 }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 16 16" fill="none">
    <rect x="1" y="2" width="2" height="2" fill="#3168d5" />
    <path d="M4 3h5" stroke="#808080" strokeWidth="1" />
    <rect x="1" y="7" width="2" height="2" fill="#3168d5" />
    <path d="M4 8h5" stroke="#808080" strokeWidth="1" />
    <rect x="1" y="12" width="2" height="2" fill="#3168d5" />
    <path d="M4 13h5" stroke="#808080" strokeWidth="1" />
  </svg>
);
export const IconViewDetails = ({ size = 16 }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 16 16" fill="none">
    <rect x="1" y="2" width="2" height="2" fill="#3168d5" />
    <path d="M4 3h4M10 3h5" stroke="#808080" strokeWidth="1" />
    <rect x="1" y="7" width="2" height="2" fill="#3168d5" />
    <path d="M4 8h4M10 8h5" stroke="#808080" strokeWidth="1" />
    <rect x="1" y="12" width="2" height="2" fill="#3168d5" />
    <path d="M4 13h4M10 13h5" stroke="#808080" strokeWidth="1" />
  </svg>
);

/** Explorer task-link glyphs (16px) */
export const IconTaskRename = ({ size = 16 }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 16 16" fill="none">
    <rect x="2" y="4" width="9" height="8" rx="1" fill="#fff" stroke="#808080" strokeWidth="1" />
    <path d="M11 8.5l3-3 1.5 1.5-3 3z" fill="#f4c542" stroke="#c8960c" strokeWidth="0.7" />
  </svg>
);
export const IconTaskMove = ({ size = 16 }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 16 16" fill="none">
    <path d="M1 5C1 4.4 1.4 4 2 4h4l1.5 1.5H14c.6 0 1 .4 1 1V12c0 .6-.4 1-1 1H2c-.6 0-1-.4-1-1V5Z" fill="#F4C542" stroke="#C8960C" strokeWidth="0.8" />
    <path d="M6 8.5h4M8.5 7l2 1.5-2 1.5" stroke="#2a5a1e" strokeWidth="1.2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);
export const IconTaskCopy = ({ size = 16 }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 16 16" fill="none">
    <rect x="2" y="2" width="8" height="9" rx="1" fill="#fff" stroke="#808080" strokeWidth="1" />
    <rect x="6" y="5" width="8" height="9" rx="1" fill="#fff" stroke="#808080" strokeWidth="1" />
  </svg>
);
export const IconTaskPublish = ({ size = 16 }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 16 16" fill="none">
    <circle cx="8" cy="8" r="6.5" fill="#bfe0ff" stroke="#1a4cc7" strokeWidth="1" />
    <path d="M1.5 8h13M8 1.5c2 2 2 11 0 13M8 1.5c-2 2-2 11 0 13" stroke="#1a4cc7" strokeWidth="0.8" fill="none" />
  </svg>
);
export const IconTaskShare = ({ size = 16 }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 16 16" fill="none">
    <path d="M2 6C2 5.4 2.4 5 3 5h3l1.5 1.5H14c.6 0 1 .4 1 1V13c0 .6-.4 1-1 1H3c-.6 0-1-.4-1-1V6Z" fill="#F4C542" stroke="#C8960C" strokeWidth="0.8" />
    <path d="M5 4.5c1.5-2 4.5-2.5 7-1.5" stroke="#3c9a3e" strokeWidth="1.2" fill="none" strokeLinecap="round" />
    <path d="M10 1.5l2.5 1L11 4z" fill="#3c9a3e" />
  </svg>
);
export const IconTaskEmail = ({ size = 16 }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 16 16" fill="none">
    <rect x="1" y="3" width="14" height="10" rx="1" fill="#fff" stroke="#808080" strokeWidth="1" />
    <path d="M1.5 3.5L8 9l6.5-5.5" stroke="#1a4cc7" strokeWidth="1.2" fill="none" />
  </svg>
);
export const IconTaskDelete = ({ size = 16 }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 16 16" fill="none">
    <ellipse cx="8" cy="4" rx="5" ry="1.6" fill="#C8CDD6" stroke="#808080" strokeWidth="0.8" />
    <path d="M3.5 4C3.5 4 4.2 13 4.5 14c.2.7 1 1 1.8 1h3.4c.8 0 1.6-.3 1.8-1 .3-1 1-10 1-10" fill="#DDE2EA" stroke="#808080" strokeWidth="0.8" />
    <path d="M6.5 6.5l3 5M9.5 6.5l-3 5" stroke="#cc3333" strokeWidth="1" strokeLinecap="round" />
  </svg>
);
export const IconTaskNewFolder = ({ size = 16 }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 16 16" fill="none">
    <path d="M1 5C1 4.4 1.4 4 2 4h4l1.5 1.5H14c.6 0 1 .4 1 1V12c0 .6-.4 1-1 1H2c-.6 0-1-.4-1-1V5Z" fill="#F4C542" stroke="#C8960C" strokeWidth="0.8" />
    <path d="M11.5 7.5v3M10 9h3" stroke="#2a5a1e" strokeWidth="1.2" strokeLinecap="round" />
  </svg>
);
export const IconTaskDetails = ({ size = 16 }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 16 16" fill="none">
    <circle cx="8" cy="8" r="6.5" fill="#3168d5" stroke="#1a4cc7" strokeWidth="1" />
    <rect x="7" y="6.5" width="2" height="5" fill="#fff" />
    <rect x="7" y="4" width="2" height="2" fill="#fff" />
  </svg>
);

/** Real-.ico desktop app icons (from public/icons) */
export const IconMyComputerIco = ({ size = 32 }: IconProps) => <IcoIcon name="My Computer" size={size} />;
export const IconFolderIco = ({ size = 32 }: IconProps) => <IcoIcon name="Folder Closed" size={size} />;
export const IconTxtIco = ({ size = 32 }: IconProps) => <IcoIcon name="List File" size={size} />;

/** Map app key -> icon component, used by Window title bars and taskbar buttons */
export const APP_ICONS: Record<string, (p: IconProps) => JSX.Element> = {
  about: IconTxtIco,
  projects: IconFolderIco,
  skills: IconTerminal,
  winamp: IconWinamp,
  computer: IconMyComputerIco,
  recycle: IconRecycleBin,
  settings: IconSettings,
  terminal: IconTerminal,
  document: IconDocument,
  folder: IconFolderIco,
};

export const AppIcon = ({ iconKey, size = 16 }: { iconKey: string; size?: number }) => {
  const Cmp = APP_ICONS[iconKey] ?? IconDocument;
  return <Cmp size={size} />;
};
