import { DED_POOL } from '../../../tenants/srm-north-alabama/drivers.js'

/**
 * Create a daily fairness snapshot from route assignments
 * routeMap: { driverName -> routeSteps[] }
 */
export function createDailyFairnessSnapshot(routeMap, dateStr) {
  const counts = {}
  for (const [name, steps] of Object.entries(routeMap)) {
    counts[name] = steps.filter(s => s.type === 'load').length
  }
  return {
    date: dateStr,
    loadCounts: counts,
    createdAt: new Date().toISOString(),
  }
}

/**
 * Get load counts per driver from a fairness snapshot
 */
export function getDriverLoadCounts(snapshot) {
  return snapshot?.loadCounts || {}
}

/**
 * Get fleet average loads across all active drivers
 */
export function getFleetAverage(snapshot) {
  const counts = getDriverLoadCounts(snapshot)
  const values = Object.values(counts)
  if (!values.length) return 0
  return values.reduce((a, b) => a + b, 0) / values.length
}

/**
 * Get delta for a single driver vs fleet average
 */
export function getDriverDelta(driverName, snapshot) {
  const counts = getDriverLoadCounts(snapshot)
  const avg = getFleetAverage(snapshot)
  const val = counts[driverName] ?? 0
  return val - avg
}

/**
 * Flag drivers more than 1.5 loads above fleet average (burnout risk)
 */
export function getBurnoutFlags(snapshot) {
  const avg = getFleetAverage(snapshot)
  const counts = getDriverLoadCounts(snapshot)
  return Object.entries(counts)
    .filter(([, v]) => v > avg + 1.5)
    .map(([name]) => name)
}

/**
 * Log an override entry for audit trail
 */
export function createOverrideLogEntry(driverName, originalPlant, overridePlant, reason) {
  return {
    driver: driverName,
    original: originalPlant,
    override: overridePlant,
    reason: reason || 'manual',
    timestamp: new Date().toISOString(),
  }
}

/**
 * Suggest the next driver from pool based on lowest load count
 */
export function suggestNextDriver(snapshot, excludeNames = []) {
  const counts = getDriverLoadCounts(snapshot)
  const candidates = DED_POOL.filter(n => !excludeNames.includes(n))
  if (!candidates.length) return null
  return candidates.reduce((best, name) => {
    const bestCount = counts[best] ?? 0
    const nameCount = counts[name] ?? 0
    return nameCount < bestCount ? name : best
  }, candidates[0])
}
