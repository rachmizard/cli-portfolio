const MENUS = ["File", "Edit", "Format", "View", "Help"];

const TXT = `==============================================
 ABOUT ME
==============================================

Name      : Rachmizard
Role      : Full-Stack JavaScript Developer
Location  : Bandung, Indonesia
Experience: 7+ years

A hard working and persistent web developer.
Front-end with React, Next.js and TanStack
Start on TypeScript. Mobile with React Native
and Flutter. Back-end with Go and Node.js /
Express web service APIs.

Currently: turning this desktop into my
portfolio. You are reading a .txt file inside
a fake Windows XP. Life is good.

Contact
-------
  rachmizard11072000@gmail.com
  linkedin.com/in/rachmizard

==============================================
 Tip: double-click CV.doc on the desktop for
 the full resume.
==============================================`;

/** Read-only Windows XP Notepad. */
function Notepad() {
  return (
    <div className="h-full flex flex-col bg-white">
      <div className="xp-menubar select-none shrink-0">
        {MENUS.map((m) => (
          <button key={m} className="xp-menu-item">{m}</button>
        ))}
      </div>
      <div className="flex-1 overflow-auto">
        <pre className="notepad-text">{TXT}</pre>
      </div>
    </div>
  );
}

export default Notepad;
