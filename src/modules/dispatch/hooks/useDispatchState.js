import { useState, useMemo } from 'react'
import { todayStr } from '../../../utils/date.js'
import { readUrlState } from './useUrlState.js'
import { ALL_DRIVERS } from '../../../tenants/srm-north-alabama/drivers.js'
import { buildAllRoutes } from '../engine/buildRoute.js'

const initial = readUrlState()

/**
 * Central dispatch state hook
 */
export function useDispatchState() {
  const [date, setDate]               = useState(initial.date || todayStr())
  const [tf, setTf]                   = useState(initial.tf || false)
  const [mhDay, setMhDay]             = useState(initial.mhDay !== false)
  const [swap519, setSwap519]         = useState(initial.swap519 || false)
  const [curtisOffice, setCurtisOffice] = useState(initial.curtisOffice || false)
  const [down, setDown]               = useState(initial.down || [])
  const [subOverride, setSubOverride] = useState({})
  const [startOverrides, setStartOverrides] = useState({})  // { name: startTimeStr }
  const [copied, setCopied]           = useState(null)
  const [crew, setCrew]               = useState('ALL')
  const [view, setView]               = useState('board')   // 'board' | 'audible' | 'calendar'

  // Build effective driver list with start time overrides applied
  const drivers = useMemo(() => {
    return ALL_DRIVERS.map(d => ({
      ...d,
      start: startOverrides[d.name] || d.start,
    }))
  }, [startOverrides])

  // Build routes for all drivers
  const routes = useMemo(() => {
    const opts = { tf, mhDay, swap519, curtisOffice, down, subOverride }
    return buildAllRoutes(drivers, date, opts)
  }, [drivers, date, tf, mhDay, swap519, curtisOffice, down, subOverride])

  // Filtered routes for current crew tab
  const filteredRoutes = useMemo(() => {
    if (crew === 'ALL') return routes
    if (crew === 'BRIDGEPORT') return routes.filter(r => r.driver.fixedBP)
    if (crew === 'DUMP') return routes.filter(r => r.driver.crew === 'DUMP')
    return routes.filter(r => r.driver.crew === crew)
  }, [routes, crew])

  // Toggle a plant in/out of the down list
  function toggleDown(plantCode) {
    setDown(prev =>
      prev.includes(plantCode)
        ? prev.filter(c => c !== plantCode)
        : [...prev, plantCode]
    )
  }

  // Adjust start time by delta minutes
  function adjustStart(driverName, deltaMins) {
    setStartOverrides(prev => {
      const driver = ALL_DRIVERS.find(d => d.name === driverName)
      const currentTime = prev[driverName] || driver?.start || '04:00'
      const [h, m] = currentTime.split(':').map(Number)
      const total = Math.max(0, h * 60 + m + deltaMins)
      const newH = Math.floor(total / 60) % 24
      const newM = total % 60
      if (deltaMins === 0 || deltaMins === null) {
        // Reset
        const updated = { ...prev }
        delete updated[driverName]
        return updated
      }
      return {
        ...prev,
        [driverName]: `${String(newH).padStart(2, '0')}:${String(newM).padStart(2, '0')}`,
      }
    })
  }

  // Reset start time to default
  function resetStart(driverName) {
    setStartOverrides(prev => {
      const updated = { ...prev }
      delete updated[driverName]
      return updated
    })
  }

  function markCopied(driverName) {
    setCopied(driverName)
    setTimeout(() => setCopied(c => c === driverName ? null : c), 2000)
  }

  return {
    // State
    date, setDate,
    tf, setTf,
    mhDay, setMhDay,
    swap519, setSwap519,
    curtisOffice, setCurtisOffice,
    down, setDown, toggleDown,
    subOverride, setSubOverride,
    startOverrides,
    copied, markCopied,
    crew, setCrew,
    view, setView,
    // Derived
    drivers,
    routes,
    filteredRoutes,
    // Actions
    adjustStart,
    resetStart,
  }
}
