// Order Change Tracker model — protects the office with a written change trail.
// Answers: Who changed that? When? Who approved it? Was dispatch/plant/customer told?

export const ORDER_CHANGE_STATUSES = [
  'Requested',
  'Approved',
  'Rejected',
  'Entered',
  'Dispatched',
  'Completed',
  'Canceled',
]

export const ORDER_CHANGE_STATUS_VARIANT = {
  Requested: 'amber',
  Approved: 'blue',
  Rejected: 'red',
  Entered: 'blue',
  Dispatched: 'brand',
  Completed: 'green',
  Canceled: 'muted',
}

const OPEN_STATES = new Set(['Requested', 'Approved', 'Entered', 'Dispatched'])

export function isOrderChangeOpen(oc) {
  return OPEN_STATES.has(oc.status)
}

export function newOrderChange(overrides = {}) {
  return {
    id: '',
    orderNumber: '',
    customerName: '',
    jobName: '',
    jobAddress: '',
    originalTime: '',
    newTime: '',
    originalYards: '',
    newYards: '',
    mixDesign: '',
    slump: '',
    spacing: '',
    requestedBy: '',
    approvedBy: '',
    changeReason: '',
    status: 'Requested',
    timestamp: '',
    notes: '',
    ...overrides,
  }
}

export const SEED_ORDER_CHANGES = [
  {
    id: 'oc-001',
    orderNumber: 'SO-10241',
    customerName: 'Red Clay Homes',
    jobName: 'Maple Ridge Lot 14',
    jobAddress: 'Sample Job Address',
    originalTime: '08:00',
    newTime: '07:00',
    originalYards: '24',
    newYards: '24',
    mixDesign: '4000 PSI',
    slump: '5',
    spacing: '15 min',
    requestedBy: 'Customer (Sample Contact)',
    approvedBy: '',
    changeReason: 'Crew on site early, wants concrete sooner',
    status: 'Requested',
    timestamp: '06:44',
    notes: 'Pending dispatch + plant confirmation.',
  },
  {
    id: 'oc-002',
    orderNumber: 'SO-10244',
    customerName: 'Sample Builder Co.',
    jobName: 'Industrial Pad B',
    jobAddress: 'Sample Job Address',
    originalTime: '07:30',
    newTime: '07:30',
    originalYards: '40',
    newYards: '43',
    mixDesign: '5000 PSI',
    slump: '4',
    spacing: 'continuous',
    requestedBy: 'Customer (Sample Contact)',
    approvedBy: 'Dispatch Lead',
    changeReason: 'Pour came up short by 3 yards',
    status: 'Approved',
    timestamp: '07:50',
    notes: 'Add-on load approved. Waiting on plant to batch.',
  },
  {
    id: 'oc-003',
    orderNumber: 'SO-10239',
    customerName: 'Valley Flatwork',
    jobName: 'Eastgate Driveway',
    jobAddress: 'Sample Job Address',
    originalTime: '10:00',
    newTime: '',
    originalYards: '12',
    newYards: '0',
    mixDesign: '3000 PSI',
    slump: '5',
    spacing: '',
    requestedBy: 'Customer (Sample Contact)',
    approvedBy: 'Dispatch Lead',
    changeReason: 'Rain in forecast — customer canceled',
    status: 'Canceled',
    timestamp: '06:30',
    notes: 'Customer + dispatch + plant all notified. Closed clean.',
  },
]
