import { T } from '../../styles/theme.js'
import { SectionHeader } from '../../components/SectionHeader.jsx'
import { Badge } from '../../components/Badge.jsx'
import { TENANT } from '../../tenants/srm-north-alabama/index.js'

function Field({ label, value, note }) {
  return (
    <div style={{ padding: '10px 0', borderTop: `1px solid ${T.divider}` }}>
      <div style={{ fontSize: 11, color: T.text3, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{label}</div>
      <div style={{ fontSize: 13, color: T.text2, marginTop: 2 }}>{value}</div>
      {note && <div style={{ fontSize: 11, color: T.text4, marginTop: 2 }}>{note}</div>}
    </div>
  )
}

export function SettingsPanel() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <SectionHeader title="Settings / Data" subtitle="Tenant config, storage, and privacy" />

      <div style={{ background: T.surface, border: `1px solid ${T.border}`, borderRadius: T.r, padding: '4px 16px 12px' }}>
        <Field label="Tenant" value={`${TENANT.name} (${TENANT.id})`} note={`Region: ${TENANT.region}`} />
        <Field label="Internal Motto" value={TENANT.motto} />
        <Field label="Storage" value="Browser localStorage (namespaced melvin_os_*)" note="Local-only MVP — no backend, no cloud." />
        <Field label="Seed Data" value="Public-safe sample records only" note="No real customer data or phone numbers in this repo." />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 12 }}>
        <div style={{ background: T.surface, border: `1px solid ${T.border}`, borderRadius: T.r, padding: '14px 16px' }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: T.text, marginBottom: 8 }}>Export / Import</div>
          <div style={{ display: 'flex', gap: 8 }}>
            <button disabled style={{ padding: '6px 12px', borderRadius: 6, border: `1px solid ${T.border}`, background: T.raised, color: T.text3 }}>Export JSON</button>
            <button disabled style={{ padding: '6px 12px', borderRadius: 6, border: `1px solid ${T.border}`, background: T.raised, color: T.text3 }}>Import JSON</button>
          </div>
          <div style={{ fontSize: 11, color: T.text4, marginTop: 8 }}>Placeholder — Phase 2 will export/import all local records.</div>
        </div>

        <div style={{ background: T.surface, border: `1px solid ${T.border}`, borderRadius: T.r, padding: '14px 16px' }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: T.text, marginBottom: 8 }}>Privacy <Badge variant="green">SAFE</Badge></div>
          <div style={{ fontSize: 12, color: T.text2, lineHeight: 1.6 }}>
            This public repo contains placeholder contacts and sample customers only. Real rosters,
            real phone numbers, and private customer data must live in a local, untracked config —
            never committed here.
          </div>
        </div>
      </div>

      <div style={{ background: T.brandBg, border: `1px solid ${T.brandBd}`, borderRadius: T.r, padding: '14px 16px' }}>
        <div style={{ fontSize: 12, fontWeight: 600, color: T.brand, marginBottom: 6 }}>Future: Real Roster & Private Config</div>
        <div style={{ fontSize: 12, color: T.text2, lineHeight: 1.6 }}>
          Phase 2+ adds a private, untracked tenant overlay for real driver names, customer contacts,
          and phone numbers — loaded from local config or the melvin-api backend. See
          <code style={{ fontFamily: T.mono, color: T.brand }}> docs/local-first-roadmap.md</code>.
        </div>
      </div>
    </div>
  )
}
