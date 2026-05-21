import { T } from '../styles/theme.js'

/**
 * SectionHeader — labeled divider for sections within a panel
 */
export function SectionHeader({ title, subtitle, action, style }) {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 12,
        ...style,
      }}
    >
      <div>
        <div style={{ fontSize: 13, fontWeight: 700, color: T.text, letterSpacing: '0.01em' }}>
          {title}
        </div>
        {subtitle && (
          <div style={{ fontSize: 11, color: T.text3, marginTop: 2 }}>
            {subtitle}
          </div>
        )}
      </div>
      {action && <div>{action}</div>}
    </div>
  )
}
