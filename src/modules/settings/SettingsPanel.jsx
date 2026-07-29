import { useRef, useState } from 'react'
import { T } from '../../styles/theme.js'
import { SectionHeader } from '../../components/SectionHeader.jsx'
import { Badge } from '../../components/Badge.jsx'
import { TENANT } from '../../tenants/srm-north-alabama/index.js'
import { clearAll, exportBackup, importBackup, listKeys } from '../../utils/storage.js'

function Field({ label, value, note }) {
  return (
    <div style={{ padding: '10px 0', borderTop: `1px solid ${T.divider}` }}>
      <div style={{ fontSize: 11, color: T.text3, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{label}</div>
      <div style={{ fontSize: 13, color: T.text2, marginTop: 2 }}>{value}</div>
      {note && <div style={{ fontSize: 11, color: T.text4, marginTop: 2 }}>{note}</div>}
    </div>
  )
}

function ActionButton({ children, onClick, tone = 'neutral' }) {
  const color = tone === 'danger' ? T.red : tone === 'brand' ? T.brand : T.text2
  return (
    <button
      onClick={onClick}
      style={{
        padding: '7px 12px',
        borderRadius: 6,
        border: `1px solid ${tone === 'brand' ? T.brandBd : T.border}`,
        background: tone === 'brand' ? T.brandBg : T.raised,
        color,
        fontSize: 12,
        fontWeight: 700,
        cursor: 'pointer',
      }}
    >
      {children}
    </button>
  )
}

function downloadJson(filename, data) {
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  a.click()
  URL.revokeObjectURL(url)
}

export function SettingsPanel() {
  const inputRef = useRef(null)
  const [notice, setNotice] = useState('')
  const [recordCount, setRecordCount] = useState(() => listKeys().length)

  const handleExport = () => {
    const backup = exportBackup()
    const day = new Date().toISOString().slice(0, 10)
    downloadJson(`melvin-backup-${day}.json`, backup)
    setNotice(`Exported ${backup.keys.length} local record groups.`)
  }

  const handleImportFile = (event) => {
    const file = event.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = () => {
      try {
        const count = importBackup(JSON.parse(String(reader.result)))
        setRecordCount(listKeys().length)
        setNotice(`Imported ${count} local record groups. Reloading view...`)
        window.setTimeout(() => window.location.reload(), 600)
      } catch (error) {
        setNotice(error instanceof Error ? error.message : 'Import failed')
      }
    }
    reader.readAsText(file)
    event.target.value = ''
  }

  const handleClear = () => {
    if (!window.confirm('Clear all Melvin browser-local records on this device? Export first if you need a copy.')) return
    const count = clearAll()
    setRecordCount(0)
    setNotice(`Cleared ${count} local record groups from this device.`)
    window.setTimeout(() => window.location.reload(), 600)
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <SectionHeader title="Settings / Data" subtitle="Tenant config, local backup, and privacy" />

      <div style={{ background: T.surface, border: `1px solid ${T.border}`, borderRadius: T.r, padding: '4px 16px 12px' }}>
        <Field label="Tenant" value={`${TENANT.name} (${TENANT.id})`} note={`Region: ${TENANT.region}`} />
        <Field label="Internal Motto" value={TENANT.motto} />
        <Field label="Storage" value="Browser localStorage (namespaced melvin_os_*)" note="Local-only MVP. Export regularly before clearing browser data." />
        <Field label="Local Record Groups" value={recordCount} note="Stored only on this browser and this device." />
        <Field label="Seed Data" value="Public-safe sample records only" note="No real customer data or phone numbers in this repo." />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 12 }}>
        <div style={{ background: T.surface, border: `1px solid ${T.border}`, borderRadius: T.r, padding: '14px 16px' }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: T.text, marginBottom: 8 }}>Local Backup</div>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            <ActionButton tone="brand" onClick={handleExport}>Export JSON</ActionButton>
            <ActionButton onClick={() => inputRef.current?.click()}>Import JSON</ActionButton>
            <ActionButton tone="danger" onClick={handleClear}>Clear Local</ActionButton>
          </div>
          <input ref={inputRef} type="file" accept="application/json,.json" onChange={handleImportFile} style={{ display: 'none' }} />
          <div style={{ fontSize: 11, color: T.text4, marginTop: 8 }}>
            Exports only Melvin browser records from this device. Keep backup files private.
          </div>
          {notice && <div style={{ fontSize: 11, color: T.brand, marginTop: 8 }}>{notice}</div>}
        </div>

        <div style={{ background: T.surface, border: `1px solid ${T.border}`, borderRadius: T.r, padding: '14px 16px' }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: T.text, marginBottom: 8 }}>Privacy <Badge variant="green">SAFE</Badge></div>
          <div style={{ fontSize: 12, color: T.text2, lineHeight: 1.6 }}>
            This public repo contains placeholder contacts and sample customers only. Real rosters,
            real phone numbers, customer data, and company GPT transcripts stay local, private, or approved.
          </div>
        </div>
      </div>

      <div style={{ background: T.brandBg, border: `1px solid ${T.brandBd}`, borderRadius: T.r, padding: '14px 16px' }}>
        <div style={{ fontSize: 12, fontWeight: 600, color: T.brand, marginBottom: 6 }}>Next: Private Roster & Company GPT Guardrails</div>
        <div style={{ fontSize: 12, color: T.text2, lineHeight: 1.6 }}>
          Real driver names, truck assignments, customer contacts, and company GPT summaries need a private
          local adapter or approved backend. This public repo stays sample-only by default.
        </div>
      </div>
    </div>
  )
}
