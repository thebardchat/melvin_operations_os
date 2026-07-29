# Melvin Operations OS

**Concrete mixer dispatch + CSR command center.**

Melvin is a local-first operations tool for concrete mixer dispatch, customer service, follow-ups, repairs, weather, briefings, and SOPs. The public repo contains product code and sample data only. Real SRM data belongs in local/private storage or approved company systems.

Internal motto: **Pedal to the Medal** - keep moving, stay professional, document everything.

---

## Current Direction

This project is now centered on Shane's current concrete mixer dispatch and CSR work, plus the fact that company GPT access exists. That changes the build priorities:

- support live CSR follow-up discipline without exposing private data
- make mixer status, call logs, order changes, complaints, and callbacks easy to capture
- keep real rosters, phone numbers, customer details, dispatch screenshots, and workbooks out of public GitHub
- use public-safe placeholder data in this repo
- treat old dump-truck logic as legacy reference, not the main product direction

The old public `srm-dispatch` repo is no longer a safe source of truth. Do not re-import its live operational data into this repo.

---

## Default View: Today Board

The app opens on the **Today Board**, which answers:

- What is happening today?
- Who called and what still needs follow-up?
- What orders changed and who needs to know?
- Which pours, trucks, plants, or callbacks are at risk?
- What did I handle already?
- What needs to carry into tomorrow?

It rolls up every active module into one scannable command board with risk flags and ranked priorities.

---

## MVP Features

### Concrete Mixer Dispatch / CSR

- **Today Board** - live rollup of calls, callbacks, order changes, issues, mixer status, and risk flags
- **Customer Calls** - local entry and browser persistence for call records
- **Callback Queue** - local entry, complete controls, and overdue visibility
- **Order Changes** - local entry and status tracking
- **Mixer Dispatch** - sample mixer status board
- **Issues / Complaints** - local entry and resolution tracking

### Operations

- **Weather** - seed dispatch-risk forecast
- **Briefing** - Morning / End-of-Day / Weekly text scaffolds
- **Repairs** - fleet repair ticket scaffold
- **Management** - SOPs and CSR scripts
- **Health** - app status and future-service placeholders
- **Settings / Data** - tenant config, storage, privacy notes

### Legacy

- **Legacy Dump Dispatch** - preserved reference module for prior dump-truck route logic. It is not the current product center.

---

## Privacy Boundary

This is a public repository. It must stay clean.

Allowed:

- placeholder contacts
- synthetic driver names
- fictional customers
- generic workflow examples
- product code and docs

Not allowed:

- real driver rosters
- phone numbers
- customer/job/order/POD/ticket details
- dispatch screenshots
- Excel/CSV exports
- company GPT transcripts with private SRM content

See `PRIVACY.md` for the standing rules.

---

## Local-First Design

Melvin currently runs entirely in the browser. No backend is required for the MVP.

- Phase 1 uses public-safe seed data and browser localStorage (`melvin_os_*`)
- Real operational data should stay local/private
- Export/backup is the next protection priority
- Future optional services: FastAPI, SQLite, local backup, company-approved GPT workflow, MCP, and memory/search

---

## SRM North Alabama Tenant

Tenant data lives in `src/tenants/srm-north-alabama/` and is public-safe by design.

| File | Contents |
|------|----------|
| `drivers.js` | Legacy placeholder dump-driver roles only |
| `mixers.js` | Generic sample mixer fleet and sample driver roster |
| `plants.js` | Plant codes and substitution chains used for workflow scaffolding |
| `customers.sample.js` | Fictional sample customers only |
| `contacts.js` | Placeholder contact tokens only |
| `rotations.js` | Sample rotation/cycle config |
| `rules.js` | CSR operating rules and legacy dispatch rules |

---

## How to Run

```bash
npm install
npm run dev       # http://localhost:5173
npm run build     # production build to dist/
npm run preview   # preview the production build
```

---

## Next Best Tasks

1. Add export/backup for browser-local CSR records.
2. Add PWA manifest + service worker for offline use.
3. Wire mixer status updates into the Today Board.
4. Add end-of-day carry-forward into next-day Today Board.
5. Add a private/local data adapter for real company data.
6. Keep company GPT workflows outside public GitHub unless fully sanitized.
