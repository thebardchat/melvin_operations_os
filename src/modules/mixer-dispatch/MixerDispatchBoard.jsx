import { useState } from 'react'
import { T } from '../../styles/theme.js'
import { SectionHeader } from '../../components/SectionHeader.jsx'
import { StatCard } from '../../components/StatCard.jsx'
import { Badge } from '../../components/Badge.jsx'
import { Pill } from '../../components/Pill.jsx'
import { EmptyState } from '../../components/EmptyState.jsx'
import { usePersistentList } from '../../hooks/usePersistentList.js'
import {
  SEED_MIXER_STATUS, isMixerAvailable, isMixerDown, isMixerActive,
  MIXER_STATUSES, MIXER_STATUS_VARIANT,
} from './mixerStatusModel.js'

const FILTERS = ['All', 'Active', 'Available', 'Down']
const QUICK_STATUSES = ['Available', 'Loading', 'On the way', 'On job', 'Pouring', 'Returning', 'Down', 'Off duty']

function nowTime() {
  return new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
}

function Field({ label, value, onChange, placeholder }) {
  return (
    <label style={{ display: 'flex', flexDirection: 'column', gap: 3, minWidth: 110, flex: 1 }}>
      <span style={{ fontSize: 10, color: T.text4, textTransform: 'uppercase', letterSpacing: '0.04em' }}>{label}</span>
      <input
        value={value || ''}
        placeholder={placeholder}
        onChange={event => onChange(event.target.value)}
        style={{
          width: '100%',
          boxSizing: 'border-box',
          border: `1px solid ${T.border}`,
          borderRadius: 6,
          background: T.raised,
          color: T.text2,
          padding: '6px 8px',
          fontSize: 12,
          outline: 'none',
        }}
      />
    </label>
  )
}

function StatusButton({ status, active, onClick }) {
  const variant = MIXER_STATUS_VARIANT[status]
  const color = variant === 'red' ? T.red : variant === 'green' ? T.green : variant === 'amber' ? T.amber : variant === 'brand' ? T.brand : T.blue
  return (
    <button
      onClick={onClick}
      style={{
        border: `1px solid ${active ? color : T.border}`,
        background: active ? `${color}18` : T.raised,
        color: active ? color : T.text3,
        borderRadius: 6,
        padding: '5px 8px',
        fontSize: 11,
        fontWeight: active ? 700 : 600,
        cursor: 'pointer',
      }}
    >
      {status}
    </button>
  )
}

export function MixerDispatchBoard() {
  const [filter, setFilter] = useState('All')
  const [allMixers, setAllMixers, resetMixers] = usePersistentList('mixer_status', SEED_MIXER_STATUS)

  const updateMixer = (id, patch) => {
    setAllMixers(current => current.map(m => (
      m.id === id ? { ...m, ...patch, updatedAt: nowTime() } : m
    )))
  }

  const mixers = allMixers.filter(m => {
    if (filter === 'All') return true
    if (filter === 'Active') return isMixerActive(m)
    if (filter === 'Available') return isMixerAvailable(m)
    if (filter === 'Down') return isMixerDown(m)
    return true
  })

  const available = allMixers.filter(isMixerAvailable).length
  const active = allMixers.filter(isMixerActive).length
  const down = allMixers.filter(isMixerDown).length
  const late = allMixers.filter(m => m.delayReason && !isMixerDown(m)).length

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <SectionHeader
        title="Mixer Dispatch"
        subtitle="Local mixer truck status board (sample data)"
        action={<button onClick={resetMixers} style={{ border: `1px solid ${T.border}`, background: T.raised, color: T.text3, borderRadius: 6, padding: '6px 10px', fontSize: 11, fontWeight: 700, cursor: 'pointer' }}>Reset sample board</button>}
      />

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: 10 }}>
        <StatCard label="Available" value={available} icon="OK" color={T.green} />
        <StatCard label="Active" value={active} icon="Run" color={T.blue} />
        <StatCard label="Running Late" value={late} icon="Late" color={late ? T.amber : T.green} />
        <StatCard label="Down" value={down} icon="Down" color={down ? T.red : T.text3} />
      </div>

      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
        {FILTERS.map(f => <Pill key={f} active={filter === f} onClick={() => setFilter(f)}>{f}</Pill>)}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 10 }}>
        {mixers.length === 0 && <EmptyState icon="Mixer" title="No mixers match this filter" />}
        {mixers.map(m => (
          <div key={m.id} style={{
            background: T.surface, border: `1px solid ${T.border}`,
            borderLeft: `3px solid ${isMixerDown(m) ? T.red : m.delayReason ? T.amber : isMixerAvailable(m) ? T.green : T.blue}`,
            borderRadius: T.r, padding: '12px 14px',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
              <span style={{ fontWeight: 700, fontSize: 14, color: T.text }}>{m.truckNumber}</span>
              <Badge variant={MIXER_STATUS_VARIANT[m.loadStatus]}>{m.loadStatus}</Badge>
              <span style={{ marginLeft: 'auto', fontFamily: T.mono, fontSize: 10, color: T.text4 }}>upd {m.updatedAt || '-'}</span>
            </div>

            <div style={{ fontSize: 12, color: T.text2 }}>{m.driverName} · {m.plant}</div>
            {(m.currentOrder || m.jobAddress) && (
              <div style={{ fontSize: 11, color: T.text3, marginTop: 4 }}>
                {m.currentOrder ? `Order ${m.currentOrder}` : 'No active order'}
                {m.jobAddress ? ` · ${m.jobAddress}` : ''}
              </div>
            )}
            {(m.yards || m.mixDesign) && (
              <div style={{ fontSize: 11, color: T.text3, marginTop: 2 }}>
                {m.yards ? `${m.yards} yd` : ''}{m.mixDesign ? ` · ${m.mixDesign}` : ''}{m.slump ? ` · slump ${m.slump}` : ''}{m.ticketNumber ? ` · ${m.ticketNumber}` : ''}
              </div>
            )}

            <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap', marginTop: 10 }}>
              {QUICK_STATUSES.map(status => (
                <StatusButton
                  key={status}
                  status={status}
                  active={m.loadStatus === status}
                  onClick={() => updateMixer(m.id, {
                    loadStatus: status,
                    delayReason: status === 'Down' ? (m.delayReason || 'Needs dispatcher note') : m.delayReason,
                    eta: status === 'Available' || status === 'Off duty' ? '' : m.eta,
                  })}
                />
              ))}
            </div>

            <div style={{ display: 'flex', gap: 8, marginTop: 10, flexWrap: 'wrap' }}>
              <Field label="ETA" value={m.eta} placeholder="08:15" onChange={value => updateMixer(m.id, { eta: value })} />
              <Field label="Delay" value={m.delayReason} placeholder="Reason, if any" onChange={value => updateMixer(m.id, { delayReason: value })} />
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 8, flexWrap: 'wrap' }}>
              {m.eta && <Badge variant="muted">ETA {m.eta}</Badge>}
              {m.nextOrder && <span style={{ fontSize: 11, color: T.text3 }}>next: {m.nextOrder}</span>}
              <select
                value={m.loadStatus}
                onChange={event => updateMixer(m.id, { loadStatus: event.target.value })}
                style={{ marginLeft: 'auto', border: `1px solid ${T.border}`, background: T.raised, color: T.text2, borderRadius: 6, padding: '5px 8px', fontSize: 11 }}
              >
                {MIXER_STATUSES.map(status => <option key={status} value={status}>{status}</option>)}
              </select>
            </div>
            {m.delayReason && <div style={{ fontSize: 11, color: T.amber, marginTop: 4 }}>Alert: {m.delayReason}</div>}
            {m.notes && <div style={{ fontSize: 11, color: T.text3, marginTop: 4, fontStyle: 'italic' }}>{m.notes}</div>}
          </div>
        ))}
      </div>

      <div style={{ fontSize: 11, color: T.text4 }}>
        Mixer status changes save to this browser only. Use Settings / Data to export a private JSON backup.
      </div>
    </div>
  )
}
