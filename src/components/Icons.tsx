/** Windows XP-style SVG icons — pixel art, size-configurable */

interface IconProps {
  size?: number;
}

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

/** Map app key -> icon component, used by Window title bars and taskbar buttons */
export const APP_ICONS: Record<string, (p: IconProps) => JSX.Element> = {
  about: IconDocument,
  projects: IconFolder,
  skills: IconTerminal,
  winamp: IconWinamp,
  computer: IconMyComputer,
  recycle: IconRecycleBin,
  terminal: IconTerminal,
  document: IconDocument,
  folder: IconFolder,
};

export const AppIcon = ({ iconKey, size = 16 }: { iconKey: string; size?: number }) => {
  const Cmp = APP_ICONS[iconKey] ?? IconDocument;
  return <Cmp size={size} />;
};
