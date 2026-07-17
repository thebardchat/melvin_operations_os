import { T } from '../../../styles/theme.js'
import { Badge } from '../../../components/Badge.jsx'
import { RouteSteps } from './RouteSteps.jsx'

const CREW_COLOR = {
  '507': T.c507, '519': T.c519, '506': T.c506,
  '516': T.cBP,  DUMP: T.cDump,
}

function crewColor(driver) {
  return CREW_COLOR[driver.crew] || T.brand
}

function fallbackCopy(text) {
  const el = document.createElement('textarea')
  el.value = text
  el.style.cssText = 'position:fixed;opacity:0'
  document.body.appendChild(el)
  el.focus()
  el.select()
  try { document.execCommand('copy') } catch (_) {}
  document.body.removeChild(el)
}

function copyText(text) {
  if (navigator.clipboard?.writeText) {
    return navigator.clipboard.writeText(text).catch(() => fallbackCopy(text))
  }
  fallbackCopy(text)
  return Promise.resolve()
}

function StartStepper({ name, start, isOverridden, onMinus, onPlus, onReset }) {
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 2,
      border: `1px solid ${isOverridden ? T.amber + '55' : T.border}`,
      padding: '1px 6px', borderRadius: 99,
      background: isOverridden ? `${T.amber}10` : 'transparent',
    }}>
      <button
        onClick={(e) => { e.stopPropagation(); onMinus() }}
        style={{ background: 'none', border: 'none', color: T.text2, fontSize: 11, padding: '0 3px', fontFamily: T.font, cursor: 'pointer' }}
      >-</button>
      <span style={{
        color: isOverridden ? T.amber : T.text2,
        fontWeight: isOverridden ? 600 : 400,
        fontFamily: T.mono, fontSize: 10, minWidth: 30, textAlign: 'center',
      }}>{start}</span>
      <button
        onClick={(e) => { e.stopPropagation(); onPlus() }}
        style={{ background: 'none', border: 'none', color: T.text2, fontSize: 11, padding: '0 3px', fontFamily: T.font, cursor: 'pointer' }}
      >+</button>
      {isOverridden && (
        <button
          onClick={(e) => { e.stopPropagation(); onReset() }}
          style={{ background: 'none', border: `1px solid ${T.text4}`, color: T.text4, fontSize: 8, padding: '1px 6px', borderRadius: 99, fontFamily: T.font, cursor: 'pointer' }}
        >RST</button>
      )}
    </span>
  )
}

export function DriverCard({
  driver, routeText, copied,
  onCopy, onAdjustStart, onResetStart, isOverridden,
}) {
  const clr = crewColor(driver)
  const isCopied = copied === driver.name

  async function handleClick() {
    await copyText(routeText)
    onCopy(driver.name)
  }

  // Alexis short day: two rounds separated by " / "
  const isAlexis = driver.shortDay
  const rounds = isAlexis ? routeText.split(' / ') : null

  return (
    <div
      onClick={handleClick}
      style={{
        background: T.surface,
        border: `1px solid ${T.border}`,
        borderLeft: `3px solid ${clr}`,
        borderRadius: T.r,
        boxShadow: T.shadow,
        display: 'flex', flexDirection: 'column',
        cursor: 'pointer', transition: 'all 0.15s ease',
        position: 'relative', overflow: 'hidden',
      }}
    >
      {/* Copied overlay */}
      {isCopied && (
        <div style={{
          position: 'absolute', inset: 0,
          background: 'rgba(91,166,110,0.06)',
          borderRadius: T.r, pointerEvents: 'none', zIndex: 1,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <span style={{
            background: T.green, color: '#fff',
            padding: '4px 16px', borderRadius: 99,
            fontSize: 11, fontWeight: 600, letterSpacing: '0.5px',
          }}>COPIED</span>
        </div>
      )}

      {/* Header */}
      <div style={{
        padding: '12px 14px 8px',
        borderBottom: `1px solid ${T.divider}`,
        display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start',
      }}>
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap', marginBottom: 4 }}>
            <span style={{ fontSize: 15, fontWeight: 700, letterSpacing: '0.5px', color: T.text }}>
              {driver.name}
            </span>
            {driver.fixedBP && <Badge label="FIXED BP" color={T.c507} />}
            {driver.fixed && <Badge label="FIXED" color={T.text3} />}
            {driver.shortDay && <Badge label="2 ROUNDS" color={T.cBP} />}
          </div>
          <div style={{ fontSize: 9, color: T.text3, display: 'flex', gap: 6, alignItems: 'center', flexWrap: 'wrap' }}>
            <span style={{ color: clr, fontWeight: 500 }}>{driver.crew} CREW</span>
            <StartStepper
              name={driver.name}
              start={driver.start}
              isOverridden={isOverridden}
              onMinus={() => onAdjustStart(driver.name, -15)}
              onPlus={() => onAdjustStart(driver.name, 15)}
              onReset={() => onResetStart(driver.name)}
            />
          </div>
        </div>
      </div>

      {/* Route body */}
      <div style={{ padding: '10px 14px', flex: 1 }}>
        {isAlexis && rounds ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {rounds.map((line, i) => (
              <div key={i} style={{ borderLeft: `2px solid ${i === 0 ? T.cBP : T.c519}`, paddingLeft: 10 }}>
                <div style={{ fontSize: 9, color: i === 0 ? T.cBP : T.c519, fontWeight: 600, marginBottom: 4, letterSpacing: '0.5px' }}>
                  {i === 0 ? 'ROUND 1' : 'ROUND 2'}
                </div>
                <RouteSteps text={line} driverClr={i === 0 ? T.cBP : T.c519} />
              </div>
            ))}
          </div>
        ) : (
          <RouteSteps text={routeText} driverClr={clr} />
        )}
      </div>

      {/* Footer */}
      <div style={{
        padding: '8px 14px', borderTop: `1px solid ${T.divider}`,
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
      }}>
        <span style={{ fontSize: 9, color: T.text4 }}>
          {isCopied ? '✓ Copied to clipboard' : 'Tap to copy route'}
        </span>
        <span style={{
          fontSize: 8, color: isCopied ? T.green : T.text4,
          background: isCopied ? `${T.green}15` : 'transparent',
          padding: '2px 8px', borderRadius: 99,
          border: `1px solid ${isCopied ? `${T.green}33` : 'transparent'}`,
          fontWeight: isCopied ? 600 : 400, transition: 'all 0.2s ease',
        }}>{isCopied ? 'SENT' : 'COPY'}</span>
      </div>
    </div>
  )
}
