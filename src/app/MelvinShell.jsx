import { useState } from 'react'
import { T } from '../styles/theme.js'
import { NAV_ITEMS, DEFAULT_MODULE } from './navigation.js'
import { DispatchBoard } from '../modules/dispatch/components/DispatchBoard.jsx'
import { BriefingPanel } from '../modules/briefing/BriefingPanel.jsx'
import { RepairsPanel } from '../modules/repairs/RepairsPanel.jsx'
import { WeatherPanel } from '../modules/weather/WeatherPanel.jsx'
import { ManagementPanel } from '../modules/management/ManagementPanel.jsx'
import { HealthPanel } from '../modules/health/HealthPanel.jsx'
import { useOnlineStatus } from '../modules/dispatch/hooks/useOnlineStatus.js'

function NavItem({ item, active, onClick }) {
  return (
    <button
      onClick={() => onClick(item.id)}
      title={item.label}
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 3,
        padding: '10px 0',
        width: '100%',
        border: 'none',
        background: active ? T.raised : 'transparent',
        borderLeft: active ? `3px solid ${T.brand}` : '3px solid transparent',
        color: active ? T.brand : T.text3,
        cursor: 'pointer',
        transition: 'all 0.15s',
        fontSize: 18,
      }}
    >
      <span>{item.icon}</span>
      <span style={{ fontSize: 9, letterSpacing: '0.04em', fontWeight: active ? 600 : 400 }}>
        {item.label.toUpperCase()}
      </span>
    </button>
  )
}

function renderModule(id) {
  switch (id) {
    case 'dispatch':   return <DispatchBoard />
    case 'briefing':   return <BriefingPanel />
    case 'repairs':    return <RepairsPanel />
    case 'weather':    return <WeatherPanel />
    case 'management': return <ManagementPanel />
    case 'health':     return <HealthPanel />
    default:           return <div style={{ color: T.text3, padding: 40 }}>Module not found</div>
  }
}

export function MelvinShell() {
  const [activeModule, setActiveModule] = useState(DEFAULT_MODULE)
  const online = useOnlineStatus()
  const activeItem = NAV_ITEMS.find(n => n.id === activeModule)

  return (
    <div style={{
      display: 'flex',
      height: '100vh',
      width: '100vw',
      overflow: 'hidden',
      background: T.bg,
      fontFamily: T.font,
    }}>
      {/* Sidebar nav */}
      <div style={{
        width: 64,
        flexShrink: 0,
        background: T.surface,
        borderRight: `1px solid ${T.border}`,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'stretch',
      }}>
        {/* Logo */}
        <div style={{
          height: 56,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          borderBottom: `1px solid ${T.border}`,
          fontSize: 22,
        }}>
          M
        </div>

        {/* Nav items */}
        <div style={{ flex: 1, paddingTop: 8 }}>
          {NAV_ITEMS.map(item => (
            <NavItem
              key={item.id}
              item={item}
              active={activeModule === item.id}
              onClick={setActiveModule}
            />
          ))}
        </div>

        {/* Online indicator */}
        <div style={{
          padding: '10px 0',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          borderTop: `1px solid ${T.border}`,
        }}>
          <div style={{
            width: 8, height: 8, borderRadius: '50%',
            background: online ? T.green : T.red,
            title: online ? 'Online' : 'Offline',
          }} />
        </div>
      </div>

      {/* Main content */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        {/* Top bar */}
        <div style={{
          height: 56,
          borderBottom: `1px solid ${T.border}`,
          display: 'flex',
          alignItems: 'center',
          padding: '0 24px',
          gap: 10,
          flexShrink: 0,
          background: T.surface,
        }}>
          <span style={{ fontSize: 16 }}>{activeItem?.icon}</span>
          <span style={{ fontWeight: 700, fontSize: 15, color: T.text }}>{activeItem?.label}</span>
          <span style={{ fontSize: 12, color: T.text4, marginLeft: 8 }}>SRM North Alabama</span>
          <div style={{ marginLeft: 'auto', display: 'flex', gap: 8, alignItems: 'center' }}>
            <span style={{ fontSize: 10, color: T.text4 }}>
              MELVIN OS v0.1.0
            </span>
          </div>
        </div>

        {/* Module content */}
        <div style={{
          flex: 1,
          overflow: 'auto',
          padding: '20px 24px',
        }}>
          {renderModule(activeModule)}
        </div>
      </div>
    </div>
  )
}
