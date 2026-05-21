import { T } from '../../../styles/theme.js'
import { SectionHeader } from '../../../components/SectionHeader.jsx'
import { formatRouteText } from '../engine/buildRoute.js'
import { copyToClipboard } from '../../../utils/clipboard.js'
import { useState } from 'react'

export function AudiblePanel({ routes }) {
  const [copied, setCopied] = useState(null)

  async function copyAll() {
    const text = routes
      .map(r => formatRouteText(r.driver, r.steps))
      .join('\n\n---\n\n')
    await copyToClipboard(text)
    setCopied('all')
    setTimeout(() => setCopied(null), 2000)
  }

  return (
    <div style={{
      background: T.surface,
      border: `1px solid ${T.border}`,
      borderRadius: T.r,
      padding: 16,
    }}>
      <SectionHeader
        title="Audible View"
        subtitle="All routes as plain text — ready to paste into messages"
        action={
          <button
            onClick={copyAll}
            style={{
              padding: '5px 12px', borderRadius: 6,
              border: `1px solid ${T.border}`,
              background: copied === 'all' ? 'rgba(91,166,110,0.12)' : T.raised,
              color: copied === 'all' ? T.green : T.text2,
              fontSize: 12, cursor: 'pointer',
            }}
          >
            {copied === 'all' ? 'Copied!' : 'Copy All'}
          </button>
        }
      />
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {routes.map(r => (
          <div key={r.driver.name} style={{
            background: T.raised,
            borderRadius: T.rSm,
            padding: '10px 12px',
          }}>
            <pre style={{
              fontFamily: T.mono,
              fontSize: 11,
              color: T.text,
              whiteSpace: 'pre-wrap',
              margin: 0,
              lineHeight: 1.6,
            }}>
              {formatRouteText(r.driver, r.steps)}
            </pre>
          </div>
        ))}
      </div>
    </div>
  )
}
