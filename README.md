# Melvin Operations OS

**Concrete Mixer Dispatch + Customer Service Command Center.**

A local-first, in-house command center for a concrete dispatch office. Melvin
consolidates dispatch, customer service, repairs, weather, briefings, and SOPs
into one clean, extensible platform — starting with SRM Concrete / North Alabama.

Internal motto: **Pedal to the Medal** — keep moving, stay professional,
document everything, and turn the role into operational advantage.

---

## Why the Product Shifted

The original prototypes were built while Shane was in **dump truck dispatch**.
Shane is now in **concrete mixer dispatch** and has been asked to serve as a
**Customer Service Representative (CSR)**.

That changes the priority. Melvin now supports the concrete dispatch office
**first**: customer calls, order changes, will-calls, pour timing, plant
coordination, mixer availability, complaints, ticket/POD follow-up, a callback
queue, and an end-of-day carry list.

The original dump-truck route engine is **preserved intact** as the secondary
**Legacy Dump Dispatch** module — it is no longer the default view.

The product's job: reduce dropped balls, create written records, keep follow-ups
visible, and make the CSR look organized, calm, and professional.

---

## Default View: Today Board

The app opens on the **Today Board**, which answers:

- What is happening today? Who called?
- What orders changed? What pours are at risk?
- What customers need a callback (and which are overdue)?
- What plants / trucks / drivers are causing delays?
- What did I already handle? What is still open?
- What needs to be carried to tomorrow?

It rolls up every other module into one scannable command board with risk flags
and a ranked top-priorities list.

---

## MVP Features

### Concrete Mixer Dispatch / CSR (primary)
- **Today Board** — live rollup of all streams, risk flags, top priorities
- **Customer Calls** — log every call (request type, urgency, status, follow-up)
- **Order Changes** — who changed what, when, who approved, who was told
- **Mixer Dispatch** — live mixer truck status board (available / active / down)
- **Issues / Complaints** — owner, immediate action, who was notified, follow-up
- **Callback Queue** — due / overdue follow-ups that stay visible until done

### Operations
- **Weather** — dispatch-risk forecast (seed data) with pour-risk notes
- **Briefing** — plain-text Morning / End-of-Day / Weekly briefings (copy / push / TTS)
- **Repairs** — fleet repair tickets with status and priority
- **Management** — mission, values, SOPs, and CSR phone scripts
- **Health** — app status, storage mode, future-service connectivity
- **Settings / Data** — tenant config, storage, privacy notes

### Legacy
- **Legacy Dump Dispatch** — full dump-truck route engine preserved (BP rotation,
  514 chain rule, 518 call/check, TF overrides, fixed routes, copy-to-clipboard)

---

## Source Repos Consolidated

| Repo | Contribution |
|------|-------------|
| shanebrain-core | Local-first architecture, MCP/memory concepts, service model |
| srm-dispatch | Dump-truck route engine (preserved as legacy module) |
| pedal-to-the-metal | Fairness engine, product model |
| MASTER-Scheduler-Dashboard-SRM | Scheduler / dashboard / PWA patterns |
| SB-Management-OS | SOPs, operating standards |
| shanebrain-briefing | Briefing structure (push / TTS / log) |
| 2.0RepairTrucks | Repair tracking model |
| weather-log | Weather + dispatch-risk pattern |
| order-calendar, mega-dashboard(-template), srm-operations-demo, constitution, shanebrain-agents | Conceptual references |

---

## Local-First Design

Melvin runs entirely in the browser. **No backend required for the MVP.**

- Phase 1 uses public-safe seed data; state will persist in browser localStorage (`melvin_os_*`)
- Works offline after first load
- Future optional services: Ollama (local LLM), Weaviate (memory), MCP, FastAPI, systemd, backup/export

See `docs/local-first-roadmap.md` for the full plan and the `melvin-*` service map.

---

## SRM North Alabama Tenant

Tenant data lives in `src/tenants/srm-north-alabama/` and is **public-safe**:

| File | Contents |
|------|---------|
| drivers.js | Legacy dump driver roster, BP groups, rota arrays |
| mixers.js | Sample mixer fleet + simple mixer driver roster |
| plants.js | 18 plant codes with names and substitution chains |
| customers.sample.js | Fictional sample customers only |
| contacts.js | **Placeholder** contact tokens only (no real phone numbers) |
| rotations.js | Epoch/cycle config for BP and rota calculations |
| rules.js | CSR operating rules + legacy dispatch rules |

> **Privacy:** This public repo contains placeholder contacts and sample
> customers only. Real rosters, phone numbers, and customer data must live in a
> local, untracked config — never committed here.

---

## How to Run

```bash
npm install
npm run dev       # http://localhost:5173
npm run build     # production build to dist/
npm run preview   # preview the production build
```

---

## Architecture Overview

```
src/
  main.jsx · App.jsx
  app/
    MelvinShell.jsx     # sidebar nav + module routing (default: Today)
    navigation.js
  components/           # Badge, Pill, StatCard, SectionHeader, EmptyState
  modules/
    today/              # TodayBoard, todayModel, riskFlags  (default view)
    customer-service/   # CustomerCallsPanel, CallbackQueue + models
    orders/             # OrderChangesPanel + model
    mixer-dispatch/     # MixerDispatchBoard + model
    issues/             # IssuesPanel + model
    weather/  briefing/  repairs/  management/  health/  settings/
    legacy-dump-dispatch/   # preserved dump-truck engine + UI
      engine/           # buildRoute, rotation, substitutions, travelTimes, fairness
      hooks/  components/
  tenants/srm-north-alabama/   # public-safe tenant data
  styles/               # theme.js (warm dark tones) + global.css
  utils/                # clipboard, date, storage, ids
docs/
  source-review/shanebrain-core-findings.md
  memory-model.md · local-first-roadmap.md
```

Business logic (models / engine, plain `.js`) is kept separate from React UI
(`.jsx` panels).

---

## What Is Scaffolded (Not Yet Wired)

- CSR records are **seed/sample data**; entry forms + localStorage persistence are Phase 2
- Briefing End-of-Day / Weekly are working scaffolds (`buildEndOfDayCloseout`, `buildWeeklyReport`)
- Legacy `useUrlState` / `fairness` written but not surfaced in the new shell
- Weather API — seed data only (`VITE_WEATHER_API_KEY` placeholder in `.env.example`)
- MCP / backup / memory — placeholders (Phase 2–3)

---

## Security / What Was Skipped

`docs/source-review/shanebrain-core-findings.md` documents which source files
were intentionally not read (credentials, vault, SSH, private IPs) and which
patterns were safely extracted. Real phone numbers found hardcoded in the
existing code were sanitized to placeholder tokens during this build.

---

## Next Best Tasks

1. Add entry forms + localStorage persistence for calls, callbacks, orders, issues
2. Wire mixer status updates (status stepper, ETA edit) into the board
3. Carry-list automation: end-of-day "carry to tomorrow" → next-day Today Board
4. PWA manifest + service worker for offline field use
5. Phase 2: `melvin-api` FastAPI backend scaffold
6. Phase 3: `melvin-mcp` server connecting to ShaneBrain memory

---

Built with [Claude Code](https://claude.ai/code).
