import { useState } from 'react'
import { T } from '../../styles/theme.js'
import { SectionHeader } from '../../components/SectionHeader.jsx'
import { StatCard } from '../../components/StatCard.jsx'
import { Badge } from '../../components/Badge.jsx'
import { Pill } from '../../components/Pill.jsx'
import { EmptyState } from '../../components/EmptyState.jsx'
import { usePersistentList } from '../../hooks/usePersistentList.js'
import { makeId } from '../../utils/ids.js'
import {
  SEED_ORDER_CHANGES, isOrderChangeOpen, newOrderChange,
  ORDER_CHANGE_STATUSES, ORDER_CHANGE_STATUS_VARIANT,
} from './orderChangeModel.js'

const FILTERS = ['Open', 'All', 'Completed', 'Canceled']

const inputStyle = {
  background: T.raised,
  border: `1px solid ${T.border}`,
  color: T.text,
  borderRadius: T.rSm,
  padding: '8px 10px',
  font: `13px ${T.font}`,
  minWidth: 0,
}

const smallButton = {
  border: `1px solid ${T.border}`,
  background: T.raised,
  color: T.text2,
  borderRadius: T.rSm,
  padding: '7px 10px',
  fontSize: 12,
  cursor: 'pointer',
}

function nowTime() {
  return new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false })
}

function Delta({ label, from, to }) {
  const changed = String(from) !== String(to)
  return (
    <div style={{ fontSize: 11, color: T.text3 }}>
      <span style={{ color: T.text3 }}>{label}: </span>
      <span style={{ color: changed ? T.text3 : T.text2, textDecoration: changed ? 'line-through' : 'none' }}>{from || '-'}</span>
      {changed && <span style={{ color: T.brand }}> -> {to || '-'}</span>}
    </div>
  )
}

function OrderChangeForm({ onAdd }) {
  const [draft, setDraft] = useState(() => newOrderChange({ timestamp: nowTime() }))
  const canAdd = draft.orderNumber.trim() && draft.customerName.trim() && draft.changeReason.trim()

  function update(field, value) {
    setDraft(current => ({ ...current, [field]: value }))
  }

  function submit(event) {
    event.preventDefault()
    if (!canAdd) return
    onAdd({
      ...draft,
      id: makeId('oc'),
      timestamp: draft.timestamp || nowTime(),
      orderNumber: draft.orderNumber.trim(),
      customerName: draft.customerName.trim(),
      jobName: draft.jobName.trim(),
      originalTime: draft.originalTime.trim(),
      newTime: draft.newTime.trim(),
      originalYards: draft.originalYards.trim(),
      newYards: draft.newYards.trim(),
      mixDesign: draft.mixDesign.trim(),
      slump: draft.slump.trim(),
      requestedBy: draft.requestedBy.trim(),
      approvedBy: draft.approvedBy.trim(),
      changeReason: draft.changeReason.trim(),
      notes: draft.notes.trim(),
    })
    setDraft(newOrderChange({ timestamp: nowTime() }))
  }

  return (
    <form onSubmit={submit} style={{ background: T.surface, border: `1px solid ${T.border}`, borderRadius: T.r, padding: 14, display: 'grid', gap: 10 }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: 8 }}>
        <input style={inputStyle} value={draft.orderNumber} onChange={e => update('orderNumber', e.target.value)} placeholder="Order #" />
        <input style={inputStyle} value={draft.customerName} onChange={e => update('customerName', e.target.value)} placeholder="Customer" />
        <input style={inputStyle} value={draft.jobName} onChange={e => update('jobName', e.target.value)} placeholder="Job name" />
        <input style={inputStyle} value={draft.timestamp} onChange={e => update('timestamp', e.target.value)} placeholder="Time" />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(110px, 1fr))', gap: 8 }}>
        <input style={inputStyle} value={draft.originalTime} onChange={e => update('originalTime', e.target.value)} placeholder="Old time" />
        <input style={inputStyle} value={draft.newTime} onChange={e => update('newTime', e.target.value)} placeholder="New time" />
        <input style={inputStyle} value={draft.originalYards} onChange={e => update('originalYards', e.target.value)} placeholder="Old yds" />
        <input style={inputStyle} value={draft.newYards} onChange={e => update('newYards', e.target.value)} placeholder="New yds" />
        <input style={inputStyle} value={draft.mixDesign} onChange={e => update('mixDesign', e.target.value)} placeholder="Mix" />
        <input style={inputStyle} value={draft.slump} onChange={e => update('slump', e.target.value)} placeholder="Slump" />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 8 }}>
        <input style={inputStyle} value={draft.requestedBy} onChange={e => update('requestedBy', e.target.value)} placeholder="Requested by" />
        <input style={inputStyle} value={draft.approvedBy} onChange={e => update('approvedBy', e.target.value)} placeholder="Approved by" />
        <select style={inputStyle} value={draft.status} onChange={e => update('status', e.target.value)}>
          {ORDER_CHANGE_STATUSES.map(status => <option key={status}>{status}</option>)}
        </select>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(180px, 1fr) minmax(180px, 1fr) 140px', gap: 8 }}>
        <input style={inputStyle} value={draft.changeReason} onChange={e => update('changeReason', e.target.value)} placeholder="Reason for change" />
        <input style={inputStyle} value={draft.notes} onChange={e => update('notes', e.target.value)} placeholder="Who was told / notes" />
        <button type="submit" disabled={!canAdd} style={{ ...smallButton, borderColor: canAdd ? T.brand : T.border, color: canAdd ? T.brand : T.text4 }}>
          Add Change
        </button>
      </div>
    </form>
  )
}

export function OrderChangesPanel() {
  const [filter, setFilter] = useState('Open')
  const [records, setRecords, resetRecords] = usePersistentList('order_changes', SEED_ORDER_CHANGES)

  const changes = records.filter(oc => {
    if (filter === 'All') return true
    if (filter === 'Open') return isOrderChangeOpen(oc)
    return oc.status === filter
  })

  const open = records.filter(isOrderChangeOpen).length
  const pending = records.filter(oc => oc.status === 'Requested').length

  function updateStatus(id, status) {
    setRecords(current => current.map(oc => oc.id === id ? { ...oc, status } : oc))
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <SectionHeader
        title="Order Changes"
        subtitle="Local written trail for who changed what, when, and who approved it"
        action={<button onClick={resetRecords} style={smallButton}>Reset sample data</button>}
      />

      <OrderChangeForm onAdd={(record) => setRecords(current => [record, ...current])} />

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: 10 }}>
        <StatCard label="Open" value={open} icon="Edit" color={T.blue} />
        <StatCard label="Awaiting Approval" value={pending} icon="Pending" color={pending ? T.amber : T.green} />
        <StatCard label="Total" value={records.length} icon="Log" />
      </div>

      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
        {FILTERS.map(f => <Pill key={f} active={filter === f} onClick={() => setFilter(f)}>{f}</Pill>)}
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {changes.length === 0 && <EmptyState icon="Edit" title="No order changes match this filter" />}
        {changes.map(oc => (
          <div key={oc.id} style={{
            background: T.surface, border: `1px solid ${T.border}`, borderRadius: T.r, padding: '12px 16px',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap', marginBottom: 6 }}>
              <span style={{ fontFamily: T.mono, fontSize: 12, color: T.brand, fontWeight: 700 }}>{oc.orderNumber || '-'}</span>
              <span style={{ fontWeight: 700, fontSize: 13, color: T.text }}>{oc.customerName}</span>
              <span style={{ fontSize: 12, color: T.text3 }}>· {oc.jobName || 'No job name'}</span>
              <select
                value={oc.status}
                onChange={e => updateStatus(oc.id, e.target.value)}
                style={{ ...inputStyle, padding: '3px 7px', fontSize: 11, width: 130 }}
              >
                {ORDER_CHANGE_STATUSES.map(status => <option key={status}>{status}</option>)}
              </select>
              <Badge variant={ORDER_CHANGE_STATUS_VARIANT[oc.status]}>{oc.status}</Badge>
              {isOrderChangeOpen(oc) && (
                <button onClick={() => updateStatus(oc.id, 'Completed')} style={{ ...smallButton, marginLeft: 'auto' }}>Close</button>
              )}
              <span style={{ fontFamily: T.mono, fontSize: 11, color: T.text4 }}>{oc.timestamp}</span>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', gap: 4, marginBottom: 6 }}>
              <Delta label="Time" from={oc.originalTime} to={oc.newTime} />
              <Delta label="Yards" from={oc.originalYards} to={oc.newYards} />
              <div style={{ fontSize: 11, color: T.text3 }}>Mix: {oc.mixDesign || '-'} · Slump {oc.slump || '-'}</div>
            </div>
            <div style={{ fontSize: 12, color: T.text2 }}>Reason: {oc.changeReason}</div>
            <div style={{ fontSize: 11, color: T.text3, marginTop: 4 }}>
              Requested by <b style={{ color: T.text2 }}>{oc.requestedBy || '-'}</b>
              {oc.approvedBy ? <> · Approved by <b style={{ color: T.text2 }}>{oc.approvedBy}</b></> : ' · Not yet approved'}
            </div>
            {oc.notes && <div style={{ fontSize: 11, color: T.text3, marginTop: 4, fontStyle: 'italic' }}>{oc.notes}</div>}
          </div>
        ))}
      </div>

      <div style={{ fontSize: 11, color: T.text4 }}>
        Records are saved locally in this browser only. Keep private customer details out of committed seed data.
      </div>
    </div>
  )
}
