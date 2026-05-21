// SRM Concrete North Alabama — Standard Operating Procedures (scaffold)

export const MISSION = 'Deliver every load on time, every driver home safe, every customer served with excellence.'
export const VALUES = [
  'Safety first — no load is worth an injury',
  'Communication — call before it becomes a problem',
  'Accountability — own your route, own your day',
  'Consistency — do it right every time, not just when watched',
]
export const MANTRA = 'Pedal to the metal. Faith over fear.'

export const SOPS = [
  {
    id: 'sop-001',
    title: 'Pre-Dispatch Safety Check',
    category: 'Safety',
    summary: 'Driver walks truck before departure — tires, lights, fluids, load security.',
    status: 'active',
    steps: [
      'Check all tire pressures and condition',
      'Test headlights, tail lights, and turn signals',
      'Verify fluid levels (oil, coolant, hydraulic)',
      'Confirm load is secured and gates are locked',
      'Sign off on pre-trip form before leaving yard',
    ],
  },
  {
    id: 'sop-002',
    title: '518 Scottsboro Dispatch Protocol',
    category: 'Dispatch',
    summary: 'Call Shane AND Anthony before sending any driver to plant 518.',
    status: 'active',
    steps: [
      'Check availability at 518 via Shane (256-402-5176)',
      'Confirm with Anthony (256-924-4328)',
      'Get ETA from plant coordinator',
      'Only then dispatch driver — never send blind to 518',
    ],
  },
  {
    id: 'sop-003',
    title: 'Down Plant Substitution',
    category: 'Dispatch',
    summary: 'When a plant is down, follow the substitution chain in the system.',
    status: 'active',
    steps: [
      'Mark plant as DOWN in dispatch board',
      'System auto-resolves to first available substitute',
      'Verify substitute plant has capacity before dispatching',
      'Notify affected drivers of plant change',
    ],
  },
  {
    id: 'sop-004',
    title: 'End of Shift Check',
    category: 'Operations',
    summary: 'Ensure no driver is dispatched within 90 minutes of shift end without confirmation.',
    status: 'active',
    steps: [
      'Track quarry close time (4:00 PM)',
      'Apply 90-minute end-of-shift buffer',
      'Confirm with driver before sending last run',
      'Log final run in dispatch record',
    ],
  },
  {
    id: 'sop-005',
    title: 'Truck Repair Reporting',
    category: 'Maintenance',
    summary: 'Any mechanical issue must be reported before dispatch, not after.',
    status: 'draft',
    steps: [
      'Driver reports issue to dispatcher immediately',
      'Log in repair tracker with priority level',
      'Do not dispatch truck flagged as critical until cleared',
      'Follow up with maintenance shop for ETA',
    ],
  },
]

export const SOP_CATEGORIES = ['Safety', 'Dispatch', 'Operations', 'Maintenance']
