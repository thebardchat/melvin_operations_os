import { useState } from 'react'
import { T } from '../../../styles/theme.js'
import { SectionHeader } from '../../../components/SectionHeader.jsx'

function fallbackCopy(text) {
  const el = document.createElement('textarea')
  el.value = text
  el.style.cssText = 'position:fixed;opacity:0'
  document.body.appendChild(el)
  el.focus()
  el.select()
  try { document.execCommand('copy') } catch (_) {}
  document.body.removeChild(el)
}

async function copyText(text) {
  if (navigator.clipboard?.writeText) {
    return navigator.clipboard.writeText(text).catch(() => fallbackCopy(text))
  }
  fallbackCopy(text)
}

export function AudiblePanel({ routes }) {
  const [copied, setCopied] = useState(null)

  async function copyAll() {
    const text = routes.map(r => r.routeText).join('\n\n')
    await copyText(text)
    setCopied('all')
    setTimeout(() => setCopied(null), 2000)
  }

  async function copyOne(name, text) {
    await copyText(text)
    setCopied(name)
    setTimeout(() => setCopied(null), 2000)
  }

  return (
    <div style={{ background: T.surface, border: `1px solid ${T.border}`, borderRadius: T.r, padding: 16 }}>
      <SectionHeader
        title="Audible View"
        subtitle="All routes as plain text — ready to paste"
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
          <div
            key={r.driver.name}
            onClick={() => copyOne(r.driver.name, r.routeText)}
            style={{
              background: copied === r.driver.name ? 'rgba(91,166,110,0.06)' : T.raised,
              border: `1px solid ${copied === r.driver.name ? T.green : 'transparent'}`,
              borderRadius: T.rSm,
              padding: '10px 12px',
              cursor: 'pointer',
              transition: 'all 0.15s',
            }}
          >
            <pre style={{
              fontFamily: T.mono, fontSize: 11, color: T.text,
              whiteSpace: 'pre-wrap', margin: 0, lineHeight: 1.6,
            }}>
              {r.routeText}
            </pre>
          </div>
        ))}
      </div>
    </div>
  )
}
