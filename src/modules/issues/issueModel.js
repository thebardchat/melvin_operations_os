// Issues / Complaints model — every problem gets an owner, action, and follow-up.

export const ISSUE_TYPES = [
  'Late truck',
  'Wrong mix',
  'Short load',
  'Rejected load',
  'Hot load',
  'Cold joint risk',
  'Plant delay',
  'Driver issue',
  'Ticket issue',
  'Customer upset',
  'Safety concern',
  'Other',
]

export const ISSUE_SEVERITIES = ['Low', 'Medium', 'High', 'Critical']

export const ISSUE_STATUSES = ['Open', 'Watching', 'Waiting on someone', 'Resolved', 'Carried to tomorrow']

export const ISSUE_SEVERITY_VARIANT = {
  Low: 'muted',
  Medium: 'amber',
  High: 'brand',
  Critical: 'red',
}

export const ISSUE_STATUS_VARIANT = {
  Open: 'red',
  Watching: 'amber',
  'Waiting on someone': 'blue',
  Resolved: 'green',
  'Carried to tomorrow': 'muted',
}

const OPEN_STATES = new Set(['Open', 'Watching', 'Waiting on someone', 'Carried to tomorrow'])

export function isIssueOpen(issue) {
  return OPEN_STATES.has(issue.status)
}

export function newIssue(overrides = {}) {
  return {
    id: '',
    date: '',
    customerName: '',
    jobName: '',
    orderNumber: '',
    issueType: 'Other',
    severity: 'Medium',
    description: '',
    immediateAction: '',
    whoWasNotified: '',
    followUpNeeded: true,
    followUpDate: '',
    status: 'Open',
    resolution: '',
    ...overrides,
  }
}

export const SEED_ISSUES = [
  {
    id: 'iss-001',
    date: '2026-06-30',
    customerName: 'Palmer Commons (Driver 06)',
    jobName: 'Palmer Commons',
    orderNumber: 'SO-10243',
    issueType: 'Late truck',
    severity: 'Medium',
    description: 'Mixer 006 stuck in traffic on US-72, ~10 min late to pour.',
    immediateAction: 'Called customer with honest ETA, offered to stage next load.',
    whoWasNotified: 'Customer, Dispatch',
    followUpNeeded: true,
    followUpDate: '2026-06-30',
    status: 'Watching',
    resolution: '',
  },
  {
    id: 'iss-002',
    date: '2026-06-30',
    customerName: 'Sample Builder Co.',
    jobName: 'Industrial Pad B',
    orderNumber: 'SO-10244',
    issueType: 'Short load',
    severity: 'High',
    description: 'Pour came up 3 yards short of plan.',
    immediateAction: 'Logged add-on order change, confirming plant capacity.',
    whoWasNotified: 'Dispatch, Plant',
    followUpNeeded: true,
    followUpDate: '2026-06-30',
    status: 'Waiting on someone',
    resolution: '',
  },
  {
    id: 'iss-003',
    date: '2026-06-29',
    customerName: 'North Alabama Framing',
    jobName: 'Cedar Crossing Slab',
    orderNumber: 'SO-10240',
    issueType: 'Ticket issue',
    severity: 'Low',
    description: 'Customer needed POD copy for yesterday\'s pour.',
    immediateAction: 'Emailed POD same morning.',
    whoWasNotified: 'Customer',
    followUpNeeded: false,
    followUpDate: '',
    status: 'Resolved',
    resolution: 'POD sent and confirmed received.',
  },
]
