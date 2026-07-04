# XP Authenticity Pass — Design

Goal: close the gap between the current Win95/98-ish chrome and real Windows XP Luna, and make signature XP moments present. No new tech; React + Tailwind v4 tokens in `src/index.css` stay the system of record.

## Scope 1 — Luna window chrome

- **Blue Luna frame**: window container becomes the blue frame (nested inset box-shadows produce the 3px gradient edge, xp.css technique), content area sits inside with 3px padding. Active frame `#0831d9`/`#1667f0` blues; inactive pale `#7f9ee1` family. Maximized: no padding, no radius.
- **Title bar**: authentic gradient (bright `#0997ff` top edge → `#0053ee` → `#0066ff` → `#094ab2` bottom), `Trebuchet MS` bold 13px, text-shadow `1px 1px #0f1089`.
- **Title buttons**: 21×21 glass — radial highlight top-left, 1px white border, rounded 3px. Min/max blue glass, close red glass. Inactive = desaturated.
- **Cascade placement**: new windows cascade (+24px steps) instead of random position.

## Scope 2 — Taskbar + Start menu

- Taskbar 30px tall (desktop). Clock drops leading zero ("3:45 PM").
- **Quick Launch**: drag-handle dots, IE icon (opens Internet Explorer window), Show Desktop. 
- **Tray**: network icon, Smadav shield icon, volume, clock — each with tooltip.
- **Balloon notification**: yellow XP balloon anchored to tray, appears ~15s after load: "Your portfolio might be at risk" → click opens Projects. Closable, auto-hides.
- **Start menu**: left column gets pinned "Internet / Internet Explorer" + "E-mail / Outlook Express" rows with gray sub-labels, separator, recent programs, All Programs ▶ **flyout submenu** (all apps). Right column: My Documents, My Pictures, My Music, My Computer, sep, Control Panel (→ Display Properties), sep, Help and Support, Search, **Run…**.
- **Run dialog**: type `winamp`, `minesweeper`, `notepad`, `cmd`, `iexplore`, `winword` → launches app; unknown → XP error dialog.

## Scope 3 — App authenticity + sounds + desktop

- **Notepad** (About Me.txt): white page, File/Edit/Format/View/Help menu bar, `Lucida Console` plain text. No bevel boxes.
- **My Computer**: explorer-style chrome (toolbar, address bar, blue task pane, tile grid: C:, A:, D:, Shared Documents) reusing existing `xp-*` css classes.
- **Recycle Bin**: same chrome, empty list, "Empty the Recycle Bin" task (error dialog when clicked — it's already empty).
- **XP Error dialog**: reusable component — Luna mini-window, red X icon, message, OK. Plays synthesized ding.
- **Sounds**: WebAudio synth in `lib/sound.ts` — error ding, navigate click (explorer/IE navigation). No copyrighted assets.
- **Marquee selection**: drag on empty desktop draws translucent blue rubber-band; icons inside become selected (multi-select).
- **Internet Explorer**: lightweight IE6 window — toolbar, address bar, retro homepage with GitHub/LinkedIn/Email links.

## Non-goals (follow-ups)

Screensaver, clickable login user tile, minimize-fly-to-taskbar animation, All Programs nested submenus, functional Notepad menus.

## Files

`index.css` (frame/buttons/balloon/marquee/start/notepad styles), `Window.tsx`, `Taskbar.tsx`, `StartMenu.tsx`, `Desktop.tsx`, `Icons.tsx` (+~10 icons), `content.tsx`, new: `Notepad.tsx`, `MyComputer.tsx`, `RecycleBin.tsx`, `InternetExplorer.tsx`, `RunDialog.tsx`, `ErrorDialog.tsx`, `lib/sound.ts` additions.

Verification: `bun run build` clean; manual smoke via dev server.
