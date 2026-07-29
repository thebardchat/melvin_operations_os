const PREFIX = 'melvin_os_'

/**
 * Save a value to localStorage under a namespaced key
 */
export function save(key, value) {
  try {
    localStorage.setItem(PREFIX + key, JSON.stringify(value))
  } catch {
    // Storage full or unavailable - silently ignore
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
    window.dispatchEvent(new CustomEvent('melvin-storage-change', { detail: { key } }))
  } catch {
    // Ignore
  }
}

export function listKeys() {
  try {
    return Object.keys(localStorage)
      .filter(k => k.startsWith(PREFIX))
      .map(k => k.slice(PREFIX.length))
      .sort()
  } catch {
    return []
  }
}

export function exportBackup() {
  const data = {}
  for (const key of listKeys()) {
    data[key] = load(key, null)
  }

  return {
    app: 'melvin_operations_os',
    version: 1,
    exportedAt: new Date().toISOString(),
    namespace: PREFIX,
    keys: Object.keys(data).sort(),
    data,
  }
}

export function importBackup(payload) {
  if (!payload || payload.app !== 'melvin_operations_os' || typeof payload.data !== 'object') {
    throw new Error('Not a Melvin backup file')
  }

  const entries = Object.entries(payload.data)
  entries.forEach(([key, value]) => save(key, value))
  entries.forEach(([key]) => window.dispatchEvent(new CustomEvent('melvin-storage-change', { detail: { key } })))
  return entries.length
}

/**
 * Clear all melvin_os_ prefixed keys
 */
export function clearAll() {
  try {
    const keys = listKeys()
    keys.forEach(k => localStorage.removeItem(PREFIX + k))
    keys.forEach(k => window.dispatchEvent(new CustomEvent('melvin-storage-change', { detail: { key: k } })))
    return keys.length
  } catch {
    return 0
  }
}
