# Melvin Memory Model

## Current MVP: Browser localStorage

In Phase 1, all state is stored in browser localStorage using namespaced keys (`melvin_os_*`).
See `src/utils/storage.js` for the read/write helpers.

No backend, no cloud, no Weaviate — just the browser.

---

## Phase 3: Weaviate Collections

When Melvin connects to Weaviate (Phase 3), the following collections will be created.
All will use `text2vec-transformers` with MiniLM-L6-v2 for semantic search.

### MelvinKnowledge
**Purpose:** General knowledge base — SOPs, rules, routing notes, product decisions  
**Fields:** title, content, category, source, tags, createdAt, updatedAt  
**Use:** RAG queries, SOP search, routing rule lookup

### MelvinConversation
**Purpose:** Chat/interaction history with Melvin assistant  
**Fields:** sessionId, role (user/assistant), content, timestamp, module, context  
**Use:** Conversation continuity, context recall

### MelvinShiftNote
**Purpose:** Daily shift notes and dispatch events  
**Fields:** date, shiftType (AM/PM), note, author, driverRefs, plantRefs, createdAt  
**Use:** Shift handoff, historical review, pattern detection

### MelvinCustomerCall
**Purpose:** Customer Service Representative call log (primary CSR record)  
**Fields:** time, customerName, company, phone, jobName, jobAddress, orderNumber, topic, requestType, urgency, status, assignedTo, notes, followUpTime, resolvedAt  
**Use:** Written record of every call, follow-up tracking, complaint trails

### MelvinOrderChange
**Purpose:** Order change tracker — who changed what, when, who approved  
**Fields:** orderNumber, customerName, jobName, originalTime, newTime, originalYards, newYards, mixDesign, slump, spacing, requestedBy, approvedBy, changeReason, status, timestamp, notes  
**Use:** Protect the office, audit order changes, prove notification chain

### MelvinMixerStatus
**Purpose:** Live and historical mixer truck status  
**Fields:** truckNumber, driverName, currentOrder, nextOrder, plant, loadStatus, ticketNumber, yards, mixDesign, slump, jobAddress, eta, delayReason, notes, updatedAt  
**Use:** Dispatch board state, utilization, delay analysis

### MelvinIssue
**Purpose:** Complaints and operational issues  
**Fields:** date, customerName, jobName, orderNumber, issueType, severity, description, immediateAction, whoWasNotified, followUpNeeded, followUpDate, status, resolution  
**Use:** Complaint resolution, follow-up enforcement, recurring-problem detection

### MelvinCallback
**Purpose:** Callback queue — keep follow-ups visible  
**Fields:** dueTime, customerName, company, phone, reason, relatedOrderNumber, status, notes, completedAt  
**Use:** Never drop a callback, due/overdue tracking

### MelvinDispatchRecord
**Purpose:** Audit log of every dispatched route  
**Fields:** date, driverName, crew, plant, steps (JSON), startTime, opts (JSON), createdAt  
**Use:** Fairness tracking, historical reporting, dispute resolution

### MelvinRepairRecord
**Purpose:** Truck repair tickets  
**Fields:** truckId, driverName, description, status, priority, reportedDate, resolvedDate, notes  
**Use:** Fleet health, repair history, maintenance scheduling

### MelvinWeatherLog
**Purpose:** Weather observations and dispatch risk scores  
**Fields:** date, location, high, low, condition, precipPct, windMph, dispatchRisk, riskReason  
**Use:** Pattern analysis, seasonal planning

### MelvinAuditLog
**Purpose:** All overrides, substitutions, and manual changes  
**Fields:** timestamp, action, actor, original, override, reason, module  
**Use:** Compliance, dispute resolution, pattern detection

### MelvinBriefing
**Purpose:** Generated morning briefings  
**Fields:** date, text, generatedAt, opts (JSON)  
**Use:** Historical briefing archive, search

### MelvinPlan
**Purpose:** Work plans, goals, action items  
**Fields:** title, content, status, priority, dueDate, tags, createdAt, updatedAt  
**Use:** Planning module (Phase 3+)

---

## Migration Path

1. Phase 1: localStorage only
2. Phase 2: FastAPI backend with SQLite/Postgres — data moves out of localStorage
3. Phase 3: Weaviate collections added for semantic memory; FastAPI proxies writes to both
4. Phase 4: Full RAG — Melvin can query its own history to answer questions
