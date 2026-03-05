# Durability Coaching Dashboard — Claude Code Guide

## Project Overview
React + Vite coaching dashboard for the Durability iOS app. Coaches use this to view athlete movement assessments, build workout programs, manage sessions, and analyze team trends.

## Stack
- React 18 (no TypeScript)
- Vite
- Recharts (charts)
- Supabase (backend — `atvnjpwmydhqbxjgczti`)
- Inline styles throughout (no Tailwind, no CSS modules)
- No React Router in the dashboard (self-contained nav)

## File Structure
```
src/
├── DurabilityDashboard.jsx   ← MAIN FILE. All dashboard logic lives here (~2,200 lines)
├── App.jsx                   ← Just mounts DurabilityDashboard, nothing else
├── main.jsx                  ← Entry point, unchanged
├── index.css                 ← Legacy styles, mostly unused now
├── components/Layout.jsx     ← Legacy, not used
├── pages/                    ← Legacy pages, not used
├── data/mockData.js          ← Legacy mock data, not used
└── lib/supabase.js           ← Supabase client stub
```

## Architecture: DurabilityDashboard.jsx
Single-file component. Structure from top to bottom:

1. **Imports** — React hooks + recharts
2. **Real athlete data** — hardcoded from Supabase query results (lines ~4–90)
3. **Color constants** (`C` object) — single source of truth for all colors
4. **Helper functions** — `sc()` score color, `fmt()` date formatter
5. **Data constants** — `TEAMS_DATA`, `BLOCK_LIBRARY`, `TEAM_INSIGHTS`, `MOVEMENT_LIBRARY`, `SESSIONS_DATA`, `ANALYTICS_DATA`, `BLOCK_MOVEMENTS_DETAIL`
6. **Components** (in render order):
   - `VideoCard` — autoplay movement video with gradient fallback
   - `AngleRow`, `MovementCard`, `AssessmentDetail` — assessment breakdown
   - `AssessmentsTab`, `OverviewTab`, `ProgressTab` — athlete detail tabs
   - `AthleteDetail`, `AthleteList` — athlete views
   - `ProgramsTab` — Programs nav shell
   - `TeamsView` — roster + Build/Send buttons
   - `BuilderView` — standalone workout builder (within Programs tab)
   - `BuilderModal` — modal builder opened from Teams view Build button
   - `SendModal` — send AI program or saved workout to athlete
   - `WorkoutLibraryView` — saved workouts (filtered by team/individual)
   - `LibraryView` — movement library with video cards
   - `UploadsView` — text/photo/Excel upload parser
   - `AnalyticsTab` — team score trends, body region charts, injury heatmap
   - `ProgressTab` — per-athlete score trend, region vs team avg, injury history
   - `SessionsTab` — session list with block/movement drill-down, schedule form
   - `TVDisplay` — full-screen cast mode with workout table
   - `App` (default export) — sidebar nav shell, routes between top-level views
7. **No React Router** — navigation is pure state (`nav` useState in App)

## Design System
All colors via the `C` object at the top of DurabilityDashboard.jsx:
```js
const C = {
  bg: "#f8f8f6",       // page background
  surface: "#ffffff",  // card background
  border: "#e4e4e7",   // borders
  ink: "#18181b",      // primary text
  sub: "#52525b",      // secondary text
  muted: "#a1a1aa",    // muted text
  lime: "#c8e64e",     // primary accent
  limeXl: "#f4fad7",   // lime tint background
  limeDim: "#b5d43b",  // lime border/hover
  radius: 12,
  radiusSm: 8,
};
```
**Never use hardcoded hex colors in JSX. Always use `C.*`.**

## Supabase Schema (key tables)
- `user_profiles` — 10 real athletes (id, first_name, last_name, injuries)
- `assessment_results` — body region + super metric scores per assessment
- `assessment_exercise_reps` — per-rep scores (0–1 scale)
- `assessment_exercise_data` — JSONB angle arrays
- `programs` → `program_weeks` → `program_workouts` → `program_workout_blocks`
- `movement_blocks` → `movement_block_items` → `movements`
- `coaches`, `teams`, `team_members` — coach/team structure
- `user_programs` — assigned programs (assigned_by, team_id, source, coach_notes)
- `uploaded_workouts` — coach-uploaded workout files
- RLS policies applied — use service role for seeding, anon key for reads

## Real Athlete Data (embedded in file)
10 athletes with real Supabase data. Gabby Rizika has 265 assessments and is the primary test case. Do not modify the hardcoded athlete data arrays unless explicitly asked — they come from real Supabase queries.

## Injuries (important for program logic)
- 6/10 athletes have lower body injuries
- 3 ACL tears: Gabby Rizika, Steph Xu, Maria Guerrero R
- 3 lower back: Gabby, Hannah Steadman, Drew Adams
- Shoulder: Gabby, Annabelle Hutchinson

## State Architecture
Key state in `App` (root):
- `savedWorkouts` / `setSavedWorkouts` — passed down to ProgramsTab → TeamsView + BuilderView + WorkoutLibraryView

Key state in `TeamsView`:
- `buildTarget` — opens BuilderModal for a specific athlete
- `sendTarget` — opens SendModal for a specific athlete

Key state in `SessionsTab`:
- `sessions` — local copy of SESSIONS_DATA (supports adding new sessions)
- `openSession` / `openBlock` — expand/collapse drill-down

## Common Patterns
```jsx
// Score color helper
const col = sc(score); // returns hex color string

// Surface card
<div style={{ background: C.surface, borderRadius: C.radius, border: `1px solid ${C.border}`, padding: "20px 22px" }}>

// Muted section label
<div style={{ fontSize: 10, fontWeight: 700, color: C.muted, textTransform: "uppercase", letterSpacing: ".06em", marginBottom: 8 }}>

// Lime action button
<button style={{ background: C.lime, color: C.ink, border: "none", borderRadius: 9, padding: "9px 18px", cursor: "pointer", fontFamily: "inherit", fontWeight: 700 }}>
```

## Icons
**No emoji. No icon libraries.** All icons are inline SVGs:
```jsx
// Chevron down
<svg width={12} height={12} viewBox="0 0 24 24" fill="none" stroke={C.muted} strokeWidth={2.5}><polyline points="6 9 12 15 18 9"/></svg>

// Warning triangle
<svg width={12} height={12} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
```

## Swift / iOS Notes (separate codebase — for context only)
- ASENSEI SDK callbacks run on background threads
- Never use `@MainActor` on SDK-called classes (`TestConfig`, `Logger`, `ScoringEngine`)
- Use `nonisolated(unsafe)` instead
- Only capture `positiveOnSeen` + `congratulate` and `negativeOnSeen` + `intervene` trait/action combos

## Dev Commands
```bash
npm run dev      # start local dev server
npm run build    # production build
npm run preview  # preview production build
```

## When Making Changes
1. Always edit `src/DurabilityDashboard.jsx` — this is the only file that matters for dashboard changes
2. Keep all new components in the same file
3. Add new data constants near the top with existing constants
4. Run `npm run build` to verify no errors before committing
5. Commit message format: `feat: [short description of what changed]`

## What NOT to do
- Do not split DurabilityDashboard.jsx into multiple files (project is in active iteration)
- Do not add Tailwind or CSS modules
- Do not use emoji in the UI
- Do not add React Router
- Do not modify `src/main.jsx` or `src/index.css`
- Do not regenerate or modify the hardcoded athlete data arrays
