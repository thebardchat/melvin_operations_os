import { T } from '../../../styles/theme.js'

const typeConfig = {
  load: { icon: '⬡', color: T.green },
  call: { icon: '☎', color: T.amber },
  note: { icon: 'ℹ', color: T.text3 },
}

export function RouteSteps({ steps }) {
  if (!steps || steps.length === 0) {
    return <div style={{ color: T.text4, fontSize: 11, fontStyle: 'italic' }}>No route</div>
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
      {steps.map((s, i) => {
        const cfg = typeConfig[s.type] || typeConfig.note
        return (
          <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 6 }}>
            <span style={{ color: cfg.color, fontSize: 12, minWidth: 14, paddingTop: 1 }}>
              {cfg.icon}
            </span>
            <div style={{ flex: 1 }}>
              {s.type === 'load' && (
                <span style={{ fontSize: 12, color: T.text }}>
                  <span style={{
                    fontFamily: T.mono,
                    fontWeight: 700,
                    color: T.green,
                    background: 'rgba(91,166,110,0.10)',
                    padding: '1px 6px',
                    borderRadius: 3,
                    marginRight: 5,
                  }}>
                    {s.plant}
                  </span>
                  {s.note && (
                    <span style={{ color: T.text3, fontSize: 11 }}>{s.note}</span>
                  )}
                </span>
              )}
              {s.type === 'call' && (
                <span style={{ fontSize: 12 }}>
                  <span style={{ color: T.amber, fontWeight: 600 }}>{s.contact}</span>
                  {s.note && <span style={{ color: T.text3, marginLeft: 5, fontSize: 11 }}>{s.note}</span>}
                </span>
              )}
              {s.type === 'note' && (
                <span style={{ fontSize: 11, color: T.text3, fontStyle: 'italic' }}>{s.note}</span>
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
}
