// SRM Concrete North Alabama — Management OS: mission, values, SOPs, and CSR scripts.
// PUBLIC-SAFE: no real phone numbers. Use placeholder contact tokens only.

export const MISSION = 'Be the best ready-mix provider in North Alabama.'
export const VALUES = ['Service', 'Cleanliness', 'Labor', 'Leadership']
export const MANTRA = "If you aren't busy doing something, get busy."
export const MOTTO = 'Pedal to the Medal' // keep moving, stay professional, document everything

export const SOPS = [
  {
    id: 'sop-001',
    title: 'Customer Call Intake',
    category: 'Customer Service',
    summary: 'Every call gets logged — name, company, job, order #, what they need, and a status.',
    status: 'active',
    steps: [
      'Greet, get customer name + company',
      'Capture job name / address and order number',
      'Classify the request (new order, change, will-call, complaint, ETA, ticket/POD…)',
      'Set urgency and a clear status (Open / Waiting on…)',
      'If a callback is needed, add it to the Callback Queue with a due time',
      'Never end a call without a written record',
    ],
  },
  {
    id: 'sop-002',
    title: 'Order Change Checklist',
    category: 'Customer Service',
    summary: 'Protect the office: log who changed what, when, and who approved it.',
    status: 'active',
    steps: [
      'Record original vs new (time, yards, mix, slump)',
      'Note who requested the change and who approved it',
      'Confirm dispatch was told',
      'Confirm plant was told',
      'Confirm customer was confirmed back',
      'Set status: Requested → Approved → Entered → Dispatched',
    ],
  },
  {
    id: 'sop-003',
    title: 'Will-Call Tracking',
    category: 'Dispatch',
    summary: 'Will-calls must stay visible until the customer releases or cancels.',
    status: 'active',
    steps: [
      'Log the will-call as an open customer call',
      'Add a callback to confirm readiness before the pour window',
      'Confirm job is ready before releasing large pours',
      'Update order status the moment the customer calls in',
    ],
  },
  {
    id: 'sop-004',
    title: 'Complaint Handling',
    category: 'Customer Service',
    summary: 'Every complaint gets an owner, an action, and a follow-up status.',
    status: 'active',
    steps: [
      'Log the issue with type and severity',
      'Record the immediate action taken',
      'Note who was notified (dispatch / plant / driver / management)',
      'Set follow-up needed + a follow-up date',
      'Do not mark resolved until the customer is satisfied',
    ],
  },
  {
    id: 'sop-005',
    title: 'End-of-Day Closeout',
    category: 'Operations',
    summary: 'Nothing falls through the cracks overnight.',
    status: 'active',
    steps: [
      'Review all open customer calls',
      'Clear or carry every callback in the queue',
      'Confirm all order changes were entered and dispatched',
      'List unresolved issues and carry them to tomorrow',
      'Note any tickets/PODs still owed',
      'Write the closeout note for the next shift',
    ],
  },
  {
    id: 'sop-006',
    title: 'Plant 518 Coordination',
    category: 'Dispatch',
    summary: 'Call the Dispatch Lead and Plant Manager before committing loads to 518.',
    status: 'active',
    steps: [
      'Check availability with the Dispatch Lead (DISPATCH_LEAD_PHONE)',
      'Confirm with the Plant Manager (PLANT_MANAGER_PHONE)',
      'Get an ETA from the plant coordinator',
      'Only then commit the order — never promise 518 blind',
    ],
  },
]

export const SOP_CATEGORIES = ['Customer Service', 'Dispatch', 'Operations', 'Maintenance']

// Practical phone scripts for the CSR desk. Keep it calm, documented, professional.
export const SCRIPTS = [
  {
    id: 'script-late',
    title: 'Customer is upset about a late truck',
    body: [
      '"I hear you, and I\'m sorry the truck is behind. Let me pull it up right now."',
      'Find the truck on the Mixer Board, get a real ETA, do not guess.',
      '"Here\'s where the truck is and the honest ETA. I\'m logging this and following up myself."',
      'Open an Issue (Late truck), note who you notified, set a follow-up.',
    ],
  },
  {
    id: 'script-change-time',
    title: 'Customer wants to change pour time',
    body: [
      'Confirm order number and the new time.',
      'Log an Order Change: original time vs new time, who requested it.',
      '"Let me confirm dispatch and the plant can hit that — I\'ll call you right back to confirm."',
      'Add a callback to confirm. Do not promise until dispatch/plant approve.',
    ],
  },
  {
    id: 'script-where-truck',
    title: 'Customer asks where the truck is',
    body: [
      'Pull the order on the Mixer Board.',
      'Give load status + honest ETA. If unknown, say you\'ll find out and call back.',
      'Log the call as a Driver ETA request and set status accordingly.',
    ],
  },
  {
    id: 'script-will-call',
    title: 'Need to confirm a will-call',
    body: [
      '"Just confirming — are you ready for us to release the trucks for [job]?"',
      'Confirm yardage and time.',
      'Update the order status and clear the callback.',
    ],
  },
  {
    id: 'script-pod',
    title: 'Ticket / POD follow-up',
    body: [
      'Confirm order number and what they need (ticket, POD, batch weights).',
      'Log it as a Ticket/POD request, set status Waiting on dispatch/plant.',
      'Add a callback to confirm it was sent.',
    ],
  },
]
