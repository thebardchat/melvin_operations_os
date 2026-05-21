import { T } from '../../../styles/theme.js'
import { useDispatchState } from '../hooks/useDispatchState.js'
import { DispatchHeader } from './DispatchHeader.jsx'
import { CrewTabs } from './CrewTabs.jsx'
import { DriverCard } from './DriverCard.jsx'
import { AudiblePanel } from './AudiblePanel.jsx'
import { BPCalendar } from './BPCalendar.jsx'

export function DispatchBoard() {
  const state = useDispatchState()
  const {
    date, setDate, tf, setTf, mhDay, setMhDay,
    swap519, setSwap519, curtisOffice, setCurtisOffice,
    down, toggleDown, view, setView,
    crew, setCrew, filteredRoutes, routes,
    copied, markCopied, adjustStart, resetStart,
  } = state

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 0, height: '100%' }}>
      <DispatchHeader
        date={date} setDate={setDate}
        tf={tf} setTf={setTf}
        mhDay={mhDay} setMhDay={setMhDay}
        swap519={swap519} setSwap519={setSwap519}
        curtisOffice={curtisOffice} setCurtisOffice={setCurtisOffice}
        down={down} toggleDown={toggleDown}
        view={view} setView={setView}
      />

      <CrewTabs activeCrew={crew} onSelect={setCrew} />

      {view === 'audible' ? (
        <div style={{ marginTop: 12 }}>
          <AudiblePanel routes={filteredRoutes} />
        </div>
      ) : view === 'calendar' ? (
        <div style={{ marginTop: 12 }}>
          <BPCalendar date={date} />
        </div>
      ) : (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
          gap: 10,
          marginTop: 12,
          paddingBottom: 24,
        }}>
          {filteredRoutes.map(r => (
            <DriverCard
              key={r.driver.name}
              driver={r.driver}
              steps={r.steps}
              copied={copied}
              onCopy={markCopied}
              onAdjustStart={adjustStart}
              onResetStart={resetStart}
            />
          ))}
          {filteredRoutes.length === 0 && (
            <div style={{ gridColumn: '1/-1', color: T.text3, textAlign: 'center', padding: 40 }}>
              No drivers in this crew filter
            </div>
          )}
        </div>
      )}
    </div>
  )
}
