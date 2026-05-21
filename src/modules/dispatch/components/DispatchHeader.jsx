import { T } from '../../../styles/theme.js'
import { Badge } from '../../../components/Badge.jsx'
import { formatDate } from '../../../utils/date.js'
import { isTueFri } from '../engine/rotation.js'

function Toggle({ label, active, onChange }) {
  return (
    <button
      onClick={() => onChange(!active)}
      style={{
        display: 'flex', alignItems: 'center', gap: 5,
        padding: '4px 10px', borderRadius: 6,
        border: `1px solid ${active ? T.brand : T.border}`,
        background: active ? T.brandBg : 'transparent',
        color: active ? T.brand : T.text2,
        fontSize: 11, fontWeight: active ? 600 : 400,
        cursor: 'pointer',
      }}
    >
      <span
        style={{
          width: 10, height: 10, borderRadius: '50%',
          background: active ? T.brand : T.text4,
          display: 'inline-block',
        }}
      />
      {label}
    </button>
  )
}

export function DispatchHeader({
  date, setDate,
  tf, setTf,
  mhDay, setMhDay,
  swap519, setSwap519,
  curtisOffice, setCurtisOffice,
  down, toggleDown,
  view, setView,
}) {
  const autoTF = isTueFri(date)

  return (
    <div style={{
      display: 'flex', flexDirection: 'column', gap: 10,
      padding: '12px 0', borderBottom: `1px solid ${T.border}`, marginBottom: 8,
    }}>
      {/* Date row */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
        <div>
          <div style={{ fontSize: 11, color: T.text3, marginBottom: 2 }}>Dispatch Date</div>
          <input
            type="date"
            value={date}
            onChange={e => setDate(e.target.value)}
            style={{ background: T.raised, color: T.text, border: `1px solid ${T.border}`, borderRadius: 6, padding: '4px 8px', fontSize: 13, fontFamily: T.mono }}
          />
        </div>
        <div style={{ paddingTop: 18 }}>
          <span style={{ fontSize: 13, color: T.text2 }}>{formatDate(date)}</span>
          {autoTF && <Badge variant="amber" style={{ marginLeft: 8 }}>TUE/FRI</Badge>}
        </div>
        <div style={{ marginLeft: 'auto', display: 'flex', gap: 6 }}>
          <button
            onClick={() => setView(view === 'audible' ? 'board' : 'audible')}
            style={{
              padding: '4px 10px', borderRadius: 6, fontSize: 11,
              border: `1px solid ${view === 'audible' ? T.blue : T.border}`,
              background: view === 'audible' ? 'rgba(91,155,199,0.12)' : 'transparent',
              color: view === 'audible' ? T.blue : T.text3, cursor: 'pointer',
            }}
          >
            Audible
          </button>
          <button
            onClick={() => setView(view === 'calendar' ? 'board' : 'calendar')}
            style={{
              padding: '4px 10px', borderRadius: 6, fontSize: 11,
              border: `1px solid ${view === 'calendar' ? T.amber : T.border}`,
              background: view === 'calendar' ? 'rgba(212,160,60,0.12)' : 'transparent',
              color: view === 'calendar' ? T.amber : T.text3, cursor: 'pointer',
            }}
          >
            BP Calendar
          </button>
        </div>
      </div>

      {/* Toggles row */}
      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', alignItems: 'center' }}>
        <Toggle label={`TF ${autoTF ? '(auto)' : ''}`} active={tf || autoTF} onChange={setTf} />
        <Toggle label="MH Day" active={mhDay} onChange={setMhDay} />
        <Toggle label="Swap 519" active={swap519} onChange={setSwap519} />
        <Toggle label="Curtis Office" active={curtisOffice} onChange={setCurtisOffice} />
      </div>

      {/* Down plants row */}
      {down.length > 0 && (
        <div style={{ display: 'flex', gap: 6, alignItems: 'center', flexWrap: 'wrap' }}>
          <span style={{ fontSize: 11, color: T.text3 }}>DOWN:</span>
          {down.map(code => (
            <span
              key={code}
              onClick={() => toggleDown(code)}
              style={{
                padding: '2px 8px', borderRadius: 4,
                background: 'rgba(212,85,85,0.12)',
                border: '1px solid rgba(212,85,85,0.25)',
                color: T.red, fontSize: 11, fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              {code} ×
            </span>
          ))}
        </div>
      )}
    </div>
  )
}
