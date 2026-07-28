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
  SEED_CALLBACKS, isCallbackActive,
  CALLBACK_REASONS, CALLBACK_STATUSES,
  CALLBACK_STATUS_VARIANT,
} from './callbackModel.js'

const FILTERS = ['Active', 'All', 'Completed']

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

function CallbackForm({ onAdd }) {
  const [draft, setDraft] = useState({ dueTime: '', company: '', reason: 'Call customer back', relatedOrderNumber: '', notes: '' })
  const canAdd = draft.company.trim() && draft.dueTime.trim()

  function update(field, value) {
    setDraft(current => ({ ...current, [field]: value }))
  }

  function submit(event) {
    event.preventDefault()
    if (!canAdd) return
    onAdd({
      id: makeId('cb'),
      dueTime: draft.dueTime.trim(),
      customerName: 'Local Contact',
      company: draft.company.trim(),
      phone: 'CUSTOMER_PHONE',
      reason: draft.reason,
      relatedOrderNumber: draft.relatedOrderNumber.trim(),
      status: 'Open',
      notes: draft.notes.trim(),
      completedAt: null,
    })
    setDraft({ dueTime: '', company: '', reason: 'Call customer back', relatedOrderNumber: '', notes: '' })
  }

  return (
    <form onSubmit={submit} style={{ background: T.surface, border: `1px solid ${T.border}`, borderRadius: T.r, padding: 14, display: 'grid', gap: 10 }}>
      <div style={{ display: 'grid', gridTemplateColumns: '0.55fr 1fr 1fr 0.8fr 120px', gap: 8 }}>
        <input style={inputStyle} value={draft.dueTime} onChange={e => update('dueTime', e.target.value)} placeholder="Due" />
        <input style={inputStyle} value={draft.company} onChange={e => update('company', e.target.value)} placeholder="Customer / company" />
        <select style={inputStyle} value={draft.reason} onChange={e => update('reason', e.target.value)}>
          {CALLBACK_REASONS.map(reason => <option key={reason}>{reason}</option>)}
        </select>
        <input style={inputStyle} value={draft.relatedOrderNumber} onChange={e => update('relatedOrderNumber', e.target.value)} placeholder="Order #" />
        <button type="submit" disabled={!canAdd} style={{ ...smallButton, borderColor: canAdd ? T.brand : T.border, color: canAdd ? T.brand : T.text4 }}>
          Add Callback
        </button>
      </div>
      <input style={inputStyle} value={draft.notes} onChange={e => update('notes', e.target.value)} placeholder="What needs to be confirmed?" />
    </form>
  )
}

export function CallbackQueue() {
  const [filter, setFilter] = useState('Active')
  const [records, setRecords, resetRecords] = usePersistentList('callbacks', SEED_CALLBACKS)

  const callbacks = records.filter(cb => {
    if (filter === 'All') return true
    if (filter === 'Active') return isCallbackActive(cb)
    if (filter === 'Completed') return cb.status === 'Completed'
    return true
  }).sort((a, b) => (a.dueTime || '').localeCompare(b.dueTime || ''))

  const overdue = records.filter(cb => cb.status === 'Overdue').length
  const active = records.filter(isCallbackActive).length

  function updateStatus(id, status) {
    setRecords(current => current.map(cb => cb.id === id
      ? { ...cb, status, completedAt: status === 'Completed' ? nowTime() : cb.completedAt }
      : cb))
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <SectionHeader
        title="Callback Queue"
        subtitle="Local follow-ups stay visible until they are completed"
        action={<button onClick={resetRecords} style={smallButton}>Reset sample data</button>}
      />

      <CallbackForm onAdd={(callback) => setRecords(current => [callback, ...current])} />

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: 10 }}>
        <StatCard label="Active" value={active} icon="Return" color={T.blue} />
        <StatCard label="Overdue" value={overdue} icon="Late" color={overdue ? T.red : T.green} />
        <StatCard label="Total" value={records.length} icon="List" />
      </div>

      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
        {FILTERS.map(f => <Pill key={f} active={filter === f} onClick={() => setFilter(f)}>{f}</Pill>)}
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {callbacks.length === 0 && <EmptyState icon="Done" title="Queue is clear" hint="No callbacks match this filter." />}
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
                <select
                  value={cb.status}
                  onChange={e => updateStatus(cb.id, e.target.value)}
                  style={{ ...inputStyle, padding: '3px 7px', fontSize: 11, width: 130 }}
                >
                  {CALLBACK_STATUSES.map(status => <option key={status}>{status}</option>)}
                </select>
                <Badge variant={CALLBACK_STATUS_VARIANT[cb.status]}>{cb.status}</Badge>
                {cb.relatedOrderNumber && <span style={{ fontSize: 11, color: T.text3 }}>· {cb.relatedOrderNumber}</span>}
              </div>
              <div style={{ fontSize: 13, color: T.text2 }}>{cb.reason}</div>
              {cb.notes && <div style={{ fontSize: 11, color: T.text3, marginTop: 2, fontStyle: 'italic' }}>{cb.notes}</div>}
            </div>
            {isCallbackActive(cb) && (
              <button onClick={() => updateStatus(cb.id, 'Completed')} style={smallButton}>Complete</button>
            )}
          </div>
        ))}
      </div>

      <div style={{ fontSize: 11, color: T.text4 }}>
        Records are saved locally in this browser only. Keep private customer details out of committed seed data.
      </div>
    </div>
  )
}
