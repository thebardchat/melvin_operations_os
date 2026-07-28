import { useMemo } from 'react'
import { T } from '../../styles/theme.js'
import { SectionHeader } from '../../components/SectionHeader.jsx'
import { StatCard } from '../../components/StatCard.jsx'
import { Badge } from '../../components/Badge.jsx'
import { EmptyState } from '../../components/EmptyState.jsx'
import { formatDate, todayStr } from '../../utils/date.js'
import { usePersistentList } from '../../hooks/usePersistentList.js'
import { SEED_CALLS } from '../customer-service/customerCallModel.js'
import { SEED_CALLBACKS } from '../customer-service/callbackModel.js'
import { SEED_ORDER_CHANGES } from '../orders/orderChangeModel.js'
import { SEED_ISSUES } from '../issues/issueModel.js'
import { buildTodaySnapshot, buildTopPriorities } from './todayModel.js'
import { RISK_SEVERITY_VARIANT } from './riskFlags.js'

function Card({ title, count, accent, children }) {
  return (
    <div style={{ background: T.surface, border: `1px solid ${T.border}`, borderRadius: T.r, padding: '14px 16px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
        <span style={{ fontSize: 12, fontWeight: 700, color: T.text, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{title}</span>
        {count !== undefined && (
          <span style={{ fontSize: 11, color: accent || T.text3, fontWeight: 700 }}>{count}</span>
        )}
      </div>
      {children}
    </div>
  )
}

function Row({ left, right, sub }) {
  return (
    <div style={{ padding: '7px 0', borderTop: `1px solid ${T.divider}` }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
        <span style={{ fontSize: 12.5, color: T.text2 }}>{left}</span>
        {right}
      </div>
      {sub && <div style={{ fontSize: 11, color: T.text3, marginTop: 2 }}>{sub}</div>}
    </div>
  )
}

export function TodayBoard() {
  const [calls] = usePersistentList('customer_calls', SEED_CALLS)
  const [callbacks] = usePersistentList('callbacks', SEED_CALLBACKS)
  const [orderChanges] = usePersistentList('order_changes', SEED_ORDER_CHANGES)
  const [issues] = usePersistentList('issues', SEED_ISSUES)
  const snap = useMemo(() => buildTodaySnapshot({ calls, callbacks, orderChanges, issues }), [calls, callbacks, orderChanges, issues])
  const priorities = useMemo(() => buildTopPriorities(snap), [snap])
  const today = todayStr()
  const weatherVariant = { low: 'green', medium: 'amber', high: 'red' }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <SectionHeader
        title="Today Board"
        subtitle={`${formatDate(today)} · SRM North Alabama · local records included`}
        action={
          <Badge variant={weatherVariant[snap.weather.dispatchRisk]}>
            WEATHER: {String(snap.weather.dispatchRisk).toUpperCase()} RISK
          </Badge>
        }
      />

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: 10 }}>
        <StatCard label="Open Calls" value={snap.stats.openCalls} icon="Calls" color={T.amber} />
        <StatCard label="Callbacks Due" value={snap.stats.callbacksDue} icon="Due" color={snap.stats.callbacksOverdue ? T.red : T.blue} />
        <StatCard label="Overdue" value={snap.stats.callbacksOverdue} icon="Late" color={snap.stats.callbacksOverdue ? T.red : T.text3} />
        <StatCard label="Order Changes" value={snap.stats.openOrderChanges} icon="Edit" color={T.blue} />
        <StatCard label="Open Issues" value={snap.stats.openIssues} icon="Risk" color={snap.stats.openIssues ? T.red : T.green} />
        <StatCard label="Mixers Avail." value={snap.stats.mixersAvailable} icon="Avail" color={T.green} />
        <StatCard label="Mixers Down" value={snap.stats.mixersDown} icon="Down" color={snap.stats.mixersDown ? T.red : T.text3} />
        <StatCard label="At-Risk Pours" value={snap.stats.atRiskPours} icon="Pours" color={snap.stats.atRiskPours ? T.amber : T.green} />
      </div>

      <Card title="Risk Flags" count={snap.riskFlags.length}>
        {snap.riskFlags.length === 0 ? (
          <div style={{ fontSize: 12, color: T.text3 }}>No active risk flags. Stay sharp.</div>
        ) : (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
            {snap.riskFlags.map((f, i) => (
              <Badge key={i} variant={RISK_SEVERITY_VARIANT[f.severity]}>{f.label}</Badge>
            ))}
          </div>
        )}
      </Card>

      <Card title="Top Priorities" count={priorities.length}>
        {priorities.length === 0 ? (
          <EmptyState icon="Done" title="All clear" hint="No high-priority items right now." />
        ) : (
          priorities.map((p, i) => (
            <Row
              key={i}
              left={p.text}
              right={<Badge variant={p.priority === 'high' ? 'red' : 'amber'}>{p.priority}</Badge>}
            />
          ))
        )}
      </Card>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 12 }}>
        <Card title="Who Called" count={snap.openCalls.length} accent={T.amber}>
          {snap.openCalls.length === 0
            ? <div style={{ fontSize: 12, color: T.text3 }}>No open calls.</div>
            : snap.openCalls.map(c => (
                <Row key={c.id}
                  left={`${c.time} · ${c.company}`}
                  right={<Badge variant="blue">{c.requestType}</Badge>}
                  sub={c.topic} />
              ))}
        </Card>

        <Card title="Callbacks Due" count={snap.activeCallbacks.length} accent={snap.overdueCallbacks.length ? T.red : T.blue}>
          {snap.activeCallbacks.length === 0
            ? <div style={{ fontSize: 12, color: T.text3 }}>Queue is clear.</div>
            : snap.activeCallbacks.map(cb => (
                <Row key={cb.id}
                  left={`${cb.dueTime} · ${cb.company}`}
                  right={<Badge variant={cb.status === 'Overdue' ? 'red' : cb.status === 'Due soon' ? 'amber' : 'blue'}>{cb.status}</Badge>}
                  sub={cb.reason} />
              ))}
        </Card>

        <Card title="Orders Changed" count={snap.openOrderChanges.length} accent={T.blue}>
          {snap.openOrderChanges.length === 0
            ? <div style={{ fontSize: 12, color: T.text3 }}>No open order changes.</div>
            : snap.openOrderChanges.map(oc => (
                <Row key={oc.id}
                  left={`${oc.orderNumber} · ${oc.customerName}`}
                  right={<Badge variant="amber">{oc.status}</Badge>}
                  sub={oc.changeReason} />
              ))}
        </Card>

        <Card title="Open Complaints / Issues" count={snap.openIssues.length} accent={T.red}>
          {snap.openIssues.length === 0
            ? <div style={{ fontSize: 12, color: T.text3 }}>No open issues.</div>
            : snap.openIssues.map(i => (
                <Row key={i.id}
                  left={`${i.issueType} · ${i.jobName}`}
                  right={<Badge variant={i.severity === 'Critical' ? 'red' : i.severity === 'High' ? 'brand' : 'amber'}>{i.severity}</Badge>}
                  sub={i.description} />
              ))}
        </Card>

        <Card title="At-Risk Pours" count={snap.atRiskPours.length} accent={T.amber}>
          {snap.atRiskPours.length === 0
            ? <div style={{ fontSize: 12, color: T.text3 }}>No pours flagged at risk.</div>
            : snap.atRiskPours.map((p, i) => (
                <Row key={i} left={`${p.orderNumber || '-'} · ${p.job}`} sub={p.why} />
              ))}
        </Card>

        <Card title="Plant / Truck Issues" count={snap.plantIssues.length} accent={T.red}>
          {snap.plantIssues.length === 0
            ? <div style={{ fontSize: 12, color: T.text3 }}>No plant or truck issues.</div>
            : snap.plantIssues.map((p, i) => <Row key={i} left={p} />)}
        </Card>

        <Card title="Carried to Tomorrow" count={snap.carried.length} accent={T.text3}>
          {snap.carried.map((c, i) => <Row key={i} left={c} />)}
        </Card>

        <Card title="Quick Notes">
          {snap.quickNotes.map((n, i) => <Row key={i} left={n} />)}
        </Card>
      </div>
    </div>
  )
}
