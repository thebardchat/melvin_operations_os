import { SUBS, ALL_PLANTS } from '../../../tenants/srm-north-alabama/index.js'
import { ALL_DRIVERS } from '../../../tenants/srm-north-alabama/drivers.js'

/**
 * Given a plant code and a set of down plants, resolve the best available plant.
 * Returns the original code if not down, otherwise returns first available sub.
 */
export function resolvePlant(code, downSet = new Set()) {
  if (!downSet.has(code)) return code
  const subs = SUBS[code] || []
  for (const sub of subs) {
    if (!downSet.has(sub)) return sub
  }
  return code // fallback to original even if down
}

/**
 * Build a sub map: { originalCode -> resolvedCode } for all plants in the down set
 */
export function buildSubMap(downCodes = []) {
  const downSet = new Set(downCodes)
  const map = {}
  for (const code of downCodes) {
    map[code] = resolvePlant(code, downSet)
  }
  return map
}

/**
 * Return all drivers whose default plant assignment is affected by any down plant
 */
export function getAffectedDrivers(downCodes = []) {
  const downSet = new Set(downCodes)
  return ALL_DRIVERS.filter(d => downSet.has(d.crew))
}

/**
 * Get plant name from code
 */
export function getPlantName(code) {
  const plant = ALL_PLANTS.find(p => p.code === code)
  return plant ? plant.name : code
}
