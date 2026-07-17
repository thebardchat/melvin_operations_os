import { useState } from 'react'
import { T } from '../../styles/theme.js'
import { SectionHeader } from '../../components/SectionHeader.jsx'
import { StatCard } from '../../components/StatCard.jsx'
import { Badge } from '../../components/Badge.jsx'
import { Pill } from '../../components/Pill.jsx'
import { EmptyState } from '../../components/EmptyState.jsx'
import {
  SEED_CALLBACKS, isCallbackActive,
  CALLBACK_STATUS_VARIANT,
} from './callbackModel.js'

const FILTERS = ['Active', 'All', 'Completed']

export function CallbackQueue() {
  const [filter, setFilter] = useState('Active')

  const callbacks = SEED_CALLBACKS.filter(cb => {
    if (filter === 'All') return true
    if (filter === 'Active') return isCallbackActive(cb)
    if (filter === 'Completed') return cb.status === 'Completed'
    return true
  }).sort((a, b) => (a.dueTime || '').localeCompare(b.dueTime || ''))

  const overdue = SEED_CALLBACKS.filter(cb => cb.status === 'Overdue').length
  const active = SEED_CALLBACKS.filter(isCallbackActive).length

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <SectionHeader title="Callback Queue" subtitle="Keep every follow-up visible until it's done" />

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: 10 }}>
        <StatCard label="Active" value={active} icon="↩" color={T.blue} />
        <StatCard label="Overdue" value={overdue} icon="⏰" color={overdue ? T.red : T.green} />
        <StatCard label="Total" value={SEED_CALLBACKS.length} icon="📋" />
      </div>

      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
        {FILTERS.map(f => <Pill key={f} active={filter === f} onClick={() => setFilter(f)}>{f}</Pill>)}
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {callbacks.length === 0 && <EmptyState icon="✓" title="Queue is clear" hint="No callbacks match this filter." />}
        {callbacks.map(cb => (
          <div key={cb.id} style={{
            background: T.surface, border: `1px solid ${T.border}`,
            borderLeft: `3px solid ${cb.status === 'Overdue' ? T.red : cb.status === 'Due soon' ? T.amber : T.border}`,
            borderRadius: T.r, padding: '12px 16px',
            display: 'flex', alignItems: 'center', gap: 12,
          }}>
            <div style={{ fontFamily: T.mono, fontSize: 15, fontWeight: 700, color: cb.status === 'Overdue' ? T.red : T.text2, minWidth: 52 }}>
              {cb.dueTime}
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap', marginBottom: 2 }}>
                <span style={{ fontWeight: 700, fontSize: 13, color: T.text }}>{cb.company}</span>
                <Badge variant={CALLBACK_STATUS_VARIANT[cb.status]}>{cb.status}</Badge>
                {cb.relatedOrderNumber && <span style={{ fontSize: 11, color: T.text3 }}>· {cb.relatedOrderNumber}</span>}
              </div>
              <div style={{ fontSize: 13, color: T.text2 }}>{cb.reason}</div>
              {cb.notes && <div style={{ fontSize: 11, color: T.text3, marginTop: 2, fontStyle: 'italic' }}>{cb.notes}</div>}
            </div>
          </div>
        ))}
      </div>

      <div style={{ fontSize: 11, color: T.text4 }}>
        MVP: sample records only. Phase 2 adds add/complete + localStorage persistence.
      </div>
    </div>
  )
}
