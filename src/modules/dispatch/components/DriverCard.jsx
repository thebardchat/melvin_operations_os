import { T } from '../../../styles/theme.js'
import { Badge } from '../../../components/Badge.jsx'
import { RouteSteps } from './RouteSteps.jsx'
import { copyToClipboard } from '../../../utils/clipboard.js'
import { formatRouteText } from '../engine/buildRoute.js'

function StartStepper({ start, onMinus, onPlus, onReset }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
      <button
        onClick={(e) => { e.stopPropagation(); onMinus() }}
        style={{
          width: 22, height: 22, borderRadius: 4,
          border: `1px solid ${T.border}`,
          background: T.raised, color: T.text2,
          fontSize: 14, lineHeight: '20px',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}
      >−</button>
      <span
        style={{
          minWidth: 44, textAlign: 'center',
          fontFamily: T.mono, fontSize: 12, color: T.text,
        }}
      >
        {start}
      </span>
      <button
        onClick={(e) => { e.stopPropagation(); onPlus() }}
        style={{
          width: 22, height: 22, borderRadius: 4,
          border: `1px solid ${T.border}`,
          background: T.raised, color: T.text2,
          fontSize: 14, lineHeight: '20px',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}
      >+</button>
      <button
        onClick={(e) => { e.stopPropagation(); onReset() }}
        style={{
          height: 22, padding: '0 6px', borderRadius: 4,
          border: `1px solid ${T.border}`,
          background: T.raised, color: T.text3,
          fontSize: 10,
        }}
      >RST</button>
    </div>
  )
}

export function DriverCard({ driver, steps, copied, onCopy, onAdjustStart, onResetStart }) {
  async function handleClick() {
    const text = formatRouteText(driver, steps)
    await copyToClipboard(text)
    onCopy(driver.name)
  }

  const crewColorMap = {
    '507': T.c507, '519': T.c519, '506': T.c506, DUMP: T.cDump,
  }
  const crewColor = crewColorMap[driver.crew] || T.brand

  return (
    <div
      onClick={handleClick}
      style={{
        background: copied === driver.name ? 'rgba(91,166,110,0.08)' : T.surface,
        border: `1px solid ${copied === driver.name ? T.green : T.border}`,
        borderLeft: `3px solid ${crewColor}`,
        borderRadius: T.r,
        padding: '12px 14px',
        cursor: 'pointer',
        transition: 'all 0.15s',
        position: 'relative',
      }}
    >
      {/* Copied overlay */}
      {copied === driver.name && (
        <div style={{
          position: 'absolute', top: 8, right: 12,
          fontSize: 11, color: T.green, fontWeight: 600,
        }}>
          Copied
        </div>
      )}

      {/* Header row */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
        <span style={{ fontWeight: 700, fontSize: 14, color: T.text, flex: 1 }}>
          {driver.name}
        </span>
        <Badge variant="muted" style={{ color: crewColor }}>
          {driver.crew}
        </Badge>
        {driver.fixed && <Badge variant="amber">FIXED</Badge>}
        {driver.fixedBP && <Badge variant="brand">BP</Badge>}
        {driver.shortDay && <Badge variant="blue">SHORT</Badge>}
      </div>

      {/* Start time stepper */}
      <div style={{ marginBottom: 10 }}>
        <StartStepper
          start={driver.start}
          onMinus={() => onAdjustStart(driver.name, -15)}
          onPlus={() => onAdjustStart(driver.name, 15)}
          onReset={() => onResetStart(driver.name)}
        />
      </div>

      {/* Route steps */}
      <RouteSteps steps={steps} />

      <div style={{ marginTop: 8, fontSize: 10, color: T.text4 }}>
        Click to copy route
      </div>
    </div>
  )
}
