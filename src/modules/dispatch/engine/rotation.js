import {
  BP_GROUPS,
  C507_ROTA,
  C506_ROTA,
  C507_NAMES,
  C519_NAMES,
  C506_NAMES,
} from '../../../tenants/srm-north-alabama/index.js'
import { ROTATION_EPOCH, BP_CYCLE_LENGTH } from '../../../tenants/srm-north-alabama/rotations.js'

/**
 * Get the number of working days (Mon-Sat) between epoch and target date
 */
function workingDaysBetween(epochStr, targetStr) {
  const epoch = new Date(epochStr + 'T00:00:00')
  const target = new Date(targetStr + 'T00:00:00')
  let count = 0
  const cur = new Date(epoch)
  while (cur < target) {
    const day = cur.getDay() // 0=Sun, 6=Sat
    if (day !== 0 && day !== 6) count++ // count Mon-Fri only, skip Sat and Sun
    cur.setDate(cur.getDate() + 1)
  }
  return count
}

/**
 * Get 0-based cycle day index for the given date string "YYYY-MM-DD"
 */
export function getCycleDay(dateStr) {
  return workingDaysBetween(ROTATION_EPOCH, dateStr) % BP_CYCLE_LENGTH
}

/**
 * Get which BP group (A/B/C) is on BP duty for the given date
 */
export function getBPGroup(dateStr) {
  const groups = Object.keys(BP_GROUPS) // ['A','B','C']
  const idx = getCycleDay(dateStr) % groups.length
  return groups[idx]
}

/**
 * Get the list of drivers assigned to BP on the given date
 */
export function getBPDrivers(dateStr) {
  const group = getBPGroup(dateStr)
  return BP_GROUPS[group] || []
}

/**
 * Given a crew array and a rota array, return the plant for the Nth driver in the crew
 * on the given cycle day offset
 */
export function rotaAssign(crewNames, rotaArray, dateStr) {
  const cycleDay = getCycleDay(dateStr)
  return crewNames.map((name, i) => {
    const rotaIdx = (cycleDay + i) % rotaArray.length
    return { name, plant: rotaArray[rotaIdx] }
  })
}

/**
 * Is the given date a Tuesday or Friday?
 */
export function isTueFri(dateStr) {
  const d = new Date(dateStr + 'T00:00:00')
  const day = d.getDay()
  return day === 2 || day === 5 // 2=Tue, 5=Fri
}

/**
 * Is this driver on BP today?
 */
export function driverBPDay(driverName, dateStr) {
  const bpDrivers = getBPDrivers(dateStr)
  return bpDrivers.includes(driverName)
}

/**
 * Build a 7-day BP calendar starting from today
 */
export function getBPCalendar(startDateStr, days = 7) {
  const result = []
  const start = new Date(startDateStr + 'T00:00:00')
  for (let i = 0; i < days; i++) {
    const cur = new Date(start)
    cur.setDate(start.getDate() + i)
    const dateStr = cur.toISOString().split('T')[0]
    const group = getBPGroup(dateStr)
    result.push({
      date: dateStr,
      group,
      drivers: BP_GROUPS[group] || [],
      isTF: isTueFri(dateStr),
    })
  }
  return result
}
