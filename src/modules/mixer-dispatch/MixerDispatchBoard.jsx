import { useState } from 'react'
import { T } from '../../styles/theme.js'
import { SectionHeader } from '../../components/SectionHeader.jsx'
import { StatCard } from '../../components/StatCard.jsx'
import { Badge } from '../../components/Badge.jsx'
import { Pill } from '../../components/Pill.jsx'
import { EmptyState } from '../../components/EmptyState.jsx'
import {
  SEED_MIXER_STATUS, isMixerAvailable, isMixerDown, isMixerActive,
  MIXER_STATUS_VARIANT,
} from './mixerStatusModel.js'

const FILTERS = ['All', 'Active', 'Available', 'Down']

export function MixerDispatchBoard() {
  const [filter, setFilter] = useState('All')

  const mixers = SEED_MIXER_STATUS.filter(m => {
    if (filter === 'All') return true
    if (filter === 'Active') return isMixerActive(m)
    if (filter === 'Available') return isMixerAvailable(m)
    if (filter === 'Down') return isMixerDown(m)
    return true
  })

  const available = SEED_MIXER_STATUS.filter(isMixerAvailable).length
  const active = SEED_MIXER_STATUS.filter(isMixerActive).length
  const down = SEED_MIXER_STATUS.filter(isMixerDown).length
  const late = SEED_MIXER_STATUS.filter(m => m.delayReason && !isMixerDown(m)).length

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <SectionHeader title="Mixer Dispatch" subtitle="Live mixer truck status board (sample data)" />

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: 10 }}>
        <StatCard label="Available" value={available} icon="🟢" color={T.green} />
        <StatCard label="Active" value={active} icon="🚚" color={T.blue} />
        <StatCard label="Running Late" value={late} icon="⏰" color={late ? T.amber : T.green} />
        <StatCard label="Down" value={down} icon="🔴" color={down ? T.red : T.text3} />
      </div>

      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
        {FILTERS.map(f => <Pill key={f} active={filter === f} onClick={() => setFilter(f)}>{f}</Pill>)}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 10 }}>
        {mixers.length === 0 && <EmptyState icon="🚚" title="No mixers match this filter" />}
        {mixers.map(m => (
          <div key={m.id} style={{
            background: T.surface, border: `1px solid ${T.border}`,
            borderLeft: `3px solid ${isMixerDown(m) ? T.red : m.delayReason ? T.amber : isMixerAvailable(m) ? T.green : T.blue}`,
            borderRadius: T.r, padding: '12px 14px',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
              <span style={{ fontWeight: 700, fontSize: 14, color: T.text }}>{m.truckNumber}</span>
              <Badge variant={MIXER_STATUS_VARIANT[m.loadStatus]}>{m.loadStatus}</Badge>
              <span style={{ marginLeft: 'auto', fontFamily: T.mono, fontSize: 10, color: T.text4 }}>upd {m.updatedAt}</span>
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
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 6, flexWrap: 'wrap' }}>
              {m.eta && <Badge variant="muted">ETA {m.eta}</Badge>}
              {m.nextOrder && <span style={{ fontSize: 11, color: T.text3 }}>next: {m.nextOrder}</span>}
            </div>
            {m.delayReason && <div style={{ fontSize: 11, color: T.amber, marginTop: 4 }}>⚠ {m.delayReason}</div>}
            {m.notes && <div style={{ fontSize: 11, color: T.text3, marginTop: 4, fontStyle: 'italic' }}>{m.notes}</div>}
          </div>
        ))}
      </div>

      <div style={{ fontSize: 11, color: T.text4 }}>
        MVP: sample records only. Phase 2 adds live status updates + localStorage persistence.
      </div>
    </div>
  )
}
