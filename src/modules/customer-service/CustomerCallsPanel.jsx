import { useState } from 'react'
import { T } from '../../styles/theme.js'
import { SectionHeader } from '../../components/SectionHeader.jsx'
import { StatCard } from '../../components/StatCard.jsx'
import { Badge } from '../../components/Badge.jsx'
import { Pill } from '../../components/Pill.jsx'
import { EmptyState } from '../../components/EmptyState.jsx'
import {
  SEED_CALLS, isCallOpen,
  URGENCY_VARIANT, CALL_STATUS_VARIANT,
} from './customerCallModel.js'

const FILTERS = ['All', 'Open', 'Resolved']

export function CustomerCallsPanel() {
  const [filter, setFilter] = useState('Open')

  const calls = SEED_CALLS.filter(c => {
    if (filter === 'All') return true
    if (filter === 'Open') return isCallOpen(c)
    if (filter === 'Resolved') return c.status === 'Resolved'
    return true
  })

  const openCount = SEED_CALLS.filter(isCallOpen).length
  const highCount = SEED_CALLS.filter(c => isCallOpen(c) && (c.urgency === 'High' || c.urgency === 'Critical')).length

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <SectionHeader title="Customer Calls" subtitle="Every call logged — name, job, request, status (sample data)" />

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: 10 }}>
        <StatCard label="Open" value={openCount} icon="📞" color={T.amber} />
        <StatCard label="High / Critical" value={highCount} icon="⚠" color={highCount ? T.red : T.green} />
        <StatCard label="Logged Today" value={SEED_CALLS.length} icon="🗒" />
      </div>

      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
        {FILTERS.map(f => <Pill key={f} active={filter === f} onClick={() => setFilter(f)}>{f}</Pill>)}
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {calls.length === 0 && <EmptyState icon="📞" title="No calls match this filter" />}
        {calls.map(c => (
          <div key={c.id} style={{
            background: T.surface, border: `1px solid ${T.border}`,
            borderLeft: `3px solid ${c.urgency === 'Critical' ? T.red : c.urgency === 'High' ? T.amber : T.border}`,
            borderRadius: T.r, padding: '12px 16px',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap', marginBottom: 4 }}>
              <span style={{ fontFamily: T.mono, fontSize: 12, color: T.text3 }}>{c.time}</span>
              <span style={{ fontWeight: 700, fontSize: 13, color: T.text }}>{c.company}</span>
              <Badge variant="blue">{c.requestType}</Badge>
              <Badge variant={URGENCY_VARIANT[c.urgency]}>{c.urgency}</Badge>
              <Badge variant={CALL_STATUS_VARIANT[c.status]}>{c.status}</Badge>
            </div>
            <div style={{ fontSize: 13, color: T.text2 }}>{c.topic}</div>
            <div style={{ fontSize: 11, color: T.text3, marginTop: 4 }}>
              {c.jobName} · Order {c.orderNumber || '—'}{c.followUpTime ? ` · follow-up ${c.followUpTime}` : ''}
            </div>
            {c.notes && <div style={{ fontSize: 11, color: T.text3, marginTop: 4, fontStyle: 'italic' }}>{c.notes}</div>}
          </div>
        ))}
      </div>

      <div style={{ fontSize: 11, color: T.text4 }}>
        MVP: sample records only. Phase 2 adds call entry + localStorage persistence.
      </div>
    </div>
  )
}
