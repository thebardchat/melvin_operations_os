// Seed repair records for MVP

export const REPAIR_STATUSES = ['open', 'in-progress', 'resolved', 'deferred']
export const REPAIR_PRIORITIES = ['low', 'medium', 'high', 'critical']

export const SEED_REPAIRS = [
  {
    id: 'r001',
    truck: 'T-12',
    driver: 'Marcus',
    description: 'Right rear brake grinding — needs inspection before dispatch',
    status: 'open',
    priority: 'critical',
    reportedDate: '2026-05-20',
    resolvedDate: null,
    notes: 'Do not dispatch until cleared by maintenance',
  },
  {
    id: 'r002',
    truck: 'T-07',
    driver: 'Charlie',
    description: 'Cab heater not working — driver reported 5/18',
    status: 'in-progress',
    priority: 'low',
    reportedDate: '2026-05-18',
    resolvedDate: null,
    notes: 'Part ordered, ETA 5/23',
  },
  {
    id: 'r003',
    truck: 'T-04',
    driver: 'Roberto',
    description: 'Check engine light — OBD scan needed',
    status: 'open',
    priority: 'medium',
    reportedDate: '2026-05-21',
    resolvedDate: null,
    notes: '',
  },
  {
    id: 'r004',
    truck: 'T-09',
    driver: 'Tim',
    description: 'Windshield crack — passenger side, minor visibility impact',
    status: 'deferred',
    priority: 'low',
    reportedDate: '2026-05-10',
    resolvedDate: null,
    notes: 'Waiting for insurance approval',
  },
  {
    id: 'r005',
    truck: 'T-03',
    driver: 'CHRIS P',
    description: 'Tire rotation overdue — 45k miles since last service',
    status: 'resolved',
    priority: 'medium',
    reportedDate: '2026-05-15',
    resolvedDate: '2026-05-19',
    notes: 'Completed by shop on 5/19',
  },
]

export const STATUS_COLORS = {
  open: '#D45555',
  'in-progress': '#D4A03C',
  resolved: '#5BA66E',
  deferred: '#7A746E',
}

export const PRIORITY_COLORS = {
  low: '#7A746E',
  medium: '#D4A03C',
  high: '#D4745F',
  critical: '#D45555',
}
