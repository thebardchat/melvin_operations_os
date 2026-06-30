import { useState } from 'react'
import { T } from '../../styles/theme.js'
import { SectionHeader } from '../../components/SectionHeader.jsx'
import { StatCard } from '../../components/StatCard.jsx'
import { Badge } from '../../components/Badge.jsx'
import { Pill } from '../../components/Pill.jsx'
import { EmptyState } from '../../components/EmptyState.jsx'
import {
  SEED_ORDER_CHANGES, isOrderChangeOpen,
  ORDER_CHANGE_STATUS_VARIANT,
} from './orderChangeModel.js'

const FILTERS = ['Open', 'All', 'Completed', 'Canceled']

function Delta({ label, from, to }) {
  const changed = String(from) !== String(to)
  return (
    <div style={{ fontSize: 11, color: T.text3 }}>
      <span style={{ color: T.text3 }}>{label}: </span>
      <span style={{ color: changed ? T.text3 : T.text2, textDecoration: changed ? 'line-through' : 'none' }}>{from || '—'}</span>
      {changed && <span style={{ color: T.brand }}> → {to || '—'}</span>}
    </div>
  )
}

export function OrderChangesPanel() {
  const [filter, setFilter] = useState('Open')

  const changes = SEED_ORDER_CHANGES.filter(oc => {
    if (filter === 'All') return true
    if (filter === 'Open') return isOrderChangeOpen(oc)
    return oc.status === filter
  })

  const open = SEED_ORDER_CHANGES.filter(isOrderChangeOpen).length
  const pending = SEED_ORDER_CHANGES.filter(oc => oc.status === 'Requested').length

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <SectionHeader
        title="Order Changes"
        subtitle="Who changed it · when · who approved · who was told"
      />

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: 10 }}>
        <StatCard label="Open" value={open} icon="✎" color={T.blue} />
        <StatCard label="Awaiting Approval" value={pending} icon="⏳" color={pending ? T.amber : T.green} />
        <StatCard label="Total" value={SEED_ORDER_CHANGES.length} icon="📋" />
      </div>

      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
        {FILTERS.map(f => <Pill key={f} active={filter === f} onClick={() => setFilter(f)}>{f}</Pill>)}
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {changes.length === 0 && <EmptyState icon="✎" title="No order changes match this filter" />}
        {changes.map(oc => (
          <div key={oc.id} style={{
            background: T.surface, border: `1px solid ${T.border}`, borderRadius: T.r, padding: '12px 16px',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap', marginBottom: 6 }}>
              <span style={{ fontFamily: T.mono, fontSize: 12, color: T.brand, fontWeight: 700 }}>{oc.orderNumber}</span>
              <span style={{ fontWeight: 700, fontSize: 13, color: T.text }}>{oc.customerName}</span>
              <span style={{ fontSize: 12, color: T.text3 }}>· {oc.jobName}</span>
              <Badge variant={ORDER_CHANGE_STATUS_VARIANT[oc.status]}>{oc.status}</Badge>
              <span style={{ marginLeft: 'auto', fontFamily: T.mono, fontSize: 11, color: T.text4 }}>{oc.timestamp}</span>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', gap: 4, marginBottom: 6 }}>
              <Delta label="Time" from={oc.originalTime} to={oc.newTime} />
              <Delta label="Yards" from={oc.originalYards} to={oc.newYards} />
              <div style={{ fontSize: 11, color: T.text3 }}>Mix: {oc.mixDesign} · Slump {oc.slump}</div>
            </div>
            <div style={{ fontSize: 12, color: T.text2 }}>Reason: {oc.changeReason}</div>
            <div style={{ fontSize: 11, color: T.text3, marginTop: 4 }}>
              Requested by <b style={{ color: T.text2 }}>{oc.requestedBy}</b>
              {oc.approvedBy ? <> · Approved by <b style={{ color: T.text2 }}>{oc.approvedBy}</b></> : ' · Not yet approved'}
            </div>
            {oc.notes && <div style={{ fontSize: 11, color: T.text3, marginTop: 4, fontStyle: 'italic' }}>{oc.notes}</div>}
          </div>
        ))}
      </div>

      <div style={{ fontSize: 11, color: T.text4 }}>
        MVP: sample records only. This log is what protects the office when someone asks "who changed that?"
      </div>
    </div>
  )
}
