import { Fragment } from 'react'
import { T } from '../../../styles/theme.js'

export function RouteSteps({ text, driverClr }) {
  if (!text) return null

  const colonIdx = text.indexOf(':')
  if (colonIdx === -1) {
    return <span style={{ color: T.text2, fontFamily: T.mono, fontSize: 11 }}>{text}</span>
  }

  const rawSteps = text.substring(colonIdx + 1).trim().split('→')

  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '3px 2px', alignItems: 'center' }}>
      {rawSteps.map((raw, i) => {
        const s = raw.trim()
        if (!s) return null

        let fg = driverClr || T.text2
        let bg = T.raised

        if (/^Scrap/i.test(s))       { fg = '#E87A7A'; bg = 'rgba(232,122,122,0.08)' }
        else if (s.includes('📞'))   { fg = T.brand;  bg = T.brandBg }
        else if (s.includes('⏰'))   { fg = T.amber;  bg = 'rgba(212,160,60,0.12)' }
        else if (/POD/i.test(s))     { fg = '#D4A03C'; bg = 'rgba(212,160,60,0.07)' }
        else if (/BP|1\/4/i.test(s)) { fg = T.cBP;   bg = 'rgba(212,145,95,0.08)' }
        else if (/home$/i.test(s))   { fg = T.green;  bg = 'rgba(91,166,110,0.08)' }
        else if (/block/i.test(s))   { fg = T.text2;  bg = T.surface }
        else if (/PRELOAD/i.test(s)) { fg = T.blue;   bg = 'rgba(91,155,199,0.08)' }

        return (
          <Fragment key={i}>
            {i > 0 && (
              <span style={{ color: T.text4, fontSize: 8, margin: '0 1px', userSelect: 'none' }}>→</span>
            )}
            <span style={{
              display: 'inline-block',
              padding: '2px 7px',
              borderRadius: T.rXs,
              fontSize: 10.5,
              fontFamily: T.mono,
              lineHeight: 1.5,
              color: fg,
              background: bg,
              border: s.includes('📞') ? `1px solid ${T.brandBd}` : '1px solid transparent',
            }}>
              {s}
            </span>
          </Fragment>
        )
      })}
    </div>
  )
}
