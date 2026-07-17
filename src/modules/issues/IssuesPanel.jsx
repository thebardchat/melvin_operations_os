import { useState } from 'react'
import { T } from '../../styles/theme.js'
import { SectionHeader } from '../../components/SectionHeader.jsx'
import { StatCard } from '../../components/StatCard.jsx'
import { Badge } from '../../components/Badge.jsx'
import { Pill } from '../../components/Pill.jsx'
import { EmptyState } from '../../components/EmptyState.jsx'
import {
  SEED_ISSUES, isIssueOpen,
  ISSUE_SEVERITY_VARIANT, ISSUE_STATUS_VARIANT,
} from './issueModel.js'

const FILTERS = ['Open', 'All', 'Resolved']

export function IssuesPanel() {
  const [filter, setFilter] = useState('Open')

  const issues = SEED_ISSUES.filter(i => {
    if (filter === 'All') return true
    if (filter === 'Open') return isIssueOpen(i)
    if (filter === 'Resolved') return i.status === 'Resolved'
    return true
  })

  const open = SEED_ISSUES.filter(isIssueOpen).length
  const highSev = SEED_ISSUES.filter(i => isIssueOpen(i) && (i.severity === 'High' || i.severity === 'Critical')).length

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <SectionHeader title="Issues / Complaints" subtitle="Every issue gets an owner, an action, and a follow-up" />

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: 10 }}>
        <StatCard label="Open" value={open} icon="⚠" color={open ? T.red : T.green} />
        <StatCard label="High / Critical" value={highSev} icon="🔴" color={highSev ? T.red : T.green} />
        <StatCard label="Total" value={SEED_ISSUES.length} icon="📋" />
      </div>

      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
        {FILTERS.map(f => <Pill key={f} active={filter === f} onClick={() => setFilter(f)}>{f}</Pill>)}
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {issues.length === 0 && <EmptyState icon="✓" title="No issues match this filter" hint="A clean board is a good board." />}
        {issues.map(i => (
          <div key={i.id} style={{
            background: T.surface, border: `1px solid ${T.border}`,
            borderLeft: `3px solid ${i.severity === 'Critical' ? T.red : i.severity === 'High' ? T.brand : i.severity === 'Medium' ? T.amber : T.border}`,
            borderRadius: T.r, padding: '12px 16px',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap', marginBottom: 4 }}>
              <span style={{ fontWeight: 700, fontSize: 13, color: T.text }}>{i.issueType}</span>
              <Badge variant={ISSUE_SEVERITY_VARIANT[i.severity]}>{i.severity}</Badge>
              <Badge variant={ISSUE_STATUS_VARIANT[i.status]}>{i.status}</Badge>
              <span style={{ fontSize: 11, color: T.text3 }}>· {i.jobName} · {i.orderNumber || '—'}</span>
              <span style={{ marginLeft: 'auto', fontFamily: T.mono, fontSize: 11, color: T.text4 }}>{i.date}</span>
            </div>
            <div style={{ fontSize: 13, color: T.text2 }}>{i.description}</div>
            {i.immediateAction && <div style={{ fontSize: 11, color: T.text3, marginTop: 4 }}>Action: {i.immediateAction}</div>}
            <div style={{ fontSize: 11, color: T.text3, marginTop: 4 }}>
              Notified: {i.whoWasNotified || '—'}
              {i.followUpNeeded ? <span style={{ color: T.amber }}> · follow-up {i.followUpDate || 'needed'}</span> : ''}
            </div>
            {i.resolution && <div style={{ fontSize: 11, color: T.green, marginTop: 4 }}>✓ {i.resolution}</div>}
          </div>
        ))}
      </div>

      <div style={{ fontSize: 11, color: T.text4 }}>
        MVP: sample records only. Phase 2 adds issue entry + localStorage persistence.
      </div>
    </div>
  )
}
