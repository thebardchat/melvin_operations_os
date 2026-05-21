/**
 * buildRoute.js — SRM North Alabama dispatch route builder
 *
 * Implements the full route logic for all driver types:
 *   - CHRIS P (fixed DUMP route)
 *   - Tim (fixed DUMP route)
 *   - Stacey (fixed BP route with bpFirstRock / check518 / after-BP rock)
 *   - Alexis (2-round short day, 516 chain)
 *   - Curtis (curtisOffice override, BP, or standard)
 *   - C519/C507 crews — TF (Tue/Fri) override
 *   - All other drivers — BP rotation or standard rota
 *   - 514 chain rule throughout
 *   - endOfShift519 check
 */

import {
  C507_NAMES, C519_NAMES, C506_NAMES,
  C507_ROTA, C506_ROTA,
  C519_TUE_PLANTS, C507_TUE_PLANTS,
  BP_FIRST_PLANTS,
  FIXED_BP,
} from '../../../tenants/srm-north-alabama/drivers.js'
import { SUBS } from '../../../tenants/srm-north-alabama/plants.js'
import {
  MH_PLANT, CHEROKEE_PLANT,
  CHAIN_514,
  END_OF_SHIFT_BUFFER,
  QUARRY_CLOSE,
  ALEXIS_ROUNDS, ALEXIS_START_PLANT,
  CURTIS_OFFICE_PLANT,
} from '../../../tenants/srm-north-alabama/rules.js'
import { CONTACTS } from '../../../tenants/srm-north-alabama/contacts.js'
import {
  getDriveTime, timeToMin, LOAD_TIME, UNLOAD_TIME,
} from './travelTimes.js'
import { driverBPDay, getCycleDay, isTueFri } from './rotation.js'
import { resolvePlant } from './substitutions.js'

// ─── helpers ─────────────────────────────────────────────────────────────────

/**
 * Resolve a plant code through down-set substitutions
 * @param {string} code
 * @param {Set<string>} downSet
 * @param {Object} subOverride  { originalCode: overrideCode }
 */
function p(code, downSet = new Set(), subOverride = {}) {
  if (subOverride[code]) return subOverride[code]
  return resolvePlant(code, downSet)
}

/**
 * Determine whether to use Mt. Hope (591) or Cherokee (594) quarry
 */
function quarry(mhDay, downSet, subOverride) {
  const base = mhDay ? MH_PLANT : CHEROKEE_PLANT
  return p(base, downSet, subOverride)
}

/**
 * Apply 514 chain rule: after a 514 load, queue 516 then 519 next
 * Returns extended plants array
 */
function apply514Chain(plants, downSet, subOverride) {
  const result = []
  for (const plant of plants) {
    const resolved = p(plant, downSet, subOverride)
    result.push(resolved)
    if (resolved === '514' || plant === '514') {
      result.push(p('516', downSet, subOverride))
      result.push(p('519', downSet, subOverride))
    }
  }
  // deduplicate consecutive
  return result.filter((v, i) => i === 0 || v !== result[i - 1])
}

/**
 * Check if a driver has time to complete another run before end of shift
 */
function endOfShift519(startMin, currentMin, targetPlant, homeBase) {
  const driveToTarget = getDriveTime(homeBase, targetPlant)
  const totalTime = driveToTarget + LOAD_TIME + UNLOAD_TIME
  return currentMin + totalTime + END_OF_SHIFT_BUFFER <= QUARRY_CLOSE
}

/**
 * BP first rock rotation — returns the first plant for a BP driver
 */
function bpFirstRock(dateStr) {
  const cycleDay = getCycleDay(dateStr)
  return BP_FIRST_PLANTS[cycleDay % BP_FIRST_PLANTS.length]
}

/**
 * Build a step object
 */
function step(type, plant, note = '') {
  return { type, plant, note }
}

/**
 * Build a "call" step (for 518 check)
 */
function callStep(contact, reason) {
  return { type: 'call', contact, note: reason }
}

// ─── route builders ───────────────────────────────────────────────────────────

function buildChrisPRoute() {
  return [
    step('load',   '907', 'Palmer Block — first run'),
    step('load',   'POD', 'Decatur Sand'),
    step('load',   '907', 'Palmer Block — second run'),
    step('note',   '',    'CHRIS P: Fixed DUMP route'),
  ]
}

function buildTimRoute(downSet, subOverride) {
  return [
    step('load', p('506', downSet, subOverride), 'Tim fixed — 506 first'),
    step('load', p('511', downSet, subOverride), '511 Palmer'),
    step('note', '', 'Tim: Fixed DUMP route'),
  ]
}

function buildStaceyRoute(dateStr, downSet, subOverride, mhDay) {
  const firstRock = bpFirstRock(dateStr)
  const routes = [
    step('load', p(firstRock, downSet, subOverride), 'Stacey BP — first rock'),
  ]
  // Check 518 before dispatching to Scottsboro
  if (!downSet.has('518')) {
    routes.push(callStep(CONTACTS.SHANE, 'Call Shane before 518'))
    routes.push(callStep(CONTACTS.ANTHONY, 'Call Anthony before 518'))
    routes.push(step('load', '518', 'Stacey BP — 518 Scottsboro'))
  }
  // After-BP rock rotation
  const afterBP = p('513', downSet, subOverride)
  routes.push(step('load', afterBP, 'After BP rock'))
  routes.push(step('note', '', 'Stacey: Fixed BP route'))
  return routes
}

function buildAlexisRoute(downSet, subOverride) {
  const routes = []
  for (let round = 0; round < ALEXIS_ROUNDS; round++) {
    const plant514 = p('514', downSet, subOverride)
    routes.push(step('load', p(ALEXIS_START_PLANT, downSet, subOverride), `Alexis round ${round + 1} — 516`))
    routes.push(step('load', plant514, `Alexis round ${round + 1} — 514`))
    if (plant514 === '514') {
      routes.push(step('load', p('519', downSet, subOverride), '514 chain → 519'))
    }
  }
  routes.push(step('note', '', 'Alexis: Short day (2 rounds)'))
  return routes
}

function buildCurtisRoute(curtisOffice, onBP, dateStr, downSet, subOverride, mhDay) {
  if (curtisOffice) {
    return [
      step('load', CURTIS_OFFICE_PLANT, 'Curtis — office POD override'),
      step('note', '', 'Curtis: Office day override'),
    ]
  }
  if (onBP) {
    return buildBPRoute('Curtis', '507', dateStr, downSet, subOverride, mhDay)
  }
  return buildStandardRoute('Curtis', '507', dateStr, downSet, subOverride, mhDay)
}

function buildTFRoute(driverName, dateStr, downSet, subOverride) {
  // Tue/Fri: C519 and C507 get special plant lists
  if (C519_NAMES.includes(driverName)) {
    const idx = C519_NAMES.indexOf(driverName)
    const plant = C519_TUE_PLANTS[idx % C519_TUE_PLANTS.length]
    const plants = apply514Chain([plant], downSet, subOverride)
    return plants.map((pl, i) => step('load', pl, i === 0 ? 'TF override' : '514 chain'))
  }
  if (C507_NAMES.includes(driverName)) {
    const idx = C507_NAMES.indexOf(driverName)
    const plant = C507_TUE_PLANTS[idx % C507_TUE_PLANTS.length]
    const plants = apply514Chain([plant], downSet, subOverride)
    return plants.map((pl, i) => step('load', pl, i === 0 ? 'TF override' : '514 chain'))
  }
  return []
}

function buildBPRoute(driverName, crew, dateStr, downSet, subOverride, mhDay) {
  const firstRock = bpFirstRock(dateStr)
  const resolved = p(firstRock, downSet, subOverride)
  const routes = [
    step('load', resolved, `${driverName} BP — first rock (${firstRock})`),
  ]
  // Add chain if 514 came up
  if (resolved === '514') {
    routes.push(step('load', p('516', downSet, subOverride), '514 chain → 516'))
    routes.push(step('load', p('519', downSet, subOverride), '514 chain → 519'))
  }
  // Second load — back to home or next in rota
  const secondPlant = p('513', downSet, subOverride)
  routes.push(step('load', secondPlant, `${driverName} BP — second load`))
  return routes
}

function buildStandardRoute(driverName, crew, dateStr, downSet, subOverride, mhDay) {
  let rota = []
  let names = []

  if (C507_NAMES.includes(driverName) || crew === '507') {
    rota = C507_ROTA
    names = C507_NAMES
  } else if (C519_NAMES.includes(driverName) || crew === '519') {
    // 519 uses quarry-based routing
    const q = quarry(mhDay, downSet, subOverride)
    return [
      step('load', q, `${driverName} — quarry (${mhDay ? '591 MH' : '594 Cherokee'})`),
      step('load', p('511', downSet, subOverride), '519 crew → 511 Palmer'),
      step('note', '', '519 standard route'),
    ]
  } else if (C506_NAMES.includes(driverName) || crew === '506') {
    rota = C506_ROTA
    names = C506_NAMES
  }

  if (rota.length) {
    const cycleDay = getCycleDay(dateStr)
    const idx = names.indexOf(driverName)
    const offset = idx >= 0 ? idx : 0
    const rotaIdx = (cycleDay + offset) % rota.length
    const plant = rota[rotaIdx]
    const plants = apply514Chain([plant], downSet, subOverride)
    return plants.map((pl, i) =>
      step('load', pl, i === 0 ? `${driverName} — rota[${rotaIdx}]` : '514 chain')
    )
  }

  // Fallback
  return [step('load', p('511', downSet, subOverride), `${driverName} — default 511`)]
}

// ─── main export ─────────────────────────────────────────────────────────────

/**
 * Build the full route for a driver
 *
 * @param {Object} driver           - driver object from ALL_DRIVERS
 * @param {string} dateStr          - "YYYY-MM-DD"
 * @param {Object} opts
 * @param {boolean} opts.tf         - Tue/Fri toggle
 * @param {boolean} opts.mhDay      - Mt. Hope vs Cherokee
 * @param {boolean} opts.swap519    - 519 crew swap
 * @param {boolean} opts.curtisOffice - Curtis office override
 * @param {string[]} opts.down      - array of down plant codes
 * @param {Object} opts.subOverride - { originalCode: overrideCode }
 */
export function buildRoute(driver, dateStr, opts = {}) {
  const {
    tf = false,
    mhDay = true,
    swap519 = false,
    curtisOffice = false,
    down = [],
    subOverride = {},
  } = opts

  const downSet = new Set(down)
  const { name, crew, fixed, fixedBP, shortDay } = driver

  // ── Fixed DUMP routes ──────────────────────────────────────────────────────
  if (name === 'CHRIS P') return buildChrisPRoute()
  if (name === 'Tim') return buildTimRoute(downSet, subOverride)

  // ── Fixed BP routes ────────────────────────────────────────────────────────
  if (name === 'Stacey') return buildStaceyRoute(dateStr, downSet, subOverride, mhDay)
  if (name === 'Alexis') return buildAlexisRoute(downSet, subOverride)

  // ── Curtis special ─────────────────────────────────────────────────────────
  if (name === 'Curtis') {
    const onBP = driverBPDay(name, dateStr)
    return buildCurtisRoute(curtisOffice, onBP, dateStr, downSet, subOverride, mhDay)
  }

  // ── TF (Tue/Fri) override for C519 and C507 ────────────────────────────────
  const onTF = tf || isTueFri(dateStr)
  if (onTF && (C519_NAMES.includes(name) || C507_NAMES.includes(name))) {
    const tfRoute = buildTFRoute(name, dateStr, downSet, subOverride)
    if (tfRoute.length) return tfRoute
  }

  // ── BP rotation ────────────────────────────────────────────────────────────
  const onBP = driverBPDay(name, dateStr)
  if (onBP) {
    return buildBPRoute(name, crew, dateStr, downSet, subOverride, mhDay)
  }

  // ── Standard crew routes ───────────────────────────────────────────────────
  return buildStandardRoute(name, crew, dateStr, downSet, subOverride, mhDay)
}

/**
 * Build routes for all drivers
 */
export function buildAllRoutes(drivers, dateStr, opts = {}) {
  return drivers.map(driver => ({
    driver,
    steps: buildRoute(driver, dateStr, opts),
  }))
}

/**
 * Format a route as a clipboard-ready text string
 */
export function formatRouteText(driver, steps) {
  const lines = [`${driver.name} (${driver.crew}) — Start: ${driver.start}`]
  steps.forEach((s, i) => {
    if (s.type === 'load') {
      lines.push(`  ${i + 1}. Load at ${s.plant}${s.note ? ` — ${s.note}` : ''}`)
    } else if (s.type === 'call') {
      lines.push(`  ☎ Call ${s.contact} — ${s.note}`)
    } else if (s.type === 'note') {
      lines.push(`  ℹ ${s.note}`)
    }
  })
  return lines.join('\n')
}
