import { useState } from 'react'
import { T } from '../../styles/theme.js'
import { SectionHeader } from '../../components/SectionHeader.jsx'
import { Badge } from '../../components/Badge.jsx'
import { MISSION, VALUES, MANTRA, SOPS, SOP_CATEGORIES } from './sops.js'

export function ManagementPanel() {
  const [activeCategory, setActiveCategory] = useState('All')
  const [expanded, setExpanded] = useState(null)

  const filteredSops = activeCategory === 'All'
    ? SOPS
    : SOPS.filter(s => s.category === activeCategory)

  function toggleExpand(id) {
    setExpanded(e => e === id ? null : id)
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      {/* Mission & Values */}
      <div style={{
        background: T.surface,
        border: `1px solid ${T.brandBd}`,
        borderRadius: T.r,
        padding: '18px 20px',
      }}>
        <div style={{ fontSize: 11, color: T.brand, fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 8 }}>
          Mission
        </div>
        <div style={{ fontSize: 15, color: T.text, lineHeight: 1.6, marginBottom: 16 }}>
          {MISSION}
        </div>
        <div style={{ fontSize: 11, color: T.text3, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 8 }}>
          Values
        </div>
        <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 6 }}>
          {VALUES.map((v, i) => (
            <li key={i} style={{ display: 'flex', gap: 8, alignItems: 'flex-start' }}>
              <span style={{ color: T.brand, marginTop: 2 }}>◆</span>
              <span style={{ fontSize: 13, color: T.text2 }}>{v}</span>
            </li>
          ))}
        </ul>
        <div style={{
          marginTop: 16, padding: '10px 14px',
          background: T.brandBg, borderRadius: T.rSm,
          fontStyle: 'italic', fontSize: 14, color: T.brand,
        }}>
          "{MANTRA}"
        </div>
      </div>

      {/* SOPs */}
      <SectionHeader
        title="Standard Operating Procedures"
        subtitle={`${SOPS.length} SOPs — ${SOPS.filter(s => s.status === 'active').length} active`}
      />

      {/* Category filter */}
      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
        {['All', ...SOP_CATEGORIES].map(cat => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            style={{
              padding: '4px 12px', borderRadius: 20, fontSize: 11,
              border: activeCategory === cat ? `1px solid ${T.brand}` : `1px solid ${T.border}`,
              background: activeCategory === cat ? T.brandBg : 'transparent',
              color: activeCategory === cat ? T.brand : T.text3,
              cursor: 'pointer', fontWeight: activeCategory === cat ? 600 : 400,
            }}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* SOP list */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {filteredSops.map(sop => (
          <div
            key={sop.id}
            style={{
              background: T.surface,
              border: `1px solid ${T.border}`,
              borderRadius: T.r,
              overflow: 'hidden',
            }}
          >
            <div
              onClick={() => toggleExpand(sop.id)}
              style={{
                display: 'flex', alignItems: 'center', gap: 10,
                padding: '12px 16px', cursor: 'pointer',
              }}
            >
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 2, flexWrap: 'wrap' }}>
                  <span style={{ fontWeight: 600, fontSize: 13, color: T.text }}>{sop.title}</span>
                  <Badge variant={sop.status === 'active' ? 'green' : 'muted'}>{sop.status}</Badge>
                  <Badge variant="blue">{sop.category}</Badge>
                </div>
                <div style={{ fontSize: 12, color: T.text3 }}>{sop.summary}</div>
              </div>
              <span style={{ color: T.text3, fontSize: 16 }}>
                {expanded === sop.id ? '▲' : '▼'}
              </span>
            </div>
            {expanded === sop.id && (
              <div style={{
                padding: '0 16px 14px',
                borderTop: `1px solid ${T.divider}`,
              }}>
                <div style={{ fontSize: 11, color: T.text3, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', margin: '12px 0 8px' }}>
                  Steps
                </div>
                <ol style={{ paddingLeft: 18, display: 'flex', flexDirection: 'column', gap: 6 }}>
                  {sop.steps.map((step, i) => (
                    <li key={i} style={{ fontSize: 12, color: T.text2, lineHeight: 1.5 }}>{step}</li>
                  ))}
                </ol>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
