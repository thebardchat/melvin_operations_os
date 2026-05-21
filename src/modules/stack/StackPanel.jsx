import { useState } from 'react'
import { T } from '../../styles/theme.js'
import { LAYERS, SERVICES, getServicesByLayer } from './ecosystemModel.js'

const STATUS_COLOR = {
  live:    T.green,
  planned: T.amber,
  offline: T.red,
  unknown: T.text4,
}

const STATUS_LABEL = {
  live:    'LIVE',
  planned: 'PLANNED',
  offline: 'OFFLINE',
  unknown: '?',
}

function StatusDot({ status }) {
  const color = STATUS_COLOR[status] || T.text4
  return (
    <span style={{
      display: 'inline-block',
      width: 7, height: 7,
      borderRadius: '50%',
      background: color,
      boxShadow: status === 'live' ? `0 0 5px ${color}88` : 'none',
      flexShrink: 0,
    }} />
  )
}

function TagPill({ label }) {
  return (
    <span style={{
      fontSize: 9, fontFamily: T.mono, color: T.text4,
      background: T.raised, border: `1px solid ${T.border}`,
      padding: '1px 5px', borderRadius: 3, whiteSpace: 'nowrap',
    }}>{label}</span>
  )
}

function ServiceCard({ service, onTest, testResult }) {
  const layerColor = LAYERS.find(l => l.id === service.layer)?.color || T.text3
  const statusColor = STATUS_COLOR[service.status] || T.text4
  const hasUrl = !!service.url
  const testing = testResult === 'testing'

  function handleClick() {
    if (service.url) {
      window.open(service.url, '_blank', 'noopener')
    }
  }

  function handleGhPages(e) {
    e.stopPropagation()
    if (service.ghPages) window.open(service.ghPages, '_blank', 'noopener')
  }

  function handleTest(e) {
    e.stopPropagation()
    if (service.url) onTest(service.id, service.url)
  }

  return (
    <div
      onClick={hasUrl ? handleClick : undefined}
      style={{
        background: T.surface,
        border: `1px solid ${T.border}`,
        borderTop: `2px solid ${service.status === 'live' ? layerColor + '66' : T.border}`,
        borderRadius: T.rSm,
        padding: '10px 12px',
        cursor: hasUrl ? 'pointer' : 'default',
        transition: 'all 0.15s',
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        gap: 5,
        minWidth: 0,
      }}
    >
      {/* Name + status */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
        <StatusDot status={service.status} />
        <span style={{ fontWeight: 700, fontSize: 12, color: T.text, flex: 1, minWidth: 0 }}>
          {service.label}
        </span>
        <span style={{
          fontSize: 8, color: statusColor, fontWeight: 600,
          letterSpacing: '0.5px', flexShrink: 0,
        }}>
          {STATUS_LABEL[service.status]}
        </span>
      </div>

      {/* Description */}
      <div style={{ fontSize: 10, color: T.text3, lineHeight: 1.5 }}>
        {service.description}
      </div>

      {/* Tags */}
      {service.tags?.length > 0 && (
        <div style={{ display: 'flex', gap: 3, flexWrap: 'wrap' }}>
          {service.tags.map(t => <TagPill key={t} label={t} />)}
          {service.buildNode && (
            <TagPill label="BUILD NODE" />
          )}
        </div>
      )}

      {/* URL + actions */}
      {(service.url || service.ghPages) && (
        <div style={{ display: 'flex', gap: 5, marginTop: 2, flexWrap: 'wrap' }}>
          {service.url && (
            <button
              onClick={handleTest}
              style={{
                fontSize: 9, padding: '2px 8px', borderRadius: 4,
                border: `1px solid ${T.border}`,
                background: testResult === 'ok'   ? `${T.green}15` :
                            testResult === 'error' ? `${T.red}15`   : T.raised,
                color:      testResult === 'ok'   ? T.green :
                            testResult === 'error' ? T.red     : T.text3,
                cursor: 'pointer', fontFamily: T.mono,
              }}
            >
              {testing ? '...' : testResult === 'ok' ? '✓ up' : testResult === 'error' ? '✗ down' : 'ping'}
            </button>
          )}
          {service.url && (
            <button
              onClick={handleClick}
              style={{
                fontSize: 9, padding: '2px 8px', borderRadius: 4,
                border: `1px solid ${T.border}`,
                background: T.raised, color: T.brand,
                cursor: 'pointer', fontFamily: T.mono,
              }}
            >
              open ↗
            </button>
          )}
          {service.ghPages && (
            <button
              onClick={handleGhPages}
              style={{
                fontSize: 9, padding: '2px 8px', borderRadius: 4,
                border: `1px solid ${T.border}`,
                background: T.raised, color: T.blue,
                cursor: 'pointer', fontFamily: T.mono,
              }}
            >
              pages ↗
            </button>
          )}
        </div>
      )}
    </div>
  )
}

function LayerSection({ layer, services, testResults, onTest }) {
  return (
    <div style={{ marginBottom: 24 }}>
      {/* Layer header */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10,
      }}>
        <div style={{ width: 3, height: 16, borderRadius: 2, background: layer.color }} />
        <span style={{ fontSize: 10, fontWeight: 700, color: layer.color, letterSpacing: '1.5px' }}>
          {layer.label.toUpperCase()}
        </span>
        <div style={{ flex: 1, height: 1, background: `${layer.color}22` }} />
        <span style={{ fontSize: 9, color: T.text4 }}>{services.length} node{services.length !== 1 ? 's' : ''}</span>
      </div>

      {/* Service cards grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
        gap: 8,
      }}>
        {services.map(s => (
          <ServiceCard
            key={s.id}
            service={s}
            testResult={testResults[s.id]}
            onTest={onTest}
          />
        ))}
      </div>
    </div>
  )
}

function DeploySection() {
  const [copied, setCopied] = useState(null)

  const commands = {
    clone: 'ssh gulfshores@gulfshores',
    setup: 'gh repo clone thebardchat/melvin_operations_os && cd melvin_operations_os && npm install',
    build: 'npm run build',
    deploy: 'npm run deploy',
    local:  'npm run dev -- --host',
  }

  function copy(key, text) {
    navigator.clipboard?.writeText(text).catch(() => {})
    setCopied(key)
    setTimeout(() => setCopied(null), 1500)
  }

  return (
    <div style={{
      background: T.surface, border: `1px solid ${T.border}`, borderRadius: T.rSm,
      padding: 16, marginBottom: 24,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
        <div style={{ width: 3, height: 16, borderRadius: 2, background: '#B794D6' }} />
        <span style={{ fontSize: 10, fontWeight: 700, color: '#B794D6', letterSpacing: '1.5px' }}>
          GULFSHORES DEPLOY
        </span>
        <span style={{
          fontSize: 9, padding: '1px 6px', borderRadius: 3,
          background: `${T.green}15`, color: T.green, border: `1px solid ${T.green}33`,
        }}>Node v24 · npm 11</span>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
        {Object.entries(commands).map(([key, cmd]) => (
          <div key={key} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ fontSize: 9, color: T.text4, minWidth: 50, textAlign: 'right' }}>{key}</span>
            <code style={{
              flex: 1, fontSize: 10, fontFamily: T.mono, color: T.text2,
              background: T.raised, border: `1px solid ${T.border}`,
              padding: '4px 10px', borderRadius: 4,
              overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
            }}>{cmd}</code>
            <button
              onClick={() => copy(key, cmd)}
              style={{
                fontSize: 9, padding: '3px 8px', borderRadius: 4,
                border: `1px solid ${T.border}`,
                background: copied === key ? `${T.green}15` : T.raised,
                color: copied === key ? T.green : T.text3,
                cursor: 'pointer', fontFamily: T.mono, flexShrink: 0,
              }}
            >{copied === key ? '✓' : 'copy'}</button>
          </div>
        ))}
      </div>

      <div style={{ marginTop: 10, fontSize: 10, color: T.text4, lineHeight: 1.7 }}>
        GitHub Pages deploys to{' '}
        <a
          href="https://thebardchat.github.io/melvin_operations_os/"
          target="_blank"
          rel="noopener"
          style={{ color: T.blue, textDecoration: 'none' }}
        >
          thebardchat.github.io/melvin_operations_os
        </a>
        {' '}via <code style={{ fontFamily: T.mono, fontSize: 9 }}>gh-pages</code> branch.
        Run <code style={{ fontFamily: T.mono, fontSize: 9 }}>npm run deploy</code> from gulfshores after any change to main.
      </div>
    </div>
  )
}

export function StackPanel() {
  const [testResults, setTestResults] = useState({})

  async function handleTest(serviceId, url) {
    setTestResults(prev => ({ ...prev, [serviceId]: 'testing' }))
    try {
      const res = await fetch(url, { mode: 'no-cors', signal: AbortSignal.timeout(4000) })
      setTestResults(prev => ({ ...prev, [serviceId]: 'ok' }))
    } catch {
      setTestResults(prev => ({ ...prev, [serviceId]: 'error' }))
    }
  }

  const liveCount  = SERVICES.filter(s => s.status === 'live').length
  const plannedCount = SERVICES.filter(s => s.status === 'planned').length

  return (
    <div>
      {/* Summary bar */}
      <div style={{
        display: 'flex', gap: 16, alignItems: 'center', marginBottom: 20,
        padding: '10px 14px', background: T.surface,
        border: `1px solid ${T.border}`, borderRadius: T.rSm,
        flexWrap: 'wrap',
      }}>
        <span style={{ fontWeight: 700, fontSize: 13, color: T.text }}>Melvin Ecosystem</span>
        <span style={{ fontSize: 10, color: T.text3 }}>end-to-end stack map</span>
        <div style={{ marginLeft: 'auto', display: 'flex', gap: 12, flexWrap: 'wrap' }}>
          <span style={{ fontSize: 10, color: T.green }}>
            <StatusDot status="live" /> {liveCount} live
          </span>
          <span style={{ fontSize: 10, color: T.amber }}>
            <StatusDot status="planned" /> {plannedCount} planned
          </span>
          <span style={{ fontSize: 10, color: T.text4 }}>
            {SERVICES.length} total nodes
          </span>
        </div>
      </div>

      {/* Deploy section */}
      <DeploySection />

      {/* Layer sections */}
      {LAYERS.map(layer => {
        const services = getServicesByLayer(layer.id)
        if (!services.length) return null
        return (
          <LayerSection
            key={layer.id}
            layer={layer}
            services={services}
            testResults={testResults}
            onTest={handleTest}
          />
        )
      })}
    </div>
  )
}
