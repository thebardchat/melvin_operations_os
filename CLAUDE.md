# CLAUDE.md — Melvin Operations OS

You are Claude Code working in `thebardchat/melvin_operations_os`.

Build a working MVP of **Melvin Operations OS**: a local-first operations command center for real-world businesses, starting with SRM Concrete / North Alabama dispatch.

This repo consolidates Shane Brazelton’s prototype ecosystem into one clean codebase. Do not build twelve apps. Build one extensible Melvin platform.

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
Priority:

shanebrain-core — source-of-truth for local-first architecture, service model, MCP/memory concepts, and Melvin staging notes.
srm-dispatch — working SRM dispatch logic.
pedal-to-the-metal — dispatch SaaS, fairness engine, reporting, product model.
MASTER-Scheduler-Dashboard-SRM — scheduler/dashboard/PWA patterns.
SB-Management-OS — SOPs, management OS, operating standards.
shanebrain-briefing — morning briefing, push/TTS/log pattern.
shanebrain-agents — future agent orchestration.
constitution — local-first, ADHD-aware, 80/20 shipping principles.
Remaining repos — conceptual references only.
Security rule

shanebrain-core may contain sensitive information. Extract only safe structural/product information. Never copy secrets, .env values, tokens, private keys, passwords, SSH configs, vault entries, private documents, private IPs, machine login names, or credentials. If a file appears sensitive, skip it and record that it was skipped in docs/source-review/shanebrain-core-findings.md.

Create .env.example with placeholders only.

Required MVP

By the end of this session, the app must:

run with npm run dev
build with npm run build
render a working Melvin dashboard
default to the Dispatch view
include SRM North Alabama seed data
separate dispatch business logic from React UI
include route cards that copy text
support plant-down audibles and substitutions
support BP rotation/calendar
support start-time overrides
include a basic fairness engine
include repairs, weather, briefing, management, health/settings scaffolds
document what was consolidated and what remains
Target structure

Create or adapt to this structure:
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
  modules/
    dispatch/
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
  tenants/
    srm-north-alabama/
      drivers.js
      plants.js
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
docs/
  source-review/shanebrain-core-findings.md
  memory-model.md
  local-first-roadmap.md

App sections

Implement simple tab/sidebar navigation:

Dispatch
Briefing
Repairs
Weather
Management
Health
Settings / Data

Dispatch is the default.

SRM seed data

Include these drivers:

(((insert Drivers From Christians XCEL File)))

BP_GROUPS = {
  A: ["operator1", "operator2", "operator3", "operator4"],
  B: ["operator1", "operator2", "operator3", "operator4"],]
}

FIXED_BP = ["op1", "op2"]

C507_NAMES = ["op1", "op2"]
C519_NAMES = ["Charlie"]
C506_NAMES = ["Kenny"]

C507_ROTA = ["506", "511", "513", "507", "514"]
C506_ROTA = ["511", "513", "514", "506"]

C519_TUE_PLANTS = ["511", "506", "513", "507"]
C507_TUE_PLANTS = ["516", "514", "519", "513"]

BP_FIRST_PLANTS = ["506", "513", "511", "507"]

CONTACTS = {
  SHANE: "256-722-0178",
 }

((Plants/assets:))

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

Substitutions:

SUBS = {
  "506": ["511","513","508"],
  "507": ["508","511","513"],
  "508": ["507","511","513"],
  "511": ["513","506","507"],
  "513": ["511","506","507"],
  "514": ["516","519","513"],
  "516": ["514","519","513"],
  "519": ["514","516","511"],
  "525": ["514","516","519"],
  "591": ["594"],
  "594": ["591"],
  "POD": [],
  "502": [],
  "907": [],
  "RG": [],
  "MM": [],
  "ALEXIS_SHORT": []
}


Dispatch engine

Implement pure functions.

rotation.js:


Rules:

base date: 2026-03-09
three-day weekday cycle
skip Saturdays/Sundays
TODO: holiday skipping later
groups A/B/C
Stacey and Alexis fixed BP
15-weekday BP calendar

substitutions.js:


resolvePlant(code, downSet, subMap)
buildSubMap(downSet, subOverride, tenant)
getAffectedDrivers(downSet, routeTexts)

travelTimes.js:

getDriveTime(from, to, tenant)
timeToMinutes(str)
minutesToTime(minutes)
addMinutes(timeStr, delta)
estimateRouteTime(stops, tenant)

buildRoute.js:

buildRoute(driverName, context)

Preserve srm-dispatch/src/utils/shorthand.js behavior as closely as possible:

plant replacement
MH day quarry switch between 591/594
514 chain rule: 514 scrap → LQ → RG rock → home plant
518 call/check with Shane and Anthony
BP first-rock rotation
Curtis office override
Tue/Fri overrides for 519 and 507 crews
non-Tue/Fri BP rotation
519 standard and swap routes
507 standard routes
506 standard routes
Alexis two-round short-day route
CHRIS P fixed route
Tim fixed route
end-of-shift 519 short-route check

If unclear, implement current prototype behavior and add TODO: verify operational rule.

Dispatch UI

Required behavior:

current date default
previous/next weekday buttons
back to today
optional URL date state
Tue/Fri toggle
MH day toggle
519 swap toggle
Curtis office toggle
crew tabs
audibles panel
BP calendar panel
start override +/- 15 min and reset
copy route text on card click
copied confirmation
fallback clipboard method
route steps split on →
Fairness engine

Create fairness.js with:

createDailyFairnessSnapshot(drivers, loads = [])
getDriverLoadCounts(loads)
getFleetAverage(loads)
getDriverDelta(driverName, loads)
getBurnoutFlags(drivers, loads, threshold = 0.2)
createOverrideLogEntry({ driverName, reason, previousAssignment, newAssignment, user })
suggestNextDriver({ eligibleDrivers, loads, exclude = [] })

Show basic fairness stats on Dispatch or Health.

Other modules
Briefing

Create buildMorningBriefing() that returns plain text suitable for copy, push notification, or TTS.

Include:

greeting/date
BP group and BP drivers
audibles summary
weather risk
repair count
fairness alerts
operational notes
“Melvin is ready.”
Repairs

Seed simple truck repair records:


{
  id,
  unitNumber,
  driver,
  issue,
  status,
  priority,
  openedAt,
  updatedAt,
  notes
}



Statuses: open, waiting_parts, scheduled, in_progress, resolved.

Priorities: low, medium, high, critical.

Weather

Use local seed data. No live API required.

Fields:

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

Risk: low, medium, high.

Management

Seed:

Mission: Be the best ready-mix provider in North Alabama.
Values: Service, Cleanliness, Labor, Leadership.
Mantra: If you aren’t busy doing something, get busy.

Include SOP/coaching/personnel placeholders.

Health

Scaffold:

app status
local-first mode
last saved timestamp
future service health placeholders: API, MCP, agents, backup, memory, weather, notifications
Local-first roadmap

Create docs/local-first-roadmap.md with future services:

melvin-web
melvin-api
melvin-worker
melvin-mcp
melvin-agents
melvin-briefing
melvin-backup
melvin-health

Explain that the MVP is web/local data first, with future optional Ollama, Weaviate, MCP, FastAPI, systemd, and backup services.

Memory model

Create docs/memory-model.md with future collections:

MelvinKnowledge
MelvinConversation
MelvinShiftNote
MelvinDispatchRecord
MelvinRepairRecord
MelvinWeatherLog
MelvinAuditLog
MelvinBriefing
MelvinPlan

For each, describe purpose and likely fields. Do not require Weaviate now.

Source review doc

Create docs/source-review/shanebrain-core-findings.md.

Include:

reviewed files
safe useful concepts found
source-of-truth decisions
sensitive files intentionally skipped
what to import later
what not to import
README

Update README.md with:

what Melvin Operations OS is
source repos consolidated
current MVP features
local-first design
SRM North Alabama tenant
how to run
architecture overview
what is scaffolded
next steps

Commands:

npm install
npm run dev
npm run build
npm run preview

Implementation order
Inspect current repo.
Create/repair Vite React foundation.
Add SRM tenant data.
Add pure dispatch/fairness engines.
Add theme/shared components.
Add Dispatch UI.
Add Briefing, Repairs, Weather, Management, Health.
Add docs.
Run npm install if needed.
Run npm run build.
Fix all build errors.
Final report.
Definition of done

Done means:

npm run build passes
Dispatch board renders
SRM routes generate
plant-down audibles update route text
BP calendar renders
route cards copy text
briefing generates plain text
repairs/weather/management/health panels render
docs exist
no secrets copied
final report lists files changed, what works, what is scaffolded, and next tasks


