import { T } from '../styles/theme.js'

const variantStyles = {
  brand: { color: T.brand, background: T.brandBg, border: `1px solid ${T.brandBd}` },
  green: { color: T.green, background: 'rgba(91,166,110,0.12)', border: '1px solid rgba(91,166,110,0.25)' },
  red:   { color: T.red,   background: 'rgba(212,85,85,0.12)',  border: '1px solid rgba(212,85,85,0.25)' },
  amber: { color: T.amber, background: 'rgba(212,160,60,0.12)', border: '1px solid rgba(212,160,60,0.25)' },
  blue:  { color: T.blue,  background: 'rgba(91,155,199,0.12)', border: '1px solid rgba(91,155,199,0.25)' },
  muted: { color: T.text3, background: 'rgba(122,116,110,0.12)', border: `1px solid ${T.border}` },
}

/**
 * Badge — small inline label with a color variant
 * @param {'brand'|'green'|'red'|'amber'|'blue'|'muted'} variant
 */
export function Badge({ children, variant = 'muted', style }) {
  const vs = variantStyles[variant] || variantStyles.muted
  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 3,
        padding: '2px 7px',
        borderRadius: 4,
        fontSize: 11,
        fontWeight: 600,
        letterSpacing: '0.02em',
        lineHeight: 1.4,
        ...vs,
        ...style,
      }}
    >
      {children}
    </span>
  )
}
