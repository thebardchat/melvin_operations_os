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
  SEED_CALLS, isCallOpen, newCustomerCall,
  REQUEST_TYPES, CALL_STATUSES, URGENCIES,
  URGENCY_VARIANT, CALL_STATUS_VARIANT,
} from './customerCallModel.js'

const FILTERS = ['All', 'Open', 'Resolved']

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

function CallForm({ onAdd }) {
  const [draft, setDraft] = useState(() => newCustomerCall({ time: nowTime() }))
  const canAdd = draft.company.trim() && draft.topic.trim()

  function update(field, value) {
    setDraft(current => ({ ...current, [field]: value }))
  }

  function submit(event) {
    event.preventDefault()
    if (!canAdd) return
    onAdd({
      ...draft,
      id: makeId('call'),
      company: draft.company.trim(),
      topic: draft.topic.trim(),
      orderNumber: draft.orderNumber.trim(),
      jobName: draft.jobName.trim(),
      notes: draft.notes.trim(),
      time: draft.time || nowTime(),
    })
    setDraft(newCustomerCall({ time: nowTime() }))
  }

  return (
    <form onSubmit={submit} style={{ background: T.surface, border: `1px solid ${T.border}`, borderRadius: T.r, padding: 14, display: 'grid', gap: 10 }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1.1fr 0.8fr 0.8fr 0.7fr', gap: 8 }}>
        <input style={inputStyle} value={draft.company} onChange={e => update('company', e.target.value)} placeholder="Customer / company" />
        <input style={inputStyle} value={draft.orderNumber} onChange={e => update('orderNumber', e.target.value)} placeholder="Order #" />
        <input style={inputStyle} value={draft.followUpTime} onChange={e => update('followUpTime', e.target.value)} placeholder="Follow-up time" />
        <input style={inputStyle} value={draft.time} onChange={e => update('time', e.target.value)} placeholder="Call time" />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 0.8fr 0.8fr', gap: 8 }}>
        <input style={inputStyle} value={draft.topic} onChange={e => update('topic', e.target.value)} placeholder="What do they need?" />
        <select style={inputStyle} value={draft.requestType} onChange={e => update('requestType', e.target.value)}>
          {REQUEST_TYPES.map(type => <option key={type}>{type}</option>)}
        </select>
        <select style={inputStyle} value={draft.urgency} onChange={e => update('urgency', e.target.value)}>
          {URGENCIES.map(urgency => <option key={urgency}>{urgency}</option>)}
        </select>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 120px', gap: 8 }}>
        <input style={inputStyle} value={draft.jobName} onChange={e => update('jobName', e.target.value)} placeholder="Job name" />
        <input style={inputStyle} value={draft.notes} onChange={e => update('notes', e.target.value)} placeholder="Notes / promise made" />
        <button type="submit" disabled={!canAdd} style={{ ...smallButton, borderColor: canAdd ? T.brand : T.border, color: canAdd ? T.brand : T.text4 }}>
          Add Call
        </button>
      </div>
    </form>
  )
}

export function CustomerCallsPanel() {
  const [filter, setFilter] = useState('Open')
  const [records, setRecords, resetRecords] = usePersistentList('customer_calls', SEED_CALLS)

  const calls = records.filter(c => {
    if (filter === 'All') return true
    if (filter === 'Open') return isCallOpen(c)
    if (filter === 'Resolved') return c.status === 'Resolved'
    return true
  })

  const openCount = records.filter(isCallOpen).length
  const highCount = records.filter(c => isCallOpen(c) && (c.urgency === 'High' || c.urgency === 'Critical')).length

  function updateStatus(id, status) {
    setRecords(current => current.map(call => call.id === id
      ? { ...call, status, resolvedAt: status === 'Resolved' ? nowTime() : call.resolvedAt }
      : call))
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <SectionHeader
        title="Customer Calls"
        subtitle="Local call log saved in this browser"
        action={<button onClick={resetRecords} style={smallButton}>Reset sample data</button>}
      />

      <CallForm onAdd={(call) => setRecords(current => [call, ...current])} />

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: 10 }}>
        <StatCard label="Open" value={openCount} icon="Call" color={T.amber} />
        <StatCard label="High / Critical" value={highCount} icon="Alert" color={highCount ? T.red : T.green} />
        <StatCard label="Logged Today" value={records.length} icon="Log" />
      </div>

      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
        {FILTERS.map(f => <Pill key={f} active={filter === f} onClick={() => setFilter(f)}>{f}</Pill>)}
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {calls.length === 0 && <EmptyState icon="Call" title="No calls match this filter" />}
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
              <select
                value={c.status}
                onChange={e => updateStatus(c.id, e.target.value)}
                style={{ ...inputStyle, padding: '3px 7px', fontSize: 11, width: 170 }}
              >
                {CALL_STATUSES.map(status => <option key={status}>{status}</option>)}
              </select>
              <Badge variant={CALL_STATUS_VARIANT[c.status]}>{c.status}</Badge>
              {isCallOpen(c) && (
                <button onClick={() => updateStatus(c.id, 'Resolved')} style={{ ...smallButton, marginLeft: 'auto' }}>Resolve</button>
              )}
            </div>
            <div style={{ fontSize: 13, color: T.text2 }}>{c.topic}</div>
            <div style={{ fontSize: 11, color: T.text3, marginTop: 4 }}>
              {c.jobName || 'No job name'} · Order {c.orderNumber || '-'}{c.followUpTime ? ` · follow-up ${c.followUpTime}` : ''}
            </div>
            {c.notes && <div style={{ fontSize: 11, color: T.text3, marginTop: 4, fontStyle: 'italic' }}>{c.notes}</div>}
          </div>
        ))}
      </div>

      <div style={{ fontSize: 11, color: T.text4 }}>
        Records are saved locally in this browser only. Do not enter private phone numbers or sensitive customer data in the public repo seed files.
      </div>
    </div>
  )
}
