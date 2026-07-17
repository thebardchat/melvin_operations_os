import { useState } from 'react'
import { T } from '../../styles/theme.js'
import { SectionHeader } from '../../components/SectionHeader.jsx'
import { Pill } from '../../components/Pill.jsx'
import { buildMorningBriefing, buildEndOfDayCloseout, buildWeeklyReport } from './buildMorningBriefing.js'
import { copyToClipboard } from '../../utils/clipboard.js'
import { todayStr } from '../../utils/date.js'

const VIEWS = [
  { id: 'morning', label: 'Morning' },
  { id: 'eod', label: 'End of Day' },
  { id: 'weekly', label: 'Weekly' },
]

export function BriefingPanel() {
  const [date, setDate] = useState(todayStr())
  const [view, setView] = useState('morning')
  const [copied, setCopied] = useState(false)

  const text = view === 'morning'
    ? buildMorningBriefing(date)
    : view === 'eod'
      ? buildEndOfDayCloseout(date)
      : buildWeeklyReport()

  async function handleCopy() {
    await copyToClipboard(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <SectionHeader
        title="Briefing"
        subtitle="Plain-text briefing — copy, push, or TTS (SRM North Alabama)"
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
              {copied ? 'Copied!' : 'Copy'}
            </button>
          </div>
        }
      />

      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
        {VIEWS.map(v => <Pill key={v.id} active={view === v.id} onClick={() => setView(v.id)}>{v.label}</Pill>)}
      </div>

      <div style={{ background: T.surface, border: `1px solid ${T.border}`, borderRadius: T.r, padding: 20 }}>
        <pre style={{ fontFamily: T.mono, fontSize: 12, color: T.text, whiteSpace: 'pre-wrap', lineHeight: 1.7, margin: 0 }}>
          {text}
        </pre>
      </div>
    </div>
  )
}
