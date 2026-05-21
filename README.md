# Melvin Operations OS

**Local-first operations command center for real-world businesses.**

Melvin consolidates dispatch, repairs, weather, briefings, and SOPs into one clean platform — starting with SRM Concrete / North Alabama.

Built by Shane Brazelton + Claude Anthropic.

---

## What Is Melvin?

Melvin is a modular operations OS for field-operations businesses. It replaces a scattered ecosystem of single-purpose tools with one extensible local-first app.

**Current tenant:** SRM Concrete — North Alabama dispatch  
**Architecture:** Vite + React, browser localStorage, no backend required

---

## Source Repos Consolidated

This repo replaces / consolidates:

| Old Repo | What It Contributed |
|----------|-------------------|
| srm-dispatch | Core dispatch logic, crew data, rotation engine |
| pedal-to-the-metal | Fairness engine, SaaS product model |
| MASTER-Scheduler-Dashboard-SRM | Scheduler/dashboard/PWA patterns |
| SB-Management-OS | SOPs, operating standards |
| shanebrain-briefing | Morning briefing structure |
| order-calendar | Calendar/rotation patterns |
| 2.0RepairTrucks | Repair tracking model |
| weather-log | Weather + dispatch risk pattern |

---

## MVP Features

### Dispatch Board
- Full route engine for all 16 drivers
- CHRIS P / Tim fixed DUMP routes
- Stacey / Alexis fixed BP routes
- BP group rotation (A/B/C) with 7-day calendar
- 514 chain rule (514 → 516 → 519)
- Tue/Fri (TF) crew overrides for C519 and C507
- Down plant substitution with automatic resolution
- Start time stepper (+/-15min / RST per driver)
- Click-to-copy route text
- Audible view (all routes as plain text)
- Crew filter tabs (ALL / 519 / 507 / 506 / BRIDGEPORT / DUMP)

### Morning Briefing
- Auto-generated daily briefing text
- Shows crew summary, BP rotation, TF status, contacts
- Copy to clipboard with one click
- Date picker

### Fleet Repairs
- Repair ticket list with status / priority color coding
- Filter by status (open / in-progress / resolved / deferred)
- Stats: open count, in-progress, critical
- Seed data — 5 realistic repair records

### Weather
- 5-day forecast for Hazel Green, AL area
- Dispatch risk scoring (low / medium / high) with notes
- Seed data — Phase 2 will connect live weather API

### Management / SOPs
- Mission, values, and mantra
- 5 SOPs with expandable step-by-step detail
- Filter by category (Safety / Dispatch / Operations / Maintenance)

### System Health
- App version, network status, storage mode
- Service connectivity status for all future integrations
- Local-first architecture explanation

---

## Local-First Design

Melvin runs entirely in the browser. No backend required for MVP.

- State lives in browser localStorage (`melvin_os_*` keys)
- Works offline after first load
- Phase 2 adds FastAPI backend for persistence
- Phase 3 adds MCP server and Weaviate memory

See `docs/local-first-roadmap.md` for the full plan.

---

## SRM North Alabama Tenant

Tenant data lives in `src/tenants/srm-north-alabama/`:

| File | Contents |
|------|---------|
| drivers.js | All 16 drivers, crew assignments, BP groups, rota arrays |
| plants.js | 18 plant codes with names and substitution chains |
| rotations.js | Epoch/cycle config for BP and rota calculations |
| contacts.js | Shane and Anthony contact numbers |
| rules.js | Business rules: 514 chain, end-of-shift buffer, 518 protocol |

---

## How to Run

```bash
npm install
npm run dev
```

Open http://localhost:5173

```bash
npm run build     # production build to dist/
npm run preview   # preview production build
```

---

## Architecture Overview

```
src/
  main.jsx              # React root
  App.jsx               # Renders MelvinShell
  app/
    MelvinShell.jsx     # Sidebar nav + module routing
    navigation.js       # Nav items config
  components/           # Shared UI: Badge, Pill, StatCard, SectionHeader
  modules/
    dispatch/           # Full dispatch engine + UI
      engine/           # buildRoute, rotation, substitutions, fairness, travelTimes
      hooks/            # useDispatchState, useUrlState, useOnlineStatus
      components/       # DispatchBoard, DriverCard, RouteSteps, AudiblePanel, BPCalendar, ...
    briefing/           # Morning briefing generator + panel
    repairs/            # Repair tracker model + panel
    weather/            # Weather model + panel
    management/         # SOPs + management panel
    health/             # System health panel
  tenants/
    srm-north-alabama/  # All tenant-specific data
  styles/               # theme.js (warm earth tones) + global.css
  utils/                # clipboard, date, storage helpers
docs/
  source-review/        # What was reviewed from source repos + what was skipped
  memory-model.md       # Future Weaviate collections
  local-first-roadmap.md # Phase 1-4 plan
```

---

## What Is Scaffolded (Not Yet Wired)

- `useUrlState.js` — written, not connected to MelvinShell URL sync
- `fairness.js` — written, not yet displayed in UI (Phase 2)
- localStorage persistence — helpers written, not yet wired to dispatch state
- Weather API — seed data only, VITE_WEATHER_API_KEY placeholder in .env.example
- MCP API — placeholder, Phase 3

---

## What Was Skipped for Security

`docs/source-review/shanebrain-core-findings.md` documents:
- Which source files were intentionally not read (credentials, vault, SSH, private IPs)
- Which patterns were safely extracted
- What to import in Phase 3

---

## Next Best Tasks

1. Wire `useUrlState` into `MelvinShell` so dispatch state persists in URL
2. Add localStorage save/load to `useDispatchState` for repair records
3. Down-plant UI: add a plant selector in DispatchHeader for toggling plants DOWN
4. Add PWA manifest + service worker for offline support
5. Phase 2: `melvin-api` FastAPI backend scaffold
6. Phase 3: `melvin-mcp` server connecting to ShaneBrain Weaviate

---

Built with [Claude Code](https://claude.ai/code) · [Try Claude](https://claude.ai/referral/4fAMYN9Ing)