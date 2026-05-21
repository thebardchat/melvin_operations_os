import { useState } from 'react'
import { T } from '../../styles/theme.js'
import { SectionHeader } from '../../components/SectionHeader.jsx'
import { buildMorningBriefing } from './buildMorningBriefing.js'
import { copyToClipboard } from '../../utils/clipboard.js'
import { todayStr } from '../../utils/date.js'

export function BriefingPanel() {
  const [date, setDate] = useState(todayStr())
  const [copied, setCopied] = useState(false)
  const text = buildMorningBriefing(date)

  async function handleCopy() {
    await copyToClipboard(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <SectionHeader
        title="Morning Briefing"
        subtitle="Auto-generated daily briefing for SRM North Alabama"
        action={
          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            <input
              type="date"
              value={date}
              onChange={e => setDate(e.target.value)}
              style={{ background: T.raised, color: T.text, border: `1px solid ${T.border}`, borderRadius: 6, padding: '4px 8px', fontSize: 12, fontFamily: T.mono }}
            />
            <button
              onClick={handleCopy}
              style={{
                padding: '6px 14px', borderRadius: 6, fontSize: 12,
                border: `1px solid ${copied ? T.green : T.border}`,
                background: copied ? 'rgba(91,166,110,0.12)' : T.raised,
                color: copied ? T.green : T.text2,
                cursor: 'pointer',
              }}
            >
              {copied ? 'Copied!' : 'Copy Briefing'}
            </button>
          </div>
        }
      />
      <div style={{
        background: T.surface,
        border: `1px solid ${T.border}`,
        borderRadius: T.r,
        padding: 20,
      }}>
        <pre style={{
          fontFamily: T.mono,
          fontSize: 12,
          color: T.text,
          whiteSpace: 'pre-wrap',
          lineHeight: 1.7,
          margin: 0,
        }}>
          {text}
        </pre>
      </div>
    </div>
  )
}
