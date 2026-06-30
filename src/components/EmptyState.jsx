import { T } from '../styles/theme.js'

/**
 * EmptyState — friendly placeholder when a list/panel has no items.
 */
export function EmptyState({ icon = '✓', title = 'Nothing here', hint, style }) {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 6,
        padding: '40px 20px',
        textAlign: 'center',
        color: T.text3,
        background: T.surface,
        border: `1px dashed ${T.border}`,
        borderRadius: T.r,
        ...style,
      }}
    >
      <div style={{ fontSize: 28, opacity: 0.8 }}>{icon}</div>
      <div style={{ fontSize: 14, fontWeight: 600, color: T.text2 }}>{title}</div>
      {hint && <div style={{ fontSize: 12, color: T.text3, maxWidth: 360 }}>{hint}</div>}
    </div>
  )
}
