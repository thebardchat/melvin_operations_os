Replace the whole file with this. I cleaned up the markdown, fixed the broken code fences, shifted the product toward **Concrete Mixer Dispatch + Customer Service**, kept the dump truck dispatch logic as a preserved/legacy module, and removed the public phone-number problem by requiring placeholder contacts only.

````md
# CLAUDE.md — Melvin Operations OS

You are Claude Code working in `thebardchat/melvin_operations_os`.

Build a working MVP of **Melvin Operations OS**: a local-first in-house command center for a concrete dispatch office.

This repo consolidates Shane Brazelton’s SRM Concrete, ShaneBrain, dump truck dispatch, mixer dispatch, customer service, repair, weather, briefing, management, and local-first AI prototypes into one clean codebase.

Do not build twelve apps. Build one extensible Melvin platform.

---

## Core product direction

The original prototypes were created while Shane was in **dump truck dispatch**. Shane is now working in **concrete mixer dispatch** and has been asked to serve as **Customer Service Representative**.

This changes the priority.

Melvin must now support the concrete dispatch office first, not just dump truck routing.

The MVP should still preserve dump truck dispatch logic from `srm-dispatch`, but the primary day-to-day workflow is now:

```txt
Customer calls
Order entry / order changes
Will-calls
Pour timing
Plant coordination
Truck/mixer availability
Customer complaints
Driver/customer updates
Ticket/POD follow-up
Daily communication log
Callback queue
End-of-day unresolved issue list
````

Build Melvin to help Shane succeed in this CSR / mixer dispatch role.

The product should reduce dropped balls, create written records, keep follow-ups visible, and make Shane look organized, calm, useful, and professional in a negative office environment.

Internal motto:

```txt
Pedal to the Medal
```

Meaning: keep moving, stay professional, document everything, and turn the role into operational advantage.

---

## Primary MVP focus

Default screen should be:

```txt
Today Board
```

Not legacy dump truck dispatch.

The Today Board should answer:

```txt
What is happening today?
Who called?
What orders changed?
What pours are at risk?
What customers need a callback?
What plants/trucks/drivers are causing delays?
What did I already handle?
What is still open?
What needs to be carried to tomorrow?
```

---

## Source repos to review

Use these as reference:

```txt
https://github.com/thebardchat/shanebrain-core
https://github.com/thebardchat/srm-dispatch
https://github.com/thebardchat/MASTER-Scheduler-Dashboard-SRM
https://github.com/thebardchat/pedal-to-the-metal
https://github.com/thebardchat/SB-Management-OS
https://github.com/thebardchat/shanebrain-briefing
https://github.com/thebardchat/shanebrain-agents
https://github.com/thebardchat/constitution
https://github.com/thebardchat/order-calendar
https://github.com/thebardchat/2.0RepairTrucks
https://github.com/thebardchat/weather-log
https://github.com/thebardchat/mega-dashboard
https://github.com/thebardchat/mega-dashboard-template
https://github.com/thebardchat/srm-operations-demo
```

Priority:

1. `shanebrain-core` — source-of-truth for local-first architecture, service model, MCP/memory concepts, and Melvin staging notes.
2. `srm-dispatch` — working dump truck dispatch logic to preserve as a legacy/haul dispatch module.
3. `pedal-to-the-metal` — dispatch SaaS, fairness engine, reporting, product model.
4. `MASTER-Scheduler-Dashboard-SRM` — scheduler/dashboard/PWA patterns.
5. `SB-Management-OS` — SOPs, management OS, operating standards.
6. `shanebrain-briefing` — morning briefing, push/TTS/log pattern.
7. `shanebrain-agents` — future agent orchestration.
8. `constitution` — local-first, ADHD-aware, 80/20 shipping principles.
9. Remaining repos — conceptual references only.

---

## Security rule

`shanebrain-core` may contain sensitive information. Extract only safe structural/product information.

Never copy:

```txt
secrets
.env values
tokens
private keys
passwords
SSH configs
vault entries
private documents
private IPs
machine login names
credentials
real customer private data
real phone numbers unless explicitly approved
```

If a file appears sensitive, skip it and record that it was skipped in:

```txt
docs/source-review/shanebrain-core-findings.md
```

Create `.env.example` with placeholders only if environment variables are needed.

Public seed data should use placeholders where appropriate.

---

## Required MVP

By the end of this session, the app must:

```txt
run with npm run dev
build with npm run build
render a working Melvin dashboard
default to the Today Board
include concrete mixer dispatch / CSR workflows
include customer call logging
include order change tracking
include callback queue
include issue / complaint logging
include mixer truck status board
include weather risk panel
include briefing panel
include management / SOP panel
include health/settings scaffold
preserve legacy dump truck dispatch logic as a module or documented scaffold
separate business logic from React UI
document what was consolidated and what remains
```

---

## Target structure

Create or adapt to this structure:

```txt
src/
  main.jsx
  App.jsx

  app/
    MelvinShell.jsx
    navigation.js

  components/
    Badge.jsx
    Pill.jsx
    StatCard.jsx
    SectionHeader.jsx
    EmptyState.jsx

  modules/
    today/
      TodayBoard.jsx
      todayModel.js
      riskFlags.js

    customer-service/
      CustomerCallsPanel.jsx
      CallbackQueue.jsx
      customerCallModel.js
      callbackModel.js

    orders/
      OrderChangesPanel.jsx
      orderChangeModel.js

    mixer-dispatch/
      MixerDispatchBoard.jsx
      mixerStatusModel.js

    issues/
      IssuesPanel.jsx
      issueModel.js

    legacy-dump-dispatch/
      components/
        DispatchBoard.jsx
        DriverCard.jsx
        RouteSteps.jsx
        AudiblePanel.jsx
        BPCalendar.jsx
        CrewTabs.jsx
        DispatchHeader.jsx
      engine/
        buildRoute.js
        rotation.js
        substitutions.js
        travelTimes.js
        fairness.js
      hooks/
        useDispatchState.js
        useUrlState.js
        useOnlineStatus.js

    briefing/
      buildMorningBriefing.js
      BriefingPanel.jsx

    repairs/
      repairsModel.js
      RepairsPanel.jsx

    weather/
      weatherModel.js
      WeatherPanel.jsx

    management/
      ManagementPanel.jsx
      sops.js

    health/
      HealthPanel.jsx

    settings/
      SettingsPanel.jsx

  tenants/
    srm-north-alabama/
      drivers.js
      plants.js
      mixers.js
      customers.sample.js
      rotations.js
      contacts.js
      rules.js
      index.js

  styles/
    theme.js
    global.css

  utils/
    clipboard.js
    date.js
    storage.js
    ids.js

docs/
  source-review/
    shanebrain-core-findings.md
  memory-model.md
  local-first-roadmap.md
```

---

## App sections

Implement simple tab/sidebar navigation:

```txt
Today
Customer Calls
Order Changes
Mixer Dispatch
Issues / Complaints
Callbacks
Weather
Briefing
Management
Health
Settings / Data
Legacy Dump Dispatch
```

Default section:

```txt
Today
```

---

## Concrete mixer dispatch / CSR modules

### Today Board

Show a practical command board with:

```txt
today's date
weather risk
open customer calls
callbacks due
open order changes
open complaints/issues
trucks/mixers available
trucks/mixers down
at-risk pours
plant issues
unresolved end-of-day items
quick notes
```

Add risk flags:

```txt
First round not confirmed
Customer asked for change
Will-call still open
Truck running late
Plant delay
Weather risk
Large pour
High-priority customer
Complaint open
Needs callback
Ticket/POD needed
Unresolved issue carried from yesterday
```

### Customer Call Log

Create `customerCallModel.js`.

Fields:

```js
{
  id,
  time,
  customerName,
  company,
  phone,
  jobName,
  jobAddress,
  orderNumber,
  topic,
  requestType,
  urgency,
  status,
  assignedTo,
  notes,
  followUpTime,
  resolvedAt
}
```

Request types:

```txt
New order
Order change
Will-call
Cancel order
Add-on load
Pour time change
Complaint
Driver ETA request
Ticket/POD request
Pricing question
Plant issue
Other
```

Statuses:

```txt
Open
Waiting on customer
Waiting on dispatch
Waiting on plant
Waiting on driver
Resolved
Carried to tomorrow
```

Urgency:

```txt
Low
Normal
High
Critical
```

### Callback Queue

Create `callbackModel.js`.

Fields:

```js
{
  id,
  dueTime,
  customerName,
  company,
  phone,
  reason,
  relatedOrderNumber,
  status,
  notes,
  completedAt
}
```

Reasons:

```txt
Call customer back
Confirm pour time
Check if job is ready
Get updated yardage
Send ticket/POD
Follow up on complaint
Confirm cancellation
Confirm will-call
Other
```

Statuses:

```txt
Open
Due soon
Overdue
Completed
Canceled
```

### Order Change Tracker

Create `orderChangeModel.js`.

Fields:

```js
{
  id,
  orderNumber,
  customerName,
  jobName,
  jobAddress,
  originalTime,
  newTime,
  originalYards,
  newYards,
  mixDesign,
  slump,
  spacing,
  requestedBy,
  approvedBy,
  changeReason,
  status,
  timestamp,
  notes
}
```

Statuses:

```txt
Requested
Approved
Rejected
Entered
Dispatched
Completed
Canceled
```

This protects the office when someone asks:

```txt
Who changed that?
When did it change?
Who approved it?
Was dispatch/plant/customer told?
```

### Mixer Dispatch Board

Create `mixerStatusModel.js`.

Fields:

```js
{
  id,
  truckNumber,
  driverName,
  currentOrder,
  nextOrder,
  plant,
  loadStatus,
  ticketNumber,
  yards,
  mixDesign,
  slump,
  jobAddress,
  eta,
  delayReason,
  notes,
  updatedAt
}
```

Statuses:

```txt
Available
Loading
Loaded
On the way
On job
Pouring
Returning
Washing out
Down
Lunch
Off duty
```

### Issues / Complaints

Create `issueModel.js`.

Fields:

```js
{
  id,
  date,
  customerName,
  jobName,
  orderNumber,
  issueType,
  severity,
  description,
  immediateAction,
  whoWasNotified,
  followUpNeeded,
  followUpDate,
  status,
  resolution
}
```

Issue types:

```txt
Late truck
Wrong mix
Short load
Rejected load
Hot load
Cold joint risk
Plant delay
Driver issue
Ticket issue
Customer upset
Safety concern
Other
```

Severity:

```txt
Low
Medium
High
Critical
```

Statuses:

```txt
Open
Watching
Waiting on someone
Resolved
Carried to tomorrow
```

---

## Legacy dump dispatch module

Preserve the useful logic from `srm-dispatch`, but make it a secondary module called:

```txt
Legacy Dump Dispatch
```

This module should preserve:

```txt
route generation
BP rotation
plant-down audibles
substitution choices
route text
514 chain rule
518 call/check rule
Tuesday/Friday overrides
MH day quarry behavior
519 swap
Curtis office override
Alexis two-round short day
CHRIS P and Tim fixed routes
copy-to-clipboard route cards
BP calendar
start-time overrides
```

Do not make this the default app section.

---

## Public-safe SRM seed data

Use public-safe sample data where necessary.

Do not hardcode private phone numbers or private customer information.

### Drivers

Use generic/sample driver names unless real names are already public and approved.

Example:

```js
export const DRIVERS = [
  { id: "driver-01", name: "Driver 01", crew: "Mixer", start: "06:00", status: "Available" },
  { id: "driver-02", name: "Driver 02", crew: "Mixer", start: "06:00", status: "Available" },
  { id: "driver-03", name: "Driver 03", crew: "Mixer", start: "06:30", status: "Assigned" },
  { id: "driver-04", name: "Driver 04", crew: "Mixer", start: "07:00", status: "Off duty" }
]
```

### Mixer trucks

Example:

```js
export const MIXERS = [
  { id: "mix-001", truckNumber: "Mixer 001", status: "Available", driverId: "driver-01" },
  { id: "mix-002", truckNumber: "Mixer 002", status: "Loading", driverId: "driver-02" },
  { id: "mix-003", truckNumber: "Mixer 003", status: "On job", driverId: "driver-03" },
  { id: "mix-004", truckNumber: "Mixer 004", status: "Down", driverId: null }
]
```

### Contacts

Use placeholders only in public repo:

```js
export const CONTACTS = {
  DISPATCH_OFFICE: "DISPATCH_OFFICE_PHONE",
  CUSTOMER_SERVICE: "CUSTOMER_SERVICE_PHONE",
  PLANT_MANAGER: "PLANT_MANAGER_PHONE"
}
```

### Plants/assets

Use plant codes/assets from the prototypes:

```txt
506 Decatur
507 Stringfield
508 Nick Fitcheard
511 Palmer
513 Greenbrier
514 Arab
516 Lacey Spring
518 Scottsboro
519 Muscle Shoals
525 Cullman
502 Bridgeport
591 Mt. Hope
594 Cherokee RQ
POD Decatur Sand
907 Palmer Block
MM Martin Marietta
RG Rogers Group
```

### Legacy dump substitutions

Preserve:

```js
export const SUBS = {
  "506": ["511", "513", "508"],
  "507": ["508", "511", "513"],
  "508": ["507", "511", "513"],
  "511": ["513", "506", "507"],
  "513": ["511", "506", "507"],
  "514": ["516", "519", "513"],
  "516": ["514", "519", "513"],
  "519": ["514", "516", "511"],
  "525": ["514", "516", "519"],
  "591": ["594"],
  "594": ["591"],
  "POD": [],
  "502": [],
  "907": [],
  "RG": [],
  "MM": [],
  "ALEXIS_SHORT": []
}
```

---

## Legacy dump dispatch engine

Implement pure functions under:

```txt
src/modules/legacy-dump-dispatch/engine/
```

### `rotation.js`

Export:

```js
getCycleDay(date, options)
getBPGroup(cycleDay)
getBPDrivers(cycleDay, tenant)
rotaAssign(list, name, rota, cycle)
getBPCalendar(fromDate, tenant, days = 15)
driverBPDay(name, cycleDay, tenant)
isTueFri(date)
isWeekend(date)
nextWeekday(date, direction)
```

Rules:

```txt
base date: 2026-03-09
three-day weekday cycle
skip Saturdays/Sundays
TODO: holiday skipping later
groups A/B/C
fixed BP drivers from tenant data
15-weekday BP calendar
```

### `substitutions.js`

Export:

```js
resolvePlant(code, downSet, subMap)
buildSubMap(downSet, subOverride, tenant)
getAffectedDrivers(downSet, routeTexts)
```

### `travelTimes.js`

Export:

```js
getDriveTime(from, to, tenant)
timeToMinutes(str)
minutesToTime(minutes)
addMinutes(timeStr, delta)
estimateRouteTime(stops, tenant)
```

### `buildRoute.js`

Export:

```js
buildRoute(driverName, context)
```

Preserve `srm-dispatch/src/utils/shorthand.js` behavior as closely as possible.

If unclear, implement current prototype behavior and add:

```js
// TODO: verify operational rule
```

---

## Briefing module

Create `buildMorningBriefing()` that returns plain text suitable for copy, push notification, or TTS.

Include:

```txt
greeting/date
weather risk
open customer calls
callbacks due
order changes
open complaints/issues
mixer availability
plant issues
legacy dispatch audibles if any
operational notes
"Melvin is ready."
```

Also create placeholders for:

```txt
End-of-day closeout
Weekly operations report
```

---

## Repairs module

Seed simple repair records.

Fields:

```js
{
  id,
  unitNumber,
  equipmentType,
  assignedDriver,
  issue,
  status,
  priority,
  openedAt,
  updatedAt,
  notes
}
```

Equipment types:

```txt
Mixer
Dump Truck
Plant
Other
```

Statuses:

```txt
Open
Waiting parts
Scheduled
In progress
Resolved
Out of service
```

Priorities:

```txt
Low
Medium
High
Critical
```

---

## Weather module

Use local seed data. No live API required.

Fields:

```js
{
  date,
  location,
  condition,
  high,
  low,
  precipitationChance,
  notes,
  dispatchRisk
}
```

Risk:

```txt
Low
Medium
High
```

---

## Management module

Seed:

```txt
Mission: Be the best ready-mix provider in North Alabama.
Values: Service, Cleanliness, Labor, Leadership.
Mantra: If you aren’t busy doing something, get busy.
Internal motto: Pedal to the Medal.
```

Include placeholders for:

```txt
SOPs
Customer service scripts
Complaint handling scripts
Order change checklist
End-of-day closeout checklist
Personnel notes
Training notes
```

---

## Health module

Scaffold:

```txt
app status
local-first mode
last saved timestamp
future API status
future MCP status
future agents status
future backup status
future memory status
future weather status
future notifications status
```

---

## Local-first roadmap

Create:

```txt
docs/local-first-roadmap.md
```

Future services:

```txt
melvin-web
melvin-api
melvin-worker
melvin-mcp
melvin-agents
melvin-briefing
melvin-backup
melvin-health
```

Explain that the MVP is web/local data first, with future optional Ollama, Weaviate, MCP, FastAPI, systemd, and backup services.

---

## Memory model

Create:

```txt
docs/memory-model.md
```

Future collections:

```txt
MelvinKnowledge
MelvinConversation
MelvinShiftNote
MelvinCustomerCall
MelvinOrderChange
MelvinDispatchRecord
MelvinMixerStatus
MelvinRepairRecord
MelvinWeatherLog
MelvinIssue
MelvinCallback
MelvinAuditLog
MelvinBriefing
MelvinPlan
```

For each, describe purpose and likely fields.

Do not require Weaviate now.

---

## Source review doc

Create:

```txt
docs/source-review/shanebrain-core-findings.md
```

Include:

```txt
reviewed files
safe useful concepts found
source-of-truth decisions
sensitive files intentionally skipped
what to import later
what not to import
```

---

## README

Update `README.md` with:

```txt
what Melvin Operations OS is
why the product shifted to concrete mixer dispatch + customer service
source repos consolidated
current MVP features
local-first design
SRM North Alabama tenant
how to run
architecture overview
what is scaffolded
next steps
```

Commands:

```bash
npm install
npm run dev
npm run build
npm run preview
```

---

## Implementation order

Follow this order:

1. Inspect current repo.
2. Create/repair Vite React foundation.
3. Add public-safe SRM tenant data.
4. Add core concrete office models: calls, callbacks, order changes, mixer status, issues.
5. Add Today Board.
6. Add Customer Calls, Order Changes, Mixer Dispatch, Issues, Callback panels.
7. Add legacy dump dispatch engine and UI scaffold.
8. Add theme/shared components.
9. Add Briefing, Repairs, Weather, Management, Health, Settings.
10. Add docs.
11. Run `npm install` if needed.
12. Run `npm run build`.
13. Fix all build errors.
14. Final report.

---

## Definition of done

Done means:

```txt
npm run build passes
Today Board renders
Customer Calls panel renders
Order Changes panel renders
Mixer Dispatch panel renders
Issues / Complaints panel renders
Callback Queue renders
Weather panel renders
Briefing panel generates plain text
Management panel renders
Health panel renders
Legacy Dump Dispatch module exists or is clearly scaffolded
docs exist
no secrets copied
README explains the role/product shift
final report lists files changed, what works, what is scaffolded, and next tasks
```

---

## Final report requirements

At the end, report:

```txt
branch name
build status
files created/modified
what works
what is scaffolded
what was skipped for sensitivity
whether any secrets were found and ignored
next best tasks
```

```
```
