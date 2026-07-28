import { useCallback, useState } from 'react'
import { load, save } from '../utils/storage.js'

export function usePersistentList(key, seedItems = []) {
  const [items, setItems] = useState(() => load(key, null) || seedItems)

  const updateItems = useCallback((updater) => {
    setItems((current) => {
      const next = typeof updater === 'function' ? updater(current) : updater
      save(key, next)
      window.dispatchEvent(new CustomEvent('melvin-storage-change', { detail: { key } }))
      return next
    })
  }, [key])

  const resetItems = useCallback(() => {
    updateItems(seedItems)
  }, [seedItems, updateItems])

  return [items, updateItems, resetItems]
}
