# Melvin Local-First Roadmap

## Direction

Melvin is now focused on concrete mixer dispatch and CSR work. The old dump-truck workflow remains as a legacy reference module, but new development should prioritize mixer availability, customer calls, callbacks, order changes, complaints, repairs, briefings, and safe company GPT support.

This public repo must use sample data only. Real SRM data belongs in local/private storage or approved company systems.

---

## Service map

The MVP is a single web app (`melvin-web`). The local-first platform can grow into these optional services:

- `melvin-web` - this Vite + React front end
- `melvin-api` - FastAPI backend for persistence and sync
- `melvin-backup` - local export/backup tools
- `melvin-worker` - scheduled background tasks
- `melvin-health` - service health monitoring
- `melvin-briefing` - daily briefing builder
- `melvin-mcp` - future tool surface for approved local agent workflows

Optional infrastructure later: SQLite, local file backup, Ollama, Weaviate, MCP, systemd services, and company-approved GPT workflows. None are required for the MVP.

---

## Phase 1 - Browser-only MVP

**Status:** In progress  
**Stack:** Vite + React, browser localStorage, no backend

- [x] Vite React app scaffolded
- [x] Public-safe SRM North Alabama tenant placeholders
- [x] Today Board default view
- [x] Customer Calls log with local entry + browser persistence
- [x] Callback Queue with local entry/complete + browser persistence
- [x] Order Change tracker with local entry/status + browser persistence
- [x] Issues / Complaints log with local entry/resolve + browser persistence
- [x] Mixer Dispatch board with sample data
- [x] Weather panel with seed data
- [x] Briefing generator scaffold
- [x] Repairs tracker scaffold
- [x] Management / SOP / CSR scripts panel
- [x] Health panel
- [x] Settings / Data panel
- [x] Legacy Dump Dispatch module preserved as reference
- [x] Public privacy rules documented in `PRIVACY.md`
- [ ] Export / backup for browser-local records
- [ ] PWA manifest + service worker
- [ ] Mixer status update controls
- [ ] End-of-day carry-forward into next-day Today Board

---

## Phase 2 - Private/local persistence

**Status:** Planned

- [ ] FastAPI backend at `/api`
- [ ] SQLite for CSR records, repairs, shift notes, and dispatch logs
- [ ] Local backup/export folder outside Git
- [ ] Import/export workflow for sanitized CSV only
- [ ] Private data adapter for real company data
- [ ] Weather API integration through private env config
- [ ] Repair CRUD
- [ ] Shift note creation and history

---

## Phase 3 - Company GPT support

**Status:** Planned

- [ ] Define what company GPT may receive and what must stay out
- [ ] Add copy-safe briefing formats that remove private details by default
- [ ] Add redaction helpers for names, phone numbers, customer/job details, and truck tokens
- [ ] Add approved prompt templates for CSR summaries, EOD notes, and backlog drafting
- [ ] Keep GPT transcripts out of public GitHub

---

## Phase 4 - Local automation

**Status:** Future

- [ ] Background worker for scheduled backups and reports
- [ ] Service health alerts
- [ ] Fairness and burnout flags for mixer operations
- [ ] Route/order audit against historical baseline
- [ ] Weekly summaries and fleet health reports

---

## Architecture principles

1. **Privacy first** - public repo contains sample data only
2. **Local first** - useful without a cloud backend
3. **Dispatcher speed** - one screen, fast capture, low cognitive load
4. **Company-safe GPT** - approved prompts and redaction before sharing sensitive context
5. **Iterate from real usage** - build what protects time, follow-up, and accountability
