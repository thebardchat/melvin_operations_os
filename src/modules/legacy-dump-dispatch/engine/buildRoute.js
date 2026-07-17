/**
 * buildRoute.js — exact port of srm-dispatch buildShorthand.js
 * Returns arrow-separated route strings: "Name: stop→stop→stop→home"
 */

import {
  C507_NAMES, C519_NAMES, C506_NAMES,
  BP_GROUPS, FIXED_BP,
  C507_ROTA, C506_ROTA,
  C519_TUE_PLANTS, C507_TUE_PLANTS,
  BP_FIRST_PLANTS,
  CONTACTS,
} from '../../../tenants/srm-north-alabama/drivers.js'
import { getDriveTime, timeToMin, LOAD_TIME, UNLOAD_TIME, QUARRY_CLOSE } from './travelTimes.js'

// Local rota helper — matches original srm-dispatch rotaAssign signature
function rota(list, name, arr, cycleDay) {
  const idx = list.indexOf(name)
  if (idx === -1) return arr[0]
  return arr[(idx + cycleDay) % arr.length]
}

// ── helpers ──────────────────────────────────────────────────────────────────

function p(code, down, subMap) {
  return down.has(code) ? (subMap[code] || '?') : code
}

function quarry(mhDay, down, sub) {
  return mhDay ? p('591', down, sub) : p('594', down, sub)
}

// 514 chain rule: after 514 load → scrap to LQ (516) → RG rock → home plant
function after514(homePlant, down, subMap) {
  return `${p('514', down, subMap)} scrap→LQ→RG rock→${p(homePlant, down, subMap)}`
}

// End-of-shift 519 check: returns modified route suffix based on time remaining
function endOfShift519(name, crew, startTime, hoursBeforeDelivery, down, subMap) {
  const startMin = timeToMin(startTime)
  const currentMin = startMin + hoursBeforeDelivery * 60
  const driveToMH = getDriveTime('519', '591')
  const mhTo506 = getDriveTime('591', '506')
  const mhToHome = getDriveTime('591', crew === '507' ? '507' : '506')
  const fullTrip = driveToMH + LOAD_TIME + mhToHome + LOAD_TIME
  const homePlant = crew === '507' ? '507' : '506'
  const mh = p('591', down, subMap)

  if (currentMin + fullTrip > QUARRY_CLOSE) {
    return `→${p('519', down, subMap)}→Scrap→${mh} 67s→${p('506', down, subMap)}→POD→${p(homePlant, down, subMap)} home (⏰ short route)`
  }
  return `→${p('519', down, subMap)}→Scrap→${mh} 67s→${p(homePlant, down, subMap)} home`
}

// BP first-rock: rotating MH 67s delivery to a main plant
function bpFirstRock(name, cycleDay, down, subMap) {
  const group = BP_GROUPS[['A', 'B', 'C'][cycleDay % 3]]
  const idx = group ? group.indexOf(name) : -1
  const plantIdx = idx >= 0
    ? (idx + cycleDay) % BP_FIRST_PLANTS.length
    : cycleDay % BP_FIRST_PLANTS.length
  return p(BP_FIRST_PLANTS[plantIdx], down, subMap)
}

// 518 call/check line
function check518(down, subMap) {
  return `📞 518: Dispatch Lead ${CONTACTS.DISPATCH_LEAD} / Plant Mgr ${CONTACTS.PLANT_MANAGER}→MM 78s→${p('518', down, subMap)} or DH`
}

// ── main export ───────────────────────────────────────────────────────────────

export function buildRoute(name, { tf, mhDay, down, subMap, curtisOffice, swap519, cycleDay, startOverrides, routeRole }) {
  const mh    = p('591', down, subMap)
  const scMH  = `Scrap→${mh}`
  const sc594 = `Scrap→${p('594', down, subMap)}`
  const qry   = quarry(mhDay, down, subMap)
  const bpGroupKey = ['A', 'B', 'C'][cycleDay % 3]
  const todayBP = new Set([...(BP_GROUPS[bpGroupKey] || []), ...FIXED_BP])
  const onBP  = todayBP.has(name)

  // ── Fixed DUMP routes (keyed by routeRole) ────────────────────────────────
  if (routeRole === 'dump-1') return `${name}: CHER→MSAND→Tupelo Block→APAC Tremont→511→POD→519→PRELOAD`
  if (routeRole === 'dump-2') return `${name}: 519→${p('506', down, subMap)} delivery→POD check→PRELOAD 519`

  // ── Fixed BP 1 (Stacey role) ───────────────────────────────────────────────
  if (routeRole === 'stacey') {
    const firstRock = bpFirstRock(name, cycleDay, down, subMap)
    return `${name}: ${scMH} 67s→${firstRock} rock→${check518(down, subMap)}→502 BP 1/4 downs→907 blocks→511 Palmer→POD sand→home`
  }

  // ── Fixed BP 2 / short day (Alexis role) ──────────────────────────────────
  if (routeRole === 'alexis') {
    const dest514 = p('514', down, subMap)
    const r1end = dest514 === '514'
      ? `→POD sand→${after514('516', down, subMap)}`
      : `→POD sand→${dest514}`
    const r1 = `R1: 516→RG 67s→${p('507', down, subMap)}→MM 67s→${p('513', down, subMap)}${r1end}`
    const r2 = `R2: 516→RG 67s→${p('507', down, subMap)}→MM 67s→${p('511', down, subMap)}→POD sand→516`
    return `${name}: ${r1} / ${r2}`
  }

  // ── TUE/FRI overrides ─────────────────────────────────────────────────────
  if (tf && C519_NAMES.includes(name)) {
    const idx = C519_NAMES.indexOf(name)
    const tuePlant = p(C519_TUE_PLANTS[(idx + cycleDay) % C519_TUE_PLANTS.length], down, subMap)
    return `${name}: Scrap→${mh} 67s→${tuePlant}→${check518(down, subMap)}→502 BP 1/4 downs→907 blocks→POD sand→519`
  }

  if (tf && C507_NAMES.includes(name)) {
    const idx = C507_NAMES.indexOf(name)
    const tuePlant = p(C507_TUE_PLANTS[(idx + cycleDay) % C507_TUE_PLANTS.length], down, subMap)
    if (tuePlant === '514') {
      return `${name}: 502 BP 1/4 downs→907 blocks→POD sand→${after514('507', down, subMap)}→507 home`
    }
    if (tuePlant === '519') {
      const start = (startOverrides && startOverrides[name]) || '05:00'
      return `${name}: 502 BP 1/4 downs→907 blocks→POD sand${endOfShift519(name, '507', start, 8, down, subMap)}`
    }
    return `${name}: 502 BP 1/4 downs→907 blocks→POD sand→${tuePlant}→loop→507 home`
  }

  // ── BP rotation (non-TF) ───────────────────────────────────────────────────
  if (onBP) {
    const firstRock = bpFirstRock(name, cycleDay, down, subMap)
    const postBP = C507_NAMES.includes(name)
      ? `→${mh} 67s→${p(rota(C507_NAMES, name, C507_ROTA, cycleDay), down, subMap)} rock→POD sand→home`
      : C519_NAMES.includes(name)
        ? `→${mh} 67s→${p('519', down, subMap)} rock→POD→home`
        : `→${mh} 67s→${p(rota(C506_NAMES, name, C506_ROTA, cycleDay), down, subMap)} rock→POD sand→home`
    return `${name}: ${scMH} 67s→${firstRock} rock→${check518(down, subMap)}→502 BP 1/4 downs→907 blocks${postBP}`
  }

  // ── Standard routes ────────────────────────────────────────────────────────

  // 519 crew (Muscle Shoals) — scrap to Cherokee (594)
  if (C519_NAMES.includes(name)) {
    if (swap519) return `${name}: ${sc594} 67s→${p('519', down, subMap)} rock→${qry} scrap→${p('519', down, subMap)} rock→${qry} loop`
    return `${name}: ${sc594} 67s→${p('519', down, subMap)} rock→POD sand→home`
  }

  // 507 crew (HSV) — scrap to MH (591)
  if (C507_NAMES.includes(name)) {
    const sub = p(rota(C507_NAMES, name, C507_ROTA, cycleDay), down, subMap)
    if (sub === '514') {
      return `${name}: ${scMH} 67s→${p('511', down, subMap)} rock→POD sand→${after514('507', down, subMap)}→507 home`
    }
    return `${name}: ${scMH} 67s→${sub} rock→POD sand→home`
  }

  // 506 crew (Decatur) — scrap to MH (591), 2 rounds
  if (C506_NAMES.includes(name)) {
    const idx = C506_NAMES.indexOf(name)
    const r1raw = C506_ROTA[(idx + cycleDay) % C506_ROTA.length]
    const r1 = p(r1raw, down, subMap)

    if (routeRole === 'kenny') return `${name}: ${scMH} 67s→${r1} rock→POD sand→${p('519', down, subMap)} scrap→${qry} repeat`
    if (routeRole === 'jimmy') return `${name}: ${scMH} 67s→${p('513', down, subMap)} rock→POD sand→${p('511', down, subMap)}→POD→511 repeat`

    if (r1 === '514') return `${name}: ${scMH} 67s→${p('511', down, subMap)} rock→POD sand→${after514('506', down, subMap)}→506 home`

    const sandRaw = C506_ROTA[(idx + cycleDay + 1) % C506_ROTA.length]
    const sandPlant = p(sandRaw, down, subMap)
    const r2raw = C506_ROTA[(idx + cycleDay + 2) % C506_ROTA.length]
    const r2 = p(r2raw, down, subMap)

    if (sandPlant === '514') return `${name}: ${scMH} 67s→${r1} rock→POD sand→${after514('506', down, subMap)}→506 home`
    if (r2 === '514') return `${name}: ${scMH} 67s→${r1} rock→POD sand→${sandPlant}→${mh} 67s→${p('511', down, subMap)} rock→POD sand→${after514('506', down, subMap)}→506 home`

    return `${name}: ${scMH} 67s→${r1} rock→POD sand→${sandPlant}→${mh} 67s→${r2} rock→POD sand→home`
  }

  return `${name}: route TBD`
}

export function buildAllRoutes(drivers, cycleDay, opts) {
  const { tf, mhDay, swap519, curtisOffice, down = [], subOverride = {}, startOverrides = {} } = opts
  const downSet = new Set(down)
  // Build subMap: first auto-sub from SUBS, then allow manual override
  const { SUBS } = opts
  const subMap = {}
  downSet.forEach(code => {
    subMap[code] = subOverride[code] || (SUBS && SUBS[code]?.[0]) || ''
  })

  return drivers.map(driver => ({
    driver,
    routeText: buildRoute(driver.name, { tf, mhDay, down: downSet, subMap, curtisOffice, swap519, cycleDay, startOverrides, routeRole: driver.routeRole }),
  }))
}
