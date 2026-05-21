/**
 * Get today's date as "YYYY-MM-DD"
 */
export function todayStr() {
  return new Date().toISOString().split('T')[0]
}

/**
 * Format a date string "YYYY-MM-DD" to a human-readable string
 */
export function formatDate(dateStr) {
  if (!dateStr) return ''
  const d = new Date(dateStr + 'T00:00:00')
  return d.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

/**
 * Get day of week name from "YYYY-MM-DD"
 */
export function getDayName(dateStr) {
  const d = new Date(dateStr + 'T00:00:00')
  return d.toLocaleDateString('en-US', { weekday: 'long' })
}

/**
 * Advance a "YYYY-MM-DD" string by N days
 */
export function addDays(dateStr, n) {
  const d = new Date(dateStr + 'T00:00:00')
  d.setDate(d.getDate() + n)
  return d.toISOString().split('T')[0]
}
