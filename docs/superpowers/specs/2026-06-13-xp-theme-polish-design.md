# Windows XP Theme Polish — Design

Date: 2026-06-13
Status: Approved (phased, one at a time)

## Goal

Close the small authenticity gaps that break the Windows XP "Luna" illusion in the portfolio. The design system foundation (gradients, bevels, title bars, boot/shutdown) is already strong; this is a polish pass, not a rebuild.

## Constraints

- No window-manager rewrite. Window lifecycle stays in `src/App.tsx` (`AppWindow[]` + `nextZ`); changes go through existing callbacks.
- Match existing Luna tokens in `src/index.css` (`@theme` block) and bevel utilities. No raw ad-hoc hex where a token exists.
- No typecheck/test tooling exists; verify via `lsp_diagnostics` + `bun run build` + manual browser check (`bun dev`).
- Placeholder sounds only (authentic XP `.wav`s are Microsoft-copyrighted). Wiring targets stable filenames so assets can be swapped later.
- Phases ship one at a time with browser review between each.

## Already done (verified, do NOT rebuild)

- Desktop right-click context menu exists (`Desktop.tsx` ~L213) with Arrange/Refresh/Paste/New/Properties; Properties already wired to Display Properties.
- `IcoIcon` renders real `.ico` files from `public/icons`.
- `playSound(src)` helper exists in `src/lib/sound.ts` but is wired to nothing.
- Winamp has its own dark scrollbar (`.wa-scrollbar`).

## Phase 1 — Global XP scrollbars (CSS only)

Add beveled XP scrollbars globally via `::-webkit-scrollbar` in `src/index.css`: gray track (`--color-surface-dim`/`--color-surface-container-highest`), raised-bevel thumb using the existing bevel border colors (`#fff`/`#808080`), ~16px wide. Scope so Winamp's `.wa-scrollbar` override still wins (it already sets its own `::-webkit-scrollbar*`). Firefox fallback via `scrollbar-color`/`scrollbar-width` is acceptable but secondary.

Risk: none (pure CSS). Verify: scroll a long window (About/Projects) in browser; confirm Winamp unchanged.

## Phase 2 — Window open/close/minimize animation

- Open: 120ms scale(0.96→1) + fade on `.window` mount via `@keyframes`.
- Minimize: add an `is-minimizing` class that animates scale-down/fade toward the taskbar, with a short timeout before the state flip in `App.tsx`/`Desktop.tsx` so the exit frame renders. Restore reverses.
- Keep it CSS-driven; no animation library. Respect `prefers-reduced-motion` (disable transforms).

Risk: medium — windows currently unmount instantly (`Desktop.tsx` filters minimized/closed). Keep exit handling minimal; do not restructure the window list.

## Phase 3 — Tooltips + title-bar button SVGs

- Reusable pale-yellow XP tooltip (`.xp-tooltip`, ~`#ffffe1` bg, 1px `#000` border, 11px Tahoma) shown on hover for: taskbar clock (→ full date), tray volume, title-bar min/max/restore/close.
- Replace text glyphs `_ □ ❐ ✕` in `Window.tsx` (~L178-180) with crisp inline SVG glyphs; the restore icon = overlapping squares. Keep existing `.title-bar-buttons` gradients/aria-labels.

Risk: low.

## Phase 4 — Sound effects (placeholder assets)

- Place placeholder/CC sounds in `public/sounds/` with stable names: `startup.wav`, `open.wav`, `close.wav`, `minimize.wav`, `maximize.wav`, `error.wav`, `menu.wav` (or `.mp3`).
- Wire `playSound()` to: boot chime (first user interaction, since browsers block autoplay), window open/close, minimize/maximize, error ding, menu navigation.
- Add a mute toggle in the system tray (persisted, e.g. localStorage); default state chosen to avoid surprise audio on load. Guard all playback behind the mute flag.

Risk: low–medium (autoplay policy). Verify: toggle mute, trigger each event, confirm no console errors when assets missing (`playSound` already swallows play errors).

## Verification (every phase)

`lsp_diagnostics` clean on changed `.ts/.tsx` → `bun run build` exit 0 → manual browser check of the specific behavior → confirm no regression to Winamp/boot/shutdown.
