import { T } from '../../styles/theme.js'
import { SectionHeader } from '../../components/SectionHeader.jsx'
import { StatCard } from '../../components/StatCard.jsx'
import { Badge } from '../../components/Badge.jsx'
import { useOnlineStatus } from '../dispatch/hooks/useOnlineStatus.js'

const APP_VERSION = '0.1.0'

export function HealthPanel() {
  const online = useOnlineStatus()

  const checks = [
    { name: 'App Version', status: 'ok', value: `v${APP_VERSION}` },
    { name: 'Network', status: online ? 'ok' : 'warn', value: online ? 'Online' : 'Offline' },
    { name: 'Storage Mode', status: 'ok', value: 'localStorage (local-first)' },
    { name: 'MCP API', status: 'pending', value: 'Not configured — see .env.example' },
    { name: 'Weather API', status: 'pending', value: 'Not configured — seed data active' },
    { name: 'Weaviate Memory', status: 'pending', value: 'Phase 3 — not yet connected' },
    { name: 'Backup Sync', status: 'pending', value: 'Phase 2 — not yet configured' },
  ]

  const statusConfig = {
    ok: { variant: 'green', label: 'OK' },
    warn: { variant: 'amber', label: 'WARN' },
    error: { variant: 'red', label: 'ERROR' },
    pending: { variant: 'muted', label: 'PENDING' },
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <SectionHeader
        title="System Health"
        subtitle="App status, storage mode, and service connectivity"
      />

      {/* Quick stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: 10 }}>
        <StatCard label="App Version" value={`v${APP_VERSION}`} icon="🔧" />
        <StatCard
          label="Network"
          value={online ? 'Online' : 'Offline'}
          color={online ? T.green : T.red}
          icon={online ? '🟢' : '🔴'}
        />
        <StatCard label="Storage" value="Local" icon="💾" />
        <StatCard label="Mode" value="MVP" icon="🏗" />
      </div>

      {/* Health checks */}
      <div style={{
        background: T.surface,
        border: `1px solid ${T.border}`,
        borderRadius: T.r,
        overflow: 'hidden',
      }}>
        <div style={{ padding: '12px 16px', borderBottom: `1px solid ${T.divider}` }}>
          <div style={{ fontSize: 12, fontWeight: 600, color: T.text2 }}>Service Checks</div>
        </div>
        {checks.map((check, i) => {
          const cfg = statusConfig[check.status] || statusConfig.pending
          return (
            <div
              key={check.name}
              style={{
                display: 'flex', alignItems: 'center', gap: 12,
                padding: '10px 16px',
                borderBottom: i < checks.length - 1 ? `1px solid ${T.divider}` : 'none',
              }}
            >
              <Badge variant={cfg.variant}>{cfg.label}</Badge>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 12, color: T.text, fontWeight: 500 }}>{check.name}</div>
                <div style={{ fontSize: 11, color: T.text3 }}>{check.value}</div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Local-first note */}
      <div style={{
        background: T.brandBg,
        border: `1px solid ${T.brandBd}`,
        borderRadius: T.r,
        padding: '14px 16px',
      }}>
        <div style={{ fontSize: 12, fontWeight: 600, color: T.brand, marginBottom: 6 }}>
          Local-First Architecture
        </div>
        <div style={{ fontSize: 12, color: T.text2, lineHeight: 1.6 }}>
          Melvin MVP runs entirely in the browser with no backend required.
          All state is stored in browser localStorage.
          Phase 2 will add a FastAPI backend (melvin-api) for persistent storage and sync.
          Phase 3 will connect to ShaneBrain MCP server and Weaviate memory.
        </div>
        <div style={{ marginTop: 10, fontSize: 11, color: T.text3 }}>
          See <code style={{ fontFamily: T.mono, color: T.brand }}>docs/local-first-roadmap.md</code> for the full plan.
        </div>
      </div>
    </div>
  )
}
