import { useState } from 'react'
import { T } from '../../styles/theme.js'
import { SectionHeader } from '../../components/SectionHeader.jsx'
import { Badge } from '../../components/Badge.jsx'
import { StatCard } from '../../components/StatCard.jsx'
import {
  SEED_REPAIRS, STATUS_COLORS, PRIORITY_COLORS,
  REPAIR_STATUSES, REPAIR_PRIORITIES,
} from './repairsModel.js'

const priorityVariantMap = {
  low: 'muted', medium: 'amber', high: 'brand', critical: 'red',
}
const statusVariantMap = {
  open: 'red', 'in-progress': 'amber', resolved: 'green', deferred: 'muted',
}

export function RepairsPanel() {
  const [filter, setFilter] = useState('all')
  const repairs = filter === 'all'
    ? SEED_REPAIRS
    : SEED_REPAIRS.filter(r => r.status === filter)

  const openCount = SEED_REPAIRS.filter(r => r.status === 'open').length
  const inProgressCount = SEED_REPAIRS.filter(r => r.status === 'in-progress').length
  const criticalCount = SEED_REPAIRS.filter(r => r.priority === 'critical').length

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <SectionHeader
        title="Fleet Repairs"
        subtitle="Repair tickets for SRM North Alabama trucks"
      />

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: 10 }}>
        <StatCard label="Open" value={openCount} color={T.red} icon="🔴" />
        <StatCard label="In Progress" value={inProgressCount} color={T.amber} icon="🟡" />
        <StatCard label="Critical" value={criticalCount} color={T.red} icon="⚠" />
        <StatCard label="Total" value={SEED_REPAIRS.length} icon="📋" />
      </div>

      {/* Filter tabs */}
      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
        {['all', ...REPAIR_STATUSES].map(s => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            style={{
              padding: '4px 12px', borderRadius: 20, fontSize: 11,
              border: filter === s ? `1px solid ${T.brand}` : `1px solid ${T.border}`,
              background: filter === s ? T.brandBg : 'transparent',
              color: filter === s ? T.brand : T.text3,
              cursor: 'pointer', fontWeight: filter === s ? 600 : 400,
            }}
          >
            {s}
          </button>
        ))}
      </div>

      {/* Repair cards */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {repairs.map(r => (
          <div
            key={r.id}
            style={{
              background: T.surface,
              border: `1px solid ${T.border}`,
              borderLeft: `3px solid ${STATUS_COLORS[r.status]}`,
              borderRadius: T.r,
              padding: '12px 16px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10, marginBottom: 6 }}>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4, flexWrap: 'wrap' }}>
                  <span style={{ fontWeight: 700, fontSize: 13, color: T.text }}>{r.truck}</span>
                  <span style={{ fontSize: 12, color: T.text3 }}>— {r.driver}</span>
                  <Badge variant={statusVariantMap[r.status]}>{r.status}</Badge>
                  <Badge variant={priorityVariantMap[r.priority]}>{r.priority}</Badge>
                </div>
                <div style={{ fontSize: 13, color: T.text2 }}>{r.description}</div>
                {r.notes && (
                  <div style={{ fontSize: 11, color: T.text3, marginTop: 4, fontStyle: 'italic' }}>{r.notes}</div>
                )}
              </div>
              <div style={{ fontSize: 10, color: T.text4, whiteSpace: 'nowrap' }}>
                {r.reportedDate}
                {r.resolvedDate && <div>Resolved: {r.resolvedDate}</div>}
              </div>
            </div>
          </div>
        ))}
        {repairs.length === 0 && (
          <div style={{ color: T.text3, textAlign: 'center', padding: 40 }}>
            No repairs matching this filter
          </div>
        )}
      </div>

      <div style={{ fontSize: 11, color: T.text4 }}>
        MVP: Seed data only — full CRUD with localStorage persistence coming in Phase 2
      </div>
    </div>
  )
}
