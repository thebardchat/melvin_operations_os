// Customer Call Log model — the core CSR record.
// PUBLIC-SAFE: sample data only, placeholder phone tokens.

export const REQUEST_TYPES = [
  'New order',
  'Order change',
  'Will-call',
  'Cancel order',
  'Add-on load',
  'Pour time change',
  'Complaint',
  'Driver ETA request',
  'Ticket/POD request',
  'Pricing question',
  'Plant issue',
  'Other',
]

export const CALL_STATUSES = [
  'Open',
  'Waiting on customer',
  'Waiting on dispatch',
  'Waiting on plant',
  'Waiting on driver',
  'Resolved',
  'Carried to tomorrow',
]

export const URGENCIES = ['Low', 'Normal', 'High', 'Critical']

export const URGENCY_VARIANT = {
  Low: 'muted',
  Normal: 'blue',
  High: 'amber',
  Critical: 'red',
}

export const CALL_STATUS_VARIANT = {
  Open: 'amber',
  'Waiting on customer': 'blue',
  'Waiting on dispatch': 'blue',
  'Waiting on plant': 'blue',
  'Waiting on driver': 'blue',
  Resolved: 'green',
  'Carried to tomorrow': 'muted',
}

const OPEN_STATES = new Set([
  'Open',
  'Waiting on customer',
  'Waiting on dispatch',
  'Waiting on plant',
  'Waiting on driver',
  'Carried to tomorrow',
])

export function isCallOpen(call) {
  return OPEN_STATES.has(call.status)
}

/**
 * Build an empty customer-call record.
 */
export function newCustomerCall(overrides = {}) {
  return {
    id: '',
    time: '',
    customerName: '',
    company: '',
    phone: 'CUSTOMER_PHONE',
    jobName: '',
    jobAddress: '',
    orderNumber: '',
    topic: '',
    requestType: 'Other',
    urgency: 'Normal',
    status: 'Open',
    assignedTo: 'Shane (CSR)',
    notes: '',
    followUpTime: '',
    resolvedAt: null,
    ...overrides,
  }
}

export const SEED_CALLS = [
  {
    id: 'call-001',
    time: '06:42',
    customerName: 'Sample Contact',
    company: 'Red Clay Homes',
    phone: 'CUSTOMER_PHONE',
    jobName: 'Maple Ridge Lot 14',
    jobAddress: 'Sample Job Address',
    orderNumber: 'SO-10241',
    topic: 'Wants to move first load earlier',
    requestType: 'Pour time change',
    urgency: 'High',
    status: 'Waiting on dispatch',
    assignedTo: 'Shane (CSR)',
    notes: 'Crew on site early — asked to pull 8:00 up to 7:00. Need dispatch + plant OK.',
    followUpTime: '07:15',
    resolvedAt: null,
  },
  {
    id: 'call-002',
    time: '07:05',
    customerName: 'Sample Contact',
    company: 'Valley Flatwork',
    phone: 'CUSTOMER_PHONE',
    jobName: 'Eastgate Driveway',
    jobAddress: 'Sample Job Address',
    orderNumber: 'SO-10238',
    topic: 'Will-call, not ready yet',
    requestType: 'Will-call',
    urgency: 'Normal',
    status: 'Open',
    assignedTo: 'Shane (CSR)',
    notes: 'Forms not set. Customer will call to release. Keep visible.',
    followUpTime: '09:30',
    resolvedAt: null,
  },
  {
    id: 'call-003',
    time: '07:20',
    customerName: 'Sample Contact',
    company: 'North Alabama Framing',
    phone: 'CUSTOMER_PHONE',
    jobName: 'Cedar Crossing Slab',
    jobAddress: 'Sample Job Address',
    orderNumber: 'SO-10240',
    topic: 'Where is my truck?',
    requestType: 'Driver ETA request',
    urgency: 'Normal',
    status: 'Resolved',
    assignedTo: 'Shane (CSR)',
    notes: 'Gave honest ETA from Mixer 003 — 20 min out. Customer satisfied.',
    followUpTime: '',
    resolvedAt: '07:24',
  },
  {
    id: 'call-004',
    time: '07:48',
    customerName: 'Sample Contact',
    company: 'Sample Builder Co.',
    phone: 'CUSTOMER_PHONE',
    jobName: 'Industrial Pad B',
    jobAddress: 'Sample Job Address',
    orderNumber: 'SO-10244',
    topic: 'Add-on load — short by 3 yards',
    requestType: 'Add-on load',
    urgency: 'High',
    status: 'Waiting on plant',
    assignedTo: 'Shane (CSR)',
    notes: 'Pour came up short. Need 3 more yds same mix. Checking plant capacity.',
    followUpTime: '08:10',
    resolvedAt: null,
  },
]
