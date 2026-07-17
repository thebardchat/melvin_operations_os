import { T } from '../../../styles/theme.js'
import { Pill } from '../../../components/Pill.jsx'
import { CREW_TABS, CREW_COLORS } from '../../../tenants/srm-north-alabama/drivers.js'

export function CrewTabs({ activeCrew, onSelect }) {
  return (
    <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', padding: '8px 0' }}>
      {CREW_TABS.map(tab => (
        <Pill
          key={tab}
          active={activeCrew === tab}
          color={CREW_COLORS[tab]}
          onClick={() => onSelect(tab)}
        >
          {tab}
        </Pill>
      ))}
    </div>
  )
}
