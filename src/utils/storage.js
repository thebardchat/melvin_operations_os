const PREFIX = 'melvin_os_'

/**
 * Save a value to localStorage under a namespaced key
 */
export function save(key, value) {
  try {
    localStorage.setItem(PREFIX + key, JSON.stringify(value))
  } catch {
    // Storage full or unavailable — silently ignore
  }
}

/**
 * Load a value from localStorage, returning defaultValue if missing
 */
export function load(key, defaultValue = null) {
  try {
    const raw = localStorage.getItem(PREFIX + key)
    if (raw === null) return defaultValue
    return JSON.parse(raw)
  } catch {
    return defaultValue
  }
}

/**
 * Remove a key from localStorage
 */
export function remove(key) {
  try {
    localStorage.removeItem(PREFIX + key)
  } catch {
    // Ignore
  }
}

/**
 * Clear all melvin_os_ prefixed keys
 */
export function clearAll() {
  try {
    const keys = Object.keys(localStorage).filter(k => k.startsWith(PREFIX))
    keys.forEach(k => localStorage.removeItem(k))
  } catch {
    // Ignore
  }
}
