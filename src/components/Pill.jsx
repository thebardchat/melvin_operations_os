import { T } from '../styles/theme.js'

/**
 * Pill — a clickable chip, often used for filters/tabs
 */
export function Pill({ children, active, onClick, color, style }) {
  return (
    <button
      onClick={onClick}
      style={{
        padding: '5px 14px',
        borderRadius: 20,
        border: active
          ? `1px solid ${color || T.brand}`
          : `1px solid ${T.border}`,
        background: active
          ? (color ? `${color}22` : T.brandBg)
          : 'transparent',
        color: active ? (color || T.brand) : T.text2,
        fontSize: 12,
        fontWeight: active ? 600 : 400,
        cursor: 'pointer',
        transition: 'all 0.15s',
        whiteSpace: 'nowrap',
        ...style,
      }}
    >
      {children}
    </button>
  )
}
