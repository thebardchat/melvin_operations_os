# Melvin Local-First Roadmap

## Phase 1 — Current MVP (Browser-Only)

**Status:** In progress  
**Stack:** Vite + React, browser localStorage, no backend

- [x] Vite React app scaffolded
- [x] SRM North Alabama tenant data
- [x] Dispatch board with full route engine
- [x] BP rotation calendar
- [x] Audible view (copy all routes)
- [x] Morning briefing generator
- [x] Repairs tracker (seed data)
- [x] Weather panel (seed data)
- [x] Management / SOPs panel
- [x] System health panel
- [ ] localStorage persistence for dispatch state
- [ ] localStorage persistence for repair records
- [ ] PWA manifest + service worker (offline capable)
- [ ] URL state sync (date, tf, down, etc.)

---

## Phase 2 — melvin-api + Persistence

**Status:** Planned  
**New services:** `melvin-api` (FastAPI), `melvin-backup`

- [ ] FastAPI backend at `/api` (same origin or VITE_MCP_URL)
- [ ] SQLite for repair records, shift notes, dispatch logs
- [ ] REST endpoints: `/api/repairs`, `/api/shifts`, `/api/routes`
- [ ] Daily automatic backup to local RAID or external drive
- [ ] Weather API integration (OpenWeatherMap via VITE_WEATHER_API_KEY)
- [ ] Live weather with dispatch risk scoring
- [ ] Repair CRUD (create, update, resolve tickets)
- [ ] Shift note creation and history

---

## Phase 3 — melvin-mcp + Weaviate Memory

**Status:** Planned  
**New services:** `melvin-mcp` (MCP server), `melvin-agents`, `melvin-briefing`

- [ ] MCP server exposing Melvin tools to Claude Code
- [ ] Connect to ShaneBrain Weaviate (neworleans:8080) or Melvin-local Weaviate
- [ ] Weaviate collections: MelvinKnowledge, MelvinConversation, MelvinShiftNote, etc.
- [ ] `melvin_search_knowledge` — RAG over SOPs and routing rules
- [ ] `melvin_log_dispatch` — auto-log every route to Weaviate
- [ ] `melvin_daily_briefing` — structured morning briefing with memory context
- [ ] `melvin_chat` — conversational interface with history
- [ ] Morning briefing pushed to ShaneBrain Discord at 5 AM
- [ ] Conversation history stored and searchable

---

## Phase 4 — melvin-worker + Full Automation

**Status:** Future  
**New services:** `melvin-worker`, `melvin-health`

- [ ] Background worker for scheduled tasks (systemd timer)
- [ ] Auto-ingest: shift notes, repair logs, weather data → Weaviate
- [ ] melvin-health: monitors all Melvin services, pushes alerts to Discord
- [ ] Fairness engine: flag burnout, auto-suggest driver rotations
- [ ] Route audit: flag unusual patterns against historical baseline
- [ ] Multi-tenant: second tenant onboarding (template system)
- [ ] Reporting: weekly summaries, monthly fleet health

---

## Architecture Principles

1. **Local first** — works without internet, syncs when available
2. **No vendor lock-in** — all data stays on your hardware
3. **ADHD-aware** — one screen, one task, minimal cognitive load
4. **Extensible tenant model** — `src/tenants/` makes adding a new company a clean folder
5. **80/20 shipping** — ship the useful thing fast, iterate from real usage
