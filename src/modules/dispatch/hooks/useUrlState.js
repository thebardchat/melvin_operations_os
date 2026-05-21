import { useCallback } from 'react'
import { todayStr } from '../../../utils/date.js'

/**
 * Read dispatch state from URL search params
 */
export function readUrlState() {
  if (typeof window === 'undefined') return {}
  const params = new URLSearchParams(window.location.search)
  return {
    date:        params.get('date')   || todayStr(),
    tf:          params.get('tf')     === '1',
    mhDay:       params.get('mh')     !== '0',  // default true
    swap519:     params.get('swap')   === '1',
    curtisOffice:params.get('curtis') === '1',
    down:        params.get('down')   ? params.get('down').split(',') : [],
  }
}

/**
 * Write dispatch state to URL search params (replaces history entry)
 */
export function writeUrlState(state) {
  if (typeof window === 'undefined') return
  const params = new URLSearchParams()
  if (state.date && state.date !== todayStr()) params.set('date', state.date)
  if (state.tf)          params.set('tf', '1')
  if (!state.mhDay)      params.set('mh', '0')
  if (state.swap519)     params.set('swap', '1')
  if (state.curtisOffice) params.set('curtis', '1')
  if (state.down?.length) params.set('down', state.down.join(','))
  const qs = params.toString()
  const url = qs ? `${window.location.pathname}?${qs}` : window.location.pathname
  window.history.replaceState(null, '', url)
}

/**
 * Hook: returns url state and a setter that also updates the URL
 */
export function useUrlState(setState) {
  const setAndSync = useCallback((updates) => {
    setState(prev => {
      const next = typeof updates === 'function' ? updates(prev) : { ...prev, ...updates }
      writeUrlState(next)
      return next
    })
  }, [setState])
  return setAndSync
}
