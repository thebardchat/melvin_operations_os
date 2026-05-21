import { T } from '../styles/theme.js'

/**
 * StatCard — a metric card with label, value, and optional delta
 */
export function StatCard({ label, value, delta, color, icon, style }) {
  const deltaColor = delta > 0 ? T.green : delta < 0 ? T.red : T.text3
  return (
    <div
      style={{
        background: T.surface,
        border: `1px solid ${T.border}`,
        borderRadius: T.r,
        padding: '16px 20px',
        boxShadow: T.shadow,
        display: 'flex',
        flexDirection: 'column',
        gap: 6,
        ...style,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        {icon && <span style={{ fontSize: 16 }}>{icon}</span>}
        <span style={{ fontSize: 11, color: T.text3, fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
          {label}
        </span>
      </div>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
        <span style={{ fontSize: 28, fontWeight: 700, color: color || T.text, lineHeight: 1 }}>
          {value}
        </span>
        {delta !== undefined && (
          <span style={{ fontSize: 12, color: deltaColor }}>
            {delta > 0 ? '+' : ''}{delta}
          </span>
        )}
      </div>
    </div>
  )
}
