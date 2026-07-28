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
  SEED_ISSUES, isIssueOpen, newIssue,
  ISSUE_TYPES, ISSUE_SEVERITIES, ISSUE_STATUSES,
  ISSUE_SEVERITY_VARIANT, ISSUE_STATUS_VARIANT,
} from './issueModel.js'

const FILTERS = ['Open', 'All', 'Resolved']

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

function todayDate() {
  return new Date().toLocaleDateString('en-CA')
}

function IssueForm({ onAdd }) {
  const [draft, setDraft] = useState(() => newIssue({ date: todayDate() }))
  const canAdd = draft.jobName.trim() && draft.description.trim()

  function update(field, value) {
    setDraft(current => ({ ...current, [field]: value }))
  }

  function submit(event) {
    event.preventDefault()
    if (!canAdd) return
    onAdd({
      ...draft,
      id: makeId('iss'),
      date: draft.date || todayDate(),
      customerName: draft.customerName.trim(),
      jobName: draft.jobName.trim(),
      orderNumber: draft.orderNumber.trim(),
      description: draft.description.trim(),
      immediateAction: draft.immediateAction.trim(),
      whoWasNotified: draft.whoWasNotified.trim(),
      followUpDate: draft.followUpDate.trim(),
      resolution: draft.resolution.trim(),
    })
    setDraft(newIssue({ date: todayDate() }))
  }

  return (
    <form onSubmit={submit} style={{ background: T.surface, border: `1px solid ${T.border}`, borderRadius: T.r, padding: 14, display: 'grid', gap: 10 }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: 8 }}>
        <input style={inputStyle} value={draft.date} onChange={e => update('date', e.target.value)} placeholder="Date" />
        <input style={inputStyle} value={draft.customerName} onChange={e => update('customerName', e.target.value)} placeholder="Customer" />
        <input style={inputStyle} value={draft.jobName} onChange={e => update('jobName', e.target.value)} placeholder="Job name" />
        <input style={inputStyle} value={draft.orderNumber} onChange={e => update('orderNumber', e.target.value)} placeholder="Order #" />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: 8 }}>
        <select style={inputStyle} value={draft.issueType} onChange={e => update('issueType', e.target.value)}>
          {ISSUE_TYPES.map(type => <option key={type}>{type}</option>)}
        </select>
        <select style={inputStyle} value={draft.severity} onChange={e => update('severity', e.target.value)}>
          {ISSUE_SEVERITIES.map(severity => <option key={severity}>{severity}</option>)}
        </select>
        <select style={inputStyle} value={draft.status} onChange={e => update('status', e.target.value)}>
          {ISSUE_STATUSES.map(status => <option key={status}>{status}</option>)}
        </select>
        <input style={inputStyle} value={draft.followUpDate} onChange={e => update('followUpDate', e.target.value)} placeholder="Follow-up date" />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(180px, 1fr) minmax(180px, 1fr) 140px', gap: 8 }}>
        <input style={inputStyle} value={draft.description} onChange={e => update('description', e.target.value)} placeholder="What happened?" />
        <input style={inputStyle} value={draft.immediateAction} onChange={e => update('immediateAction', e.target.value)} placeholder="Immediate action" />
        <button type="submit" disabled={!canAdd} style={{ ...smallButton, borderColor: canAdd ? T.brand : T.border, color: canAdd ? T.brand : T.text4 }}>
          Add Issue
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 8 }}>
        <input style={inputStyle} value={draft.whoWasNotified} onChange={e => update('whoWasNotified', e.target.value)} placeholder="Who was notified" />
        <input style={inputStyle} value={draft.resolution} onChange={e => update('resolution', e.target.value)} placeholder="Resolution / closeout" />
      </div>
    </form>
  )
}

export function IssuesPanel() {
  const [filter, setFilter] = useState('Open')
  const [records, setRecords, resetRecords] = usePersistentList('issues', SEED_ISSUES)

  const issues = records.filter(i => {
    if (filter === 'All') return true
    if (filter === 'Open') return isIssueOpen(i)
    if (filter === 'Resolved') return i.status === 'Resolved'
    return true
  })

  const open = records.filter(isIssueOpen).length
  const highSev = records.filter(i => isIssueOpen(i) && (i.severity === 'High' || i.severity === 'Critical')).length

  function updateStatus(id, status) {
    setRecords(current => current.map(issue => issue.id === id
      ? { ...issue, status, followUpNeeded: status === 'Resolved' ? false : issue.followUpNeeded }
      : issue))
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <SectionHeader
        title="Issues / Complaints"
        subtitle="Local issue trail with owner action, notification, and follow-up"
        action={<button onClick={resetRecords} style={smallButton}>Reset sample data</button>}
      />

      <IssueForm onAdd={(issue) => setRecords(current => [issue, ...current])} />

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: 10 }}>
        <StatCard label="Open" value={open} icon="Risk" color={open ? T.red : T.green} />
        <StatCard label="High / Critical" value={highSev} icon="Priority" color={highSev ? T.red : T.green} />
        <StatCard label="Total" value={records.length} icon="Log" />
      </div>

      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
        {FILTERS.map(f => <Pill key={f} active={filter === f} onClick={() => setFilter(f)}>{f}</Pill>)}
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {issues.length === 0 && <EmptyState icon="Done" title="No issues match this filter" hint="A clean board is a good board." />}
        {issues.map(i => (
          <div key={i.id} style={{
            background: T.surface, border: `1px solid ${T.border}`,
            borderLeft: `3px solid ${i.severity === 'Critical' ? T.red : i.severity === 'High' ? T.brand : i.severity === 'Medium' ? T.amber : T.border}`,
            borderRadius: T.r, padding: '12px 16px',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap', marginBottom: 4 }}>
              <span style={{ fontWeight: 700, fontSize: 13, color: T.text }}>{i.issueType}</span>
              <Badge variant={ISSUE_SEVERITY_VARIANT[i.severity]}>{i.severity}</Badge>
              <select
                value={i.status}
                onChange={e => updateStatus(i.id, e.target.value)}
                style={{ ...inputStyle, padding: '3px 7px', fontSize: 11, width: 170 }}
              >
                {ISSUE_STATUSES.map(status => <option key={status}>{status}</option>)}
              </select>
              <Badge variant={ISSUE_STATUS_VARIANT[i.status]}>{i.status}</Badge>
              <span style={{ fontSize: 11, color: T.text3 }}>· {i.jobName} · {i.orderNumber || '-'}</span>
              {isIssueOpen(i) && (
                <button onClick={() => updateStatus(i.id, 'Resolved')} style={{ ...smallButton, marginLeft: 'auto' }}>Resolve</button>
              )}
              <span style={{ fontFamily: T.mono, fontSize: 11, color: T.text4 }}>{i.date}</span>
            </div>
            <div style={{ fontSize: 13, color: T.text2 }}>{i.description}</div>
            {i.immediateAction && <div style={{ fontSize: 11, color: T.text3, marginTop: 4 }}>Action: {i.immediateAction}</div>}
            <div style={{ fontSize: 11, color: T.text3, marginTop: 4 }}>
              Notified: {i.whoWasNotified || '-'}
              {i.followUpNeeded ? <span style={{ color: T.amber }}> · follow-up {i.followUpDate || 'needed'}</span> : ''}
            </div>
            {i.resolution && <div style={{ fontSize: 11, color: T.green, marginTop: 4 }}>{i.resolution}</div>}
          </div>
        ))}
      </div>

      <div style={{ fontSize: 11, color: T.text4 }}>
        Records are saved locally in this browser only. Keep private customer details out of committed seed data.
      </div>
    </div>
  )
}
