// Risk flags surfaced on the Today Board.
// Each flag: { key, label, severity }  severity: 'high' | 'medium' | 'low'

import { isCallOpen } from '../customer-service/customerCallModel.js'
import { isCallbackActive, isCallbackOverdue } from '../customer-service/callbackModel.js'
import { isOrderChangeOpen } from '../orders/orderChangeModel.js'
import { isIssueOpen } from '../issues/issueModel.js'
import { isMixerDown } from '../mixer-dispatch/mixerStatusModel.js'

export const RISK_FLAG_CATALOG = [
  'First round not confirmed',
  'Customer asked for change',
  'Will-call still open',
  'Truck running late',
  'Plant delay',
  'Weather risk',
  'Large pour',
  'High-priority customer',
  'Complaint open',
  'Needs callback',
  'Ticket/POD needed',
  'Unresolved issue carried from yesterday',
]

const sev = (label, severity) => ({ label, severity })

/**
 * Compute the active risk flags from current operating data.
 * Returns an array of { label, severity }.
 */
export function computeRiskFlags({ calls = [], callbacks = [], orderChanges = [], issues = [], mixers = [], weather = null }) {
  const flags = []

  if (orderChanges.some(oc => oc.status === 'Requested')) {
    flags.push(sev('Customer asked for change', 'medium'))
  }
  if (calls.some(c => c.requestType === 'Will-call' && isCallOpen(c))) {
    flags.push(sev('Will-call still open', 'medium'))
  }
  if (mixers.some(m => (m.delayReason && m.loadStatus !== 'Down') || m.requestType === 'Driver ETA request')) {
    flags.push(sev('Truck running late', 'high'))
  }
  if (mixers.some(m => m.delayReason && /traffic|late/i.test(m.delayReason))) {
    // covered above; keep single high flag
  }
  if (issues.some(i => i.issueType === 'Plant delay' && isIssueOpen(i))) {
    flags.push(sev('Plant delay', 'high'))
  }
  if (weather && (weather.dispatchRisk === 'medium' || weather.dispatchRisk === 'high')) {
    flags.push(sev('Weather risk', weather.dispatchRisk === 'high' ? 'high' : 'medium'))
  }
  if (issues.some(i => (i.issueType === 'Customer upset' || i.issueType === 'Late truck' || i.severity === 'Critical') && isIssueOpen(i))) {
    flags.push(sev('Complaint open', 'high'))
  }
  if (callbacks.some(isCallbackOverdue)) {
    flags.push(sev('Needs callback', 'high'))
  } else if (callbacks.some(isCallbackActive)) {
    flags.push(sev('Needs callback', 'medium'))
  }
  if (callbacks.some(cb => cb.reason === 'Send ticket/POD' && isCallbackActive(cb)) ||
      calls.some(c => c.requestType === 'Ticket/POD request' && isCallOpen(c))) {
    flags.push(sev('Ticket/POD needed', 'medium'))
  }
  if (mixers.some(isMixerDown)) {
    flags.push(sev('Mixer down', 'high'))
  }

  // De-dup by label, keep highest severity.
  const order = { high: 3, medium: 2, low: 1 }
  const byLabel = new Map()
  for (const f of flags) {
    const cur = byLabel.get(f.label)
    if (!cur || order[f.severity] > order[cur.severity]) byLabel.set(f.label, f)
  }
  return [...byLabel.values()].sort((a, b) => order[b.severity] - order[a.severity])
}

export const RISK_SEVERITY_VARIANT = {
  high: 'red',
  medium: 'amber',
  low: 'blue',
}
