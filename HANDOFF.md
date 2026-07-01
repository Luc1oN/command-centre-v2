# Command Centre — Handoff / Context

Paste this into a fresh chat (or read it) to continue building seamlessly.

## What it is
A dark glassmorphic productivity **HUD** that is Shane's personal **Command Centre** —
runs fullscreen on a monitor, but also used on laptop, iPad, and phone.
Supabase-synced across devices.

## Where it lives
- **Project:** `/Users/shaneconnolly/Documents/Dev & Tools/Command Centre/command-centre-v2`
- **GitHub:** `Luc1oN/command-centre-v2`
- **Live:** https://luc1on.github.io/command-centre-v2/
- **Stack:** Vite + React + TypeScript + Tailwind v4 + zustand + @dnd-kit + lucide-react

## Toolchain quirks (important)
- No system node/npm/gh. Use portable node first:
  `export PATH="$HOME/.cashflow-deploy-tools/node-v20.20.2-darwin-arm64/bin:$PATH"`
- Deploy = commit + `git push` (osxkeychain auth, no gh login). GitHub Actions
  (`.github/workflows/deploy.yml`) auto-builds and publishes on push to `main`.
  Confirm via the public API + curl the live URL.
- Shane is **non-technical** — handle the mechanics, explain plainly, deploy after each change.
- Verify in the preview (Claude_Preview MCP; `.claude/launch.json` runs it on port 5174).
  **Do NOT perform writes (drag/add/edit/delete) against real Supabase data while testing** —
  verify render read-only, or use an isolated test project you delete afterward.
- Vite `base` is `/` in dev, `/command-centre-v2/` for the production build.

## Architecture
- `src/store.ts` (`useHud`) = device-local ephemeral state: momentum, pomodoro, theme,
  light/dark `mode`, bookmarks, city, `view` nav (dashboard/projects/braindump),
  `openCardId`, `activeProjectId`, `triageOpen`. localStorage keys `cc_*`.
- `src/store/useAppStore.ts` + `src/lib/supabase.ts` + `src/types/index.ts` = Supabase
  data layer (real tasks, buckets, projects, notes). App calls `init()` on mount.
  **Remote is authoritative on load** (see `loadInitial`) so cleanups can't be
  clobbered by a stale cache.
- `src/board/BoardContext.tsx` (`BoardApi` / `BoardProvider` / `useBoard` / `newTask`):
  one `Kanban` + `CardModal` serve BOTH the dashboard (`DashboardBoard` → top-level
  tasks) and project boards (`ProjectBoard` → a project's nested tasks via `updateProject`).
- `Workspace.tsx` switches Board / Projects / Brain Dump.
- Buckets: **Triage · Today · Tomorrow · Blocked · Done**. `CaptureBar` sends new
  tasks to Triage (inbox); `TriageFlow` blitz-sorts Triage into the other lists.
- **Responsive:** `<1024` mobile task-only view (`MobileBoard`, defaults to Triage tab);
  `1024–1280` sidebar + board; `≥1280` full HUD. Body scrolls below `lg`, fixed at `lg+`.

## Done so far
HUD build → Supabase reconnect → Projects + Brain Dump → card editor → per-list clear →
duplicate cleanup (140→32) + Triage bucket + remote-authoritative sync → responsive +
mobile task view → capture-to-Triage inbox + keyboard triage flow → mobile defaults to Triage.

## Possible next steps
- "Cleared today" streak / count to reward triaging
- Wire real weather/momentum deeper (currently momentum is local; weather is live)
- Project-board polish (mobile drag, project templates)
- Anything that feels off in daily use

## First step in a new session
Read the current `src/` to confirm state, then ask what to build next.
