// Lightweight id helpers — no external deps.

let counter = 0

/**
 * Generate a short unique-ish id with an optional prefix.
 * Good enough for local-first MVP records (not cryptographically unique).
 */
export function makeId(prefix = 'id') {
  counter += 1
  const rand = Math.random().toString(36).slice(2, 8)
  return `${prefix}-${Date.now().toString(36)}-${counter}-${rand}`
}

/**
 * Stable id for seed records so React keys don't churn across reloads.
 */
export function seedId(prefix, n) {
  return `${prefix}-${String(n).padStart(3, '0')}`
}
