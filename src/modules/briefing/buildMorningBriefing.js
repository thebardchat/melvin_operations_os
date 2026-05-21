import { getDayName, formatDate } from '../../utils/date.js'
import { ALL_DRIVERS } from '../../tenants/srm-north-alabama/drivers.js'
import { getBPDrivers, isTueFri } from '../dispatch/engine/rotation.js'

/**
 * Build the morning briefing text for a given date
 */
export function buildMorningBriefing(dateStr, opts = {}) {
  const dayName = getDayName(dateStr)
  const formattedDate = formatDate(dateStr)
  const tf = isTueFri(dateStr)
  const bpDrivers = getBPDrivers(dateStr)

  const lines = []

  lines.push(`MELVIN MORNING BRIEFING`)
  lines.push(`${formattedDate}`)
  lines.push(``)

  lines.push(`SHIFT OVERVIEW`)
  lines.push(`──────────────`)
  lines.push(`Day: ${dayName}`)
  lines.push(`Active drivers: ${ALL_DRIVERS.length}`)
  lines.push(`Tue/Fri protocol: ${tf ? 'YES — TF routes active' : 'No'}`)
  lines.push(``)

  lines.push(`BRIDGEPORT ROTATION`)
  lines.push(`──────────────────`)
  if (bpDrivers.length) {
    lines.push(`On Bridgeport today: ${bpDrivers.join(', ')}`)
  } else {
    lines.push(`Bridgeport: Fixed crew only (Stacey, Alexis)`)
  }
  lines.push(``)

  lines.push(`CREW SUMMARY`)
  lines.push(`────────────`)
  const crews = {}
  ALL_DRIVERS.forEach(d => {
    if (!crews[d.crew]) crews[d.crew] = []
    crews[d.crew].push(d.name)
  })
  Object.entries(crews).forEach(([crew, names]) => {
    lines.push(`  ${crew}: ${names.join(', ')}`)
  })
  lines.push(``)

  if (opts.down && opts.down.length) {
    lines.push(`DOWN PLANTS`)
    lines.push(`───────────`)
    opts.down.forEach(c => lines.push(`  - ${c} (DOWN)`))
    lines.push(``)
  }

  lines.push(`CONTACTS`)
  lines.push(`────────`)
  lines.push(`  Shane:   256-402-5176`)
  lines.push(`  Anthony: 256-924-4328`)
  lines.push(``)

  lines.push(`— Melvin Operations OS v0.1.0`)

  return lines.join('\n')
}
