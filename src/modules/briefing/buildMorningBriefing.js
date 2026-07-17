import { getDayName, formatDate } from '../../utils/date.js'
import { getBPDrivers, isTueFri } from '../legacy-dump-dispatch/engine/rotation.js'
import { buildTodaySnapshot } from '../today/todayModel.js'

/**
 * Build the morning briefing as plain text — suitable for copy/paste,
 * push notification, TTS, or a daily log.
 */
export function buildMorningBriefing(dateStr, opts = {}) {
  const dayName = getDayName(dateStr)
  const formattedDate = formatDate(dateStr)
  const tf = isTueFri(dateStr)
  const bpDrivers = getBPDrivers(dateStr)
  const snap = buildTodaySnapshot(opts.data || {})

  const L = []
  const hr = () => L.push('──────────────────────────────')

  L.push('MELVIN MORNING BRIEFING')
  L.push(formattedDate)
  L.push('Pedal to the Medal — keep moving, stay professional, document everything.')
  L.push('')

  L.push(`WEATHER RISK: ${String(snap.weather.dispatchRisk).toUpperCase()}`)
  hr()
  L.push(`${snap.weather.condition} · ${snap.weather.high}°/${snap.weather.low}° · precip ${snap.weather.precip ?? snap.weather.precipitationChance ?? '?'}%`)
  if (snap.weather.riskReason) L.push(`Note: ${snap.weather.riskReason}`)
  L.push('')

  L.push(`OPEN CUSTOMER CALLS (${snap.openCalls.length})`)
  hr()
  if (snap.openCalls.length) {
    snap.openCalls.forEach(c => L.push(`  • ${c.time} ${c.company} — ${c.requestType}: ${c.topic} [${c.status}]`))
  } else L.push('  None open.')
  L.push('')

  L.push(`CALLBACKS DUE (${snap.activeCallbacks.length}, ${snap.overdueCallbacks.length} overdue)`)
  hr()
  if (snap.activeCallbacks.length) {
    snap.activeCallbacks.forEach(cb => L.push(`  • ${cb.dueTime} ${cb.company} — ${cb.reason} [${cb.status}]`))
  } else L.push('  Queue clear.')
  L.push('')

  L.push(`ORDER CHANGES (${snap.openOrderChanges.length} open)`)
  hr()
  if (snap.openOrderChanges.length) {
    snap.openOrderChanges.forEach(oc => L.push(`  • ${oc.orderNumber} ${oc.customerName} — ${oc.changeReason} [${oc.status}]`))
  } else L.push('  None open.')
  L.push('')

  L.push(`OPEN COMPLAINTS / ISSUES (${snap.openIssues.length})`)
  hr()
  if (snap.openIssues.length) {
    snap.openIssues.forEach(i => L.push(`  • ${i.issueType} (${i.severity}) — ${i.jobName}: ${i.description} [${i.status}]`))
  } else L.push('  None open.')
  L.push('')

  L.push('MIXER AVAILABILITY')
  hr()
  L.push(`  Available: ${snap.mixersAvailable.length} · Down: ${snap.mixersDown.length}`)
  if (snap.mixersDown.length) snap.mixersDown.forEach(m => L.push(`  • DOWN: ${m.truckNumber} — ${m.delayReason || 'see repairs'}`))
  L.push('')

  L.push('PLANT / TRUCK ISSUES')
  hr()
  if (snap.plantIssues.length) snap.plantIssues.forEach(p => L.push(`  • ${p}`))
  else L.push('  None reported.')
  L.push('')

  L.push('LEGACY DUMP DISPATCH')
  hr()
  L.push(`  Day: ${dayName}${tf ? ' · TUE/FRI protocol active' : ''}`)
  L.push(`  Bridgeport rotation: ${bpDrivers.length ? bpDrivers.join(', ') : 'Fixed BP crew only'}`)
  if (opts.down && opts.down.length) L.push(`  Down plants (haul): ${opts.down.join(', ')}`)
  L.push('')

  L.push('OPERATIONAL NOTES')
  hr()
  snap.quickNotes.forEach(n => L.push(`  • ${n}`))
  if (snap.carried.length) {
    L.push('  Carried from yesterday:')
    snap.carried.forEach(c => L.push(`    - ${c}`))
  }
  L.push('')

  L.push('Melvin is ready.')
  return L.join('\n')
}

/**
 * End-of-day closeout — scaffold for the EOD report.
 */
export function buildEndOfDayCloseout(dateStr, opts = {}) {
  const snap = buildTodaySnapshot(opts.data || {})
  const L = []
  L.push('MELVIN END-OF-DAY CLOSEOUT')
  L.push(formatDate(dateStr))
  L.push('')
  L.push(`Open calls remaining: ${snap.openCalls.length}`)
  L.push(`Callbacks still active: ${snap.activeCallbacks.length}`)
  L.push(`Order changes not completed: ${snap.openOrderChanges.length}`)
  L.push(`Open issues to carry: ${snap.openIssues.length}`)
  L.push('')
  L.push('Unresolved items carried to tomorrow:')
  snap.carried.forEach(c => L.push(`  - ${c}`))
  L.push('')
  L.push('TODO: Phase 2 — capture per-shift closeout notes and persist the carry list.')
  return L.join('\n')
}

/**
 * Weekly operations report — scaffold.
 */
export function buildWeeklyReport() {
  return [
    'MELVIN WEEKLY OPERATIONS REPORT',
    '',
    'TODO: Phase 2 — aggregate calls, callbacks, order changes, issues, and',
    'mixer utilization across the week into a weekly operations summary.',
  ].join('\n')
}
