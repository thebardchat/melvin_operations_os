// Today Board aggregation model — pulls every CSR/dispatch stream into one snapshot.

import { SEED_CALLS, isCallOpen } from '../customer-service/customerCallModel.js'
import { SEED_CALLBACKS, isCallbackActive, isCallbackOverdue } from '../customer-service/callbackModel.js'
import { SEED_ORDER_CHANGES, isOrderChangeOpen } from '../orders/orderChangeModel.js'
import { SEED_ISSUES, isIssueOpen } from '../issues/issueModel.js'
import { SEED_MIXER_STATUS, isMixerAvailable, isMixerDown } from '../mixer-dispatch/mixerStatusModel.js'
import { WEATHER_SEED } from '../weather/weatherModel.js'
import { computeRiskFlags } from './riskFlags.js'

// Items intentionally carried from yesterday — end-of-day didn't close them.
export const CARRIED_ITEMS = [
  'SO-10231 — POD still owed to Sample Builder Co.',
  'Mixer 004 hydraulic leak — confirm parts ETA with shop',
]

export const QUICK_NOTES_SEED = [
  'Pedal to the Medal — keep moving, document everything.',
  'Confirm Red Clay 7:00 pull-up the second dispatch approves.',
  'Watch the weather window for afternoon pours.',
]

/**
 * Build the full Today snapshot from seed (or supplied) data.
 */
export function buildTodaySnapshot(data = {}) {
  const calls = data.calls || SEED_CALLS
  const callbacks = data.callbacks || SEED_CALLBACKS
  const orderChanges = data.orderChanges || SEED_ORDER_CHANGES
  const issues = data.issues || SEED_ISSUES
  const mixers = data.mixers || SEED_MIXER_STATUS
  const weather = data.weather || WEATHER_SEED[0]

  const openCalls = calls.filter(isCallOpen)
  const activeCallbacks = callbacks.filter(isCallbackActive)
  const overdueCallbacks = callbacks.filter(isCallbackOverdue)
  const openOrderChanges = orderChanges.filter(isOrderChangeOpen)
  const openIssues = issues.filter(isIssueOpen)
  const mixersAvailable = mixers.filter(isMixerAvailable)
  const mixersDown = mixers.filter(isMixerDown)

  // At-risk pours: open order changes + open high/critical issues tied to an order.
  const atRiskPours = [
    ...openOrderChanges
      .filter(oc => oc.status === 'Requested' || oc.newYards !== oc.originalYards)
      .map(oc => ({ orderNumber: oc.orderNumber, job: oc.jobName, why: oc.changeReason })),
    ...openIssues
      .filter(i => i.severity === 'High' || i.severity === 'Critical')
      .map(i => ({ orderNumber: i.orderNumber, job: i.jobName, why: `${i.issueType}: ${i.description}` })),
  ]

  // Plant issues from mixer delay reasons + plant-delay issues.
  const plantIssues = [
    ...mixers.filter(m => isMixerDown(m) && m.delayReason).map(m => `${m.truckNumber}: ${m.delayReason}`),
    ...openIssues.filter(i => i.issueType === 'Plant delay').map(i => `${i.jobName}: ${i.description}`),
  ]

  const riskFlags = computeRiskFlags({ calls, callbacks, orderChanges, issues, mixers, weather })

  const stats = {
    openCalls: openCalls.length,
    callbacksDue: activeCallbacks.length,
    callbacksOverdue: overdueCallbacks.length,
    openOrderChanges: openOrderChanges.length,
    openIssues: openIssues.length,
    mixersAvailable: mixersAvailable.length,
    mixersDown: mixersDown.length,
    atRiskPours: atRiskPours.length,
  }

  return {
    weather,
    openCalls,
    activeCallbacks,
    overdueCallbacks,
    openOrderChanges,
    openIssues,
    mixersAvailable,
    mixersDown,
    atRiskPours,
    plantIssues,
    carried: CARRIED_ITEMS,
    quickNotes: QUICK_NOTES_SEED,
    riskFlags,
    stats,
  }
}

/**
 * Top priorities: a short, ranked action list for the start of the shift.
 */
export function buildTopPriorities(snapshot) {
  const items = []
  snapshot.overdueCallbacks.forEach(cb =>
    items.push({ priority: 'high', text: `Overdue callback: ${cb.company} — ${cb.reason}` }))
  snapshot.openIssues
    .filter(i => i.severity === 'Critical' || i.severity === 'High')
    .forEach(i => items.push({ priority: 'high', text: `${i.issueType}: ${i.jobName} (${i.orderNumber})` }))
  snapshot.openOrderChanges
    .filter(oc => oc.status === 'Requested')
    .forEach(oc => items.push({ priority: 'medium', text: `Confirm change ${oc.orderNumber}: ${oc.changeReason}` }))
  snapshot.openCalls
    .filter(c => c.urgency === 'High' || c.urgency === 'Critical')
    .forEach(c => items.push({ priority: 'medium', text: `${c.requestType}: ${c.company} (${c.orderNumber})` }))
  return items.slice(0, 8)
}
