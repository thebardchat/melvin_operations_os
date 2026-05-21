// Travel times between plant codes in minutes (one-way drive time)
const TIMES = {
  '591-507': 70, '591-506': 30, '591-511': 40, '591-513': 35,
  '591-514': 80, '591-516': 80, '591-518': 320, '591-519': 20,
  '591-525': 45, '591-594': 40, '591-502': 360, '591-907': 45,
  '502-518': 25, '502-907': 200, '502-511': 200, '502-594': 390,
  '518-907': 200, '518-502': 25,
  'POD-506': 10, 'POD-507': 75, 'POD-511': 20, 'POD-513': 15,
  'POD-514': 85, 'POD-516': 85, 'POD-519': 55, 'POD-525': 45,
  '506-507': 70, '506-511': 30, '506-513': 20, '506-519': 50,
  '507-511': 25, '507-513': 40, '507-519': 75,
  '511-513': 10,
  '514-516': 25, '516-RG': 1, 'RG-507': 25, 'RG-511': 35, 'RG-513': 45,
  '514-RG': 20, '507-MM': 1, 'MM-511': 25, 'MM-513': 30,
  '519-507': 75, '519-506': 50,
  '594-518': 420, '594-506': 55, '594-507': 95, '594-511': 75,
  '594-513': 65, '594-514': 100, '594-519': 30,
  '525-506': 30,
}

const DEFAULT_DRIVE = 30

export const LOAD_TIME = 20
export const UNLOAD_TIME = 15
export const SCRAP_TIME = 15
export const QUARRY_CLOSE = 960       // 16:00 in minutes from midnight
export const END_OF_SHIFT_BUFFER = 90 // minutes

/**
 * Get drive time between two plant codes (bidirectional lookup)
 */
export function getDriveTime(from, to) {
  if (!from || !to || from === to) return 0
  const key1 = `${from}-${to}`
  const key2 = `${to}-${from}`
  return TIMES[key1] ?? TIMES[key2] ?? DEFAULT_DRIVE
}

/**
 * Estimate total time for a single haul: drive to plant + load + drive to delivery + unload
 * For simplicity, delivery assumed same location (i.e., time is round-trip-equivalent)
 */
export function getHaulTime(from, to) {
  const drive = getDriveTime(from, to)
  return drive + LOAD_TIME + UNLOAD_TIME
}

/**
 * Convert "HH:MM" string to minutes from midnight
 */
export function timeToMin(timeStr) {
  if (!timeStr) return 0
  const [h, m] = timeStr.split(':').map(Number)
  return h * 60 + m
}

/**
 * Convert minutes from midnight to "HH:MM" string
 */
export function minToTime(minutes) {
  const h = Math.floor(minutes / 60) % 24
  const m = minutes % 60
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`
}
