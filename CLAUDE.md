# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

Package manager is **Bun** (see `bun.lock`).

```bash
bun install      # install deps
bun dev          # vite dev server (HMR)
bun run build    # production build
bun run preview  # serve built output
bun run lint     # eslint
```

No test runner is configured. No `tsconfig.json` exists — types come from `@types/react` only, so there is no `tsc` typecheck step. ESLint's flat config (`eslint.config.js`) targets `**/*.{js,jsx}` only, so `.tsx`/`.ts` source files are **not** linted; `bun run lint` effectively covers config files alone.

## Architecture

A Windows-XP-styled portfolio rendered as a fake desktop OS. React 19 + Vite + Tailwind v4. No router, no backend.

### Window manager (the core)

`App.tsx` is the single source of truth for window state. It holds an `AppWindow[]` array (see `types.ts`) plus a `nextZ` counter and drives all window lifecycle via callbacks passed down to children:

- `openWindow` — dedupes by `id`; reopening an existing window un-minimizes and refocuses instead of duplicating.
- `focusWindow` — bumps `zIndex` to `nextZ` (the z-ordering scheme is a monotonically increasing counter, not a reshuffled stack). Passing `""` defocuses all (used by desktop background click).
- `toggleMinimize` / `toggleMaximize` / `closeWindow`.

`Desktop` renders windows by filtering out minimized ones and sorting by `zIndex`. `Taskbar` and `StartMenu` are siblings that call the same `App`-level callbacks.

### Content injection

Window bodies are arbitrary `ReactNode`s defined in `content.tsx` (`WELCOME_CONTENT`, `PROJECTS_CONTENT`, `ABOUT_CONTENT`, `WINAMP_CONTENT`) and passed into the window state as `content`. `PROJECTS_CONTENT` is `<FileExplorer />` and `WINAMP_CONTENT` is `<Winamp />` — i.e. richer apps are just content nodes mounted inside a generic window frame.

The desktop icon list (`DESKTOP_ICONS` in `Desktop.tsx`) maps icon → content. Special cases live in the icon's `onDoubleClick`: **CV.doc** (`id:"cv"`) opens `src/components/WordWindow.tsx` — a read-only Microsoft Word 2003 viewer rendering `src/data/cv.ts`. Wired via `openWindow("cv", ..., { w:660, h:560 })` in Desktop.tsx `openIcon`, StartMenu.tsx, and FileExplorer.tsx. `initialRect` seeds a 660×560 portrait window. Document body uses `--font-doc` (Times New Roman). No `/cv.pdf` file exists. `winamp` mounts `WINAMP_CONTENT`. Adding a new "app" generally means: write content in `content.tsx`, add an entry to `DESKTOP_ICONS`, add an icon to `Icons.tsx`.

### Window.tsx — drag/resize internals

Self-contained drag + 8-direction resize using global `mousemove`/`touchmove` listeners (touch support for mobile). Key detail: it uses `rectRef` (a ref mirror of `rect` state) inside listeners to avoid stale closures, and `rectSnapshot` to capture geometry at interaction start. `MIN_W`/`MIN_H` clamp resize. Initial position is randomized on mount and clamped on mobile (`window.innerWidth < 768`). Maximized windows ignore drag/resize and fill `calc(100% - 28px)` (leaving room for the taskbar).

### Winamp.tsx

Self-contained audio player using a `useRef<HTMLAudioElement>`. `DEMO_TRACKS` carries Spotify `previewUrl`s (30s clips). Exports both the component and `DEMO_TRACKS`.

## Styling

The Windows XP "Luna" look is a hand-rolled design system in `src/index.css` using Tailwind v4's `@theme` block — semantic color tokens (`--color-surface`, `--color-primary`, etc.) and bevel utility classes (`raised-bevel`, `bevel-in`, `bevel-out`, `bevel-out-thin`) that produce the 3D chrome. Use these tokens/classes rather than raw hex or new ad-hoc shadows to stay consistent with the XP aesthetic. Fonts: Tahoma/Segoe UI for chrome, Courier Prime mono for terminal content (loaded in `index.html`).

`winamp-mockup.html` at repo root is a standalone static mockup reference, not part of the build.
