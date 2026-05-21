// SRM North Alabama — driver roster
// Replace [Op X-N] placeholders with real names from Christian's Excel file.
// Special roles (routeRole) drive unique route logic in buildRoute.js.

export const BP_GROUPS = {
  A: ['[507 Op 1]', '[507 Op 2]', '[519 Op 1]', '[506 Op 1]'],
  B: ['[507 Op 3]', '[507 Op 4]', '[519 Op 2]', '[506 Op 2]'],
  C: ['[506 Op 3]', '[506 Op 4]', '[519 Op 3]', '[519 Op 4]'],
}

export const FIXED_BP = ['[Fixed BP 1]', '[Fixed BP 2]']

export const C507_NAMES = ['[507 Op 1]', '[507 Op 2]', '[507 Op 3]', '[507 Op 4]']
export const C519_NAMES = ['[519 Op 1]', '[519 Op 2]', '[519 Op 3]', '[519 Op 4]']
export const C506_NAMES = ['[506 Op 1]', '[506 Op 2]', '[506 Op 3]', '[506 Op 4]']

export const C507_ROTA = ['506', '511', '513', '507', '514']
export const C506_ROTA = ['511', '513', '514', '506']

export const DED_POOL = [...C507_NAMES, ...C519_NAMES, ...C506_NAMES]

export const C519_TUE_PLANTS = ['511', '506', '513', '507']
export const C507_TUE_PLANTS = ['516', '514', '519', '513']
export const BP_FIRST_PLANTS = ['506', '513', '511', '507']

export const CONTACTS = { SHANE: '256-402-5176', ANTHONY: '256-924-4328' }

export const ALL_DRIVERS = [
  // ── Fixed DUMP routes ──────────────────────────────────────────────────────
  { name: '[Dump Op 1]',   crew: 'DUMP', color: '#FFD700', bg: '#2a2200', start: '04:00', fixed: true,    routeRole: 'dump-1' },
  { name: '[Dump Op 2]',   crew: 'DUMP', color: '#BCAAA4', bg: '#1a1210', start: '05:00', fixed: true,    routeRole: 'dump-2' },
  // ── 507 crew (HSV / Stringfield area) ─────────────────────────────────────
  { name: '[507 Op 1]',    crew: '507',  color: '#4FC3F7', bg: '#0a1a22', start: '05:00' },
  { name: '[507 Op 2]',    crew: '507',  color: '#4FC3F7', bg: '#0a1a22', start: '05:00' },
  { name: '[507 Op 3]',    crew: '507',  color: '#4FC3F7', bg: '#0a1a22', start: '05:00' },
  { name: '[507 Op 4]',    crew: '507',  color: '#4FC3F7', bg: '#0a1a22', start: '04:00' },
  // ── 519 crew (Muscle Shoals) ───────────────────────────────────────────────
  { name: '[519 Op 1]',    crew: '519',  color: '#A5D6A7', bg: '#0a1a0f', start: '04:15' },
  { name: '[519 Op 2]',    crew: '519',  color: '#A5D6A7', bg: '#0a1a0f', start: '04:30' },
  { name: '[519 Op 3]',    crew: '519',  color: '#A5D6A7', bg: '#0a1a0f', start: '04:30' },
  { name: '[519 Op 4]',    crew: '519',  color: '#A5D6A7', bg: '#0a1a0f', start: '04:00' },
  // ── 506 crew (Decatur) ────────────────────────────────────────────────────
  { name: '[506 Op 1]',    crew: '506',  color: '#CE93D8', bg: '#1a0a22', start: '05:00', routeRole: 'kenny' },
  { name: '[506 Op 2]',    crew: '506',  color: '#CE93D8', bg: '#1a0a22', start: '05:00', routeRole: 'jimmy' },
  { name: '[506 Op 3]',    crew: '506',  color: '#CE93D8', bg: '#1a0a22', start: '04:00' },
  { name: '[506 Op 4]',    crew: '506',  color: '#CE93D8', bg: '#1a0a22', start: '04:15' },
  // ── Fixed BP (every day) ──────────────────────────────────────────────────
  { name: '[Fixed BP 1]',  crew: '507',  color: '#4FC3F7', bg: '#001a22', start: '04:00', fixedBP: true,  routeRole: 'stacey' },
  { name: '[Fixed BP 2]',  crew: '516',  color: '#FF7043', bg: '#220a00', start: '08:00', fixedBP: true,  shortDay: true, routeRole: 'alexis' },
]

export const CREW_TABS = ['ALL', '519', '507', '506', 'BRIDGEPORT', 'DUMP']
export const CREW_COLORS = {
  ALL: '#FF6F00', '519': '#A5D6A7', '507': '#4FC3F7',
  '506': '#CE93D8', BRIDGEPORT: '#FF7043', DUMP: '#BCAAA4',
}
