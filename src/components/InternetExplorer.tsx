import { IconNavBack, IconNavForward, IconIE, IconMyDocsIco } from "./Icons";
import { useWindowManager } from "../windowContext";
import { playClick } from "../lib/sound";
import { PROJECTS_CONTENT } from "../content";

const MENUS = ["File", "Edit", "View", "Favorites", "Tools", "Help"];

const IconStop = ({ size = 18 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 16 16">
    <circle cx="8" cy="8" r="7" fill="#d63a2f" stroke="#8c1509" strokeWidth="1" />
    <path d="M5 5l6 6M11 5l-6 6" stroke="#fff" strokeWidth="1.6" strokeLinecap="round" />
  </svg>
);
const IconRefresh = ({ size = 18 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 16 16">
    <circle cx="8" cy="8" r="7" fill="#ece9d8" stroke="#808080" strokeWidth="1" />
    <path d="M11 5.5A4 4 0 1 0 12 8" stroke="#2a7a2c" strokeWidth="1.5" fill="none" strokeLinecap="round" />
    <path d="M11.5 3v3h-3" stroke="#2a7a2c" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);
const IconHome = ({ size = 18 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 16 16">
    <path d="M2 8l6-5.5L14 8" stroke="#6e4600" strokeWidth="1.5" fill="none" strokeLinecap="round" />
    <path d="M4 8v6h8V8" fill="#f4c542" stroke="#c8960c" strokeWidth="1" />
    <rect x="7" y="10" width="2.5" height="4" fill="#8e5c00" />
  </svg>
);
const IconGo = ({ size = 14 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 16 16">
    <circle cx="8" cy="8" r="7" fill="#3c9a3e" stroke="#2a7a2c" strokeWidth="1" />
    <path d="M5 8h5M8 5.5L10.5 8 8 10.5" stroke="#fff" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

interface WebLink {
  label: string;
  desc: string;
  href?: string;
  internal?: boolean;
}

const LINKS: WebLink[] = [
  { label: "My Projects", desc: "The good stuff. Opens the Projects folder on this very computer.", internal: true },
  { label: "LinkedIn — Rachmizard Z.", desc: "Professional profile, endorsements, corporate smiling.", href: "https://www.linkedin.com/in/rachmizard" },
  { label: "E-mail me", desc: "rachmizard11072000@gmail.com — replies faster than dial-up.", href: "mailto:rachmizard11072000@gmail.com" },
  { label: "Old portfolio (archive)", desc: "My previous website. Preserved for historical purposes.", href: "https://rachmizard-portofolio-website.vercel.app" },
];

/** Internet Explorer 6 — retro homepage with real outbound links. */
function InternetExplorer() {
  const { openWindow } = useWindowManager();

  const open = (link: WebLink) => {
    playClick();
    if (link.internal) {
      openWindow("projects", "Projects - File Explorer", "projects", PROJECTS_CONTENT);
    } else if (link.href) {
      window.open(link.href, "_blank", "noopener,noreferrer");
    }
  };

  return (
    <div className="h-full flex flex-col bg-white font-body text-[11px]">
      <div className="xp-menubar select-none shrink-0">
        {MENUS.map((m) => (
          <button key={m} className="xp-menu-item">{m}</button>
        ))}
      </div>

      {/* Toolbar */}
      <div className="flex items-center gap-0.5 px-1 py-0.5 bg-surface border-b border-outline-variant shrink-0">
        <button className="xp-tb-btn" disabled><IconNavBack size={18} /><span>Back</span></button>
        <button className="xp-tb-btn" disabled><IconNavForward size={18} /></button>
        <button className="xp-tb-btn"><IconStop size={16} /></button>
        <button className="xp-tb-btn" onClick={() => playClick()}><IconRefresh size={16} /></button>
        <button className="xp-tb-btn" onClick={() => playClick()}><IconHome size={16} /></button>
      </div>

      {/* Address bar */}
      <div className="flex items-center gap-1.5 px-1.5 py-1 bg-surface border-b border-outline-variant shrink-0">
        <span className="text-outline">Address</span>
        <div className="xp-addressbar flex-1 flex items-center gap-1.5">
          <IconIE size={14} />
          <span className="truncate">http://www.rachmizard.dev/welcome.htm</span>
        </div>
        <button className="xp-tb-btn !px-1.5"><IconGo size={14} /><span>Go</span></button>
      </div>

      {/* The page */}
      <div className="flex-1 overflow-y-auto ie-page">
        <div className="ie-banner">
          <div className="ie-banner-title">Rachmizard's Homepage</div>
          <div className="ie-banner-sub">est. 2003 · full-stack javascript developer · bandung, indonesia</div>
        </div>

        <div className="ie-marquee-strip">
          <span className="ie-marquee-text">
            ★ Welcome, visitor! ★ This site is best viewed at 800×600 in Internet Explorer 6 ★ Now hiring me ★
          </span>
        </div>

        <div className="max-w-[560px] mx-auto px-5 py-5 space-y-4">
          <p className="text-[12px] leading-relaxed">
            Hello and <b>welcome</b> to my corner of the World Wide Web. I build web
            applications for a living — React on the front, Go and Node.js in the
            back, 7+ years deep. Please enjoy your stay and remember to bookmark
            this page (Ctrl+D).
          </p>

          <table className="ie-links-table w-full">
            <tbody>
              {LINKS.map((l) => (
                <tr key={l.label}>
                  <td className="w-8 align-top pt-2">
                    {l.internal ? <IconMyDocsIco size={20} /> : <IconIE size={20} />}
                  </td>
                  <td>
                    <button className="ie-link" onClick={() => open(l)}>{l.label}</button>
                    <div className="text-outline">{l.desc}</div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="text-center space-y-1 pt-2 pb-4">
            <div className="ie-counter">You are visitor № <b>000137</b></div>
            <div className="text-outline text-[10px]">© 2003–2026 Rachmizard. Made with Notepad. No frames were used.</div>
          </div>
        </div>
      </div>

      {/* Status bar */}
      <div className="flex items-center gap-2 px-2 py-0.5 bg-surface border-t border-outline-variant text-on-surface shrink-0">
        <span>Done</span>
        <span className="ml-auto flex items-center gap-1 text-outline">
          <IconIE size={12} /> Internet
        </span>
      </div>
    </div>
  );
}

export default InternetExplorer;
