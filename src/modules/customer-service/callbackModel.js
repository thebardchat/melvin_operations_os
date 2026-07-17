// Callback Queue model — keeps follow-ups visible so nothing gets dropped.

export const CALLBACK_REASONS = [
  'Call customer back',
  'Confirm pour time',
  'Check if job is ready',
  'Get updated yardage',
  'Send ticket/POD',
  'Follow up on complaint',
  'Confirm cancellation',
  'Confirm will-call',
  'Other',
]

export const CALLBACK_STATUSES = ['Open', 'Due soon', 'Overdue', 'Completed', 'Canceled']

export const CALLBACK_STATUS_VARIANT = {
  Open: 'blue',
  'Due soon': 'amber',
  Overdue: 'red',
  Completed: 'green',
  Canceled: 'muted',
}

const ACTIVE_STATES = new Set(['Open', 'Due soon', 'Overdue'])

export function isCallbackActive(cb) {
  return ACTIVE_STATES.has(cb.status)
}

export function isCallbackOverdue(cb) {
  return cb.status === 'Overdue'
}

export function newCallback(overrides = {}) {
  return {
    id: '',
    dueTime: '',
    customerName: '',
    company: '',
    phone: 'CUSTOMER_PHONE',
    reason: 'Call customer back',
    relatedOrderNumber: '',
    status: 'Open',
    notes: '',
    completedAt: null,
    ...overrides,
  }
}

export const SEED_CALLBACKS = [
  {
    id: 'cb-001',
    dueTime: '07:15',
    customerName: 'Sample Contact',
    company: 'Red Clay Homes',
    phone: 'CUSTOMER_PHONE',
    reason: 'Confirm pour time',
    relatedOrderNumber: 'SO-10241',
    status: 'Overdue',
    notes: 'Confirm the 7:00 pull-up once dispatch approves.',
    completedAt: null,
  },
  {
    id: 'cb-002',
    dueTime: '08:10',
    customerName: 'Sample Contact',
    company: 'Sample Builder Co.',
    phone: 'CUSTOMER_PHONE',
    reason: 'Get updated yardage',
    relatedOrderNumber: 'SO-10244',
    status: 'Due soon',
    notes: 'Confirm 3 yd add-on once plant confirms capacity.',
    completedAt: null,
  },
  {
    id: 'cb-003',
    dueTime: '09:30',
    customerName: 'Sample Contact',
    company: 'Valley Flatwork',
    phone: 'CUSTOMER_PHONE',
    reason: 'Confirm will-call',
    relatedOrderNumber: 'SO-10238',
    status: 'Open',
    notes: 'Check if forms are set and they are ready to release.',
    completedAt: null,
  },
  {
    id: 'cb-004',
    dueTime: '06:55',
    customerName: 'Sample Contact',
    company: 'North Alabama Framing',
    phone: 'CUSTOMER_PHONE',
    reason: 'Send ticket/POD',
    relatedOrderNumber: 'SO-10240',
    status: 'Completed',
    notes: 'POD emailed. Done.',
    completedAt: '06:58',
  },
]
