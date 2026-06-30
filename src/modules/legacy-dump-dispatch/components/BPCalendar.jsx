import { T } from '../../../styles/theme.js'
import { SectionHeader } from '../../../components/SectionHeader.jsx'
import { getBPCalendar } from '../engine/rotation.js'
import { BP_GROUPS } from '../../../tenants/srm-north-alabama/drivers.js'

const groupColors = { A: T.c507, B: T.c519, C: T.c506 }

export function BPCalendar({ date }) {
  const calendar = getBPCalendar(date, 7)

  return (
    <div style={{
      background: T.surface,
      border: `1px solid ${T.border}`,
      borderRadius: T.r,
      padding: 16,
    }}>
      <SectionHeader
        title="BP Calendar"
        subtitle="7-day Bridgeport rotation preview"
      />
      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
        {calendar.map(day => {
          const color = groupColors[day.group] || T.text3
          const isToday = day.date === date
          return (
            <div
              key={day.date}
              style={{
                display: 'flex', alignItems: 'center', gap: 12,
                padding: '8px 12px', borderRadius: T.rSm,
                background: isToday ? T.raised : 'transparent',
                border: isToday ? `1px solid ${T.border}` : '1px solid transparent',
              }}
            >
              <div style={{ minWidth: 90 }}>
                <div style={{ fontSize: 12, color: isToday ? T.text : T.text2, fontWeight: isToday ? 700 : 400 }}>
                  {new Date(day.date + 'T00:00:00').toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
                </div>
                {day.isTF && (
                  <div style={{ fontSize: 10, color: T.amber }}>TUE/FRI</div>
                )}
              </div>
              <div
                style={{
                  width: 26, height: 26, borderRadius: '50%',
                  background: `${color}22`, border: `2px solid ${color}`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontWeight: 700, fontSize: 12, color,
                }}
              >
                {day.group}
              </div>
              <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                {day.drivers.map(name => (
                  <span key={name} style={{
                    fontSize: 11, color, padding: '1px 7px',
                    borderRadius: 4, background: `${color}18`,
                    border: `1px solid ${color}30`,
                  }}>
                    {name}
                  </span>
                ))}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
