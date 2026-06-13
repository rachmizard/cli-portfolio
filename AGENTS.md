# AGENTS.md

Windows-XP-styled portfolio rendered as a fake desktop OS. React 19 + Vite + Tailwind v4. No router, no backend except one Vercel serverless function.

`CLAUDE.md` has the full architecture writeup (window manager, content injection, drag/resize internals). Read it for how the code is wired. This file covers the gotchas that bite agents.

## Commands (package manager is Bun)

```bash
bun install
bun dev          # vite dev server — does NOT run /api functions
bun run build    # production build
bun run preview
bun run lint      # eslint
```

## Verification reality (read before claiming "it works")

- **No typecheck command exists.** There is no `tsconfig.json` and no `tsc` step. Types come only from `@types/react`, so no command here catches type errors. `lsp_diagnostics` (editor LSP) is your only type-error signal — use it on every changed `.ts`/`.tsx`.
- **`.ts`/`.tsx` and `api/*.ts` are NOT linted.** `eslint.config.js` targets `**/*.{js,jsx}` only, so `bun run lint` covers the config/JS files alone — never the React source or the serverless function. A clean lint pass does not mean the app code was checked.
- **No test runner.** Don't claim tests pass; there are none. If a change needs verification, do it manually via `bun dev` in the browser.
- Net effect: the real safety net is `lsp_diagnostics` + `bun run build` + your own reading and browser checks.

## Spotify / serverless gotcha

- `api/recently-played.ts` is a **Vercel serverless function**, not part of the Vite app. `bun dev` never runs it, so the Winamp window always shows `FALLBACK_TRACKS` locally. To exercise the function locally use `npx vercel dev` with the env vars set. See `SPOTIFY_SETUP.md`.
- `vercel.json` rewrites everything to `/` (SPA) **except** `/api/*`.
- Spotify deprecated 30s `preview_url`s (Nov 2024). Tracks are metadata-only; `previewUrl` is empty and play/stop is disabled. Don't "fix" the empty preview URLs — that's intentional.
- The refresh token lives only in Vercel env vars / local `.env` (gitignored). Never commit it or move it into the frontend bundle.

## Conventions

- **Adding an "app":** write a `ReactNode` in `src/content.tsx`, add an entry to `DESKTOP_ICONS` in `src/components/Desktop.tsx`, and add an icon to `src/components/Icons.tsx`. Richer apps (FileExplorer, Winamp) are just content nodes mounted in the generic window frame.
- **Window state** lives only in `src/App.tsx` (`AppWindow[]` + `nextZ` counter). All lifecycle goes through its callbacks (`openWindow`, `focusWindow`, `toggleMinimize`/`Maximize`, `closeWindow`). Don't introduce separate window state.
- **Styling:** use the XP "Luna" design tokens and bevel utilities in `src/index.css` (`@theme` block: `--color-surface` etc., classes `raised-bevel`, `bevel-in`, `bevel-out`, `bevel-out-thin`). For hex needed in SVG/JS, use the `XP` constants in `src/theme.ts` (mirrors the CSS tokens). Avoid raw hex or ad-hoc shadows.
- Fonts: Tahoma/Segoe UI for chrome, Courier Prime mono for terminal content (loaded in `index.html`).

## Ignore

- `README.md` is the stock Vite template — stale, not project docs.
- `winamp-mockup.html` (repo root) is a standalone reference mockup, not part of the build.
