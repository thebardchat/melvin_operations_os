import { T } from '../../styles/theme.js'
import { SectionHeader } from '../../components/SectionHeader.jsx'
import { Badge } from '../../components/Badge.jsx'
import { WEATHER_SEED, RISK_COLORS } from './weatherModel.js'

const riskVariant = { low: 'green', medium: 'amber', high: 'red' }

const CONDITION_ICON = {
  'Partly Cloudy': '⛅',
  'Scattered Showers': '🌦',
  'Thunderstorms': '⛈',
  'Mostly Clear': '🌤',
  'Sunny': '☀',
}

export function WeatherPanel() {
  const today = WEATHER_SEED[0]
  const rest = WEATHER_SEED.slice(1)

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <SectionHeader
        title="Weather"
        subtitle="Hazel Green, AL — Dispatch risk forecast (seed data)"
      />

      {/* Today hero */}
      <div style={{
        background: T.surface,
        border: `1px solid ${T.border}`,
        borderRadius: T.r,
        padding: '20px 24px',
        display: 'flex', alignItems: 'center', gap: 20, flexWrap: 'wrap',
      }}>
        <div style={{ fontSize: 56 }}>{CONDITION_ICON[today.condition] || '🌡'}</div>
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
            <span style={{ fontSize: 22, fontWeight: 700, color: T.text }}>Today</span>
            <Badge variant={riskVariant[today.dispatchRisk]}>
              {today.dispatchRisk.toUpperCase()} DISPATCH RISK
            </Badge>
          </div>
          <div style={{ fontSize: 36, fontWeight: 700, color: T.text, lineHeight: 1 }}>
            {today.high}°F <span style={{ fontSize: 18, color: T.text3 }}>/ {today.low}°F</span>
          </div>
          <div style={{ fontSize: 14, color: T.text2, marginTop: 4 }}>{today.condition}</div>
          <div style={{ fontSize: 12, color: T.text3, marginTop: 4 }}>
            Precip: {today.precip}% · Wind: {today.windMph} mph · Humidity: {today.humidity}%
          </div>
        </div>
        <div style={{
          background: today.dispatchRisk === 'low' ? 'rgba(91,166,110,0.10)'
            : today.dispatchRisk === 'medium' ? 'rgba(212,160,60,0.10)'
            : 'rgba(212,85,85,0.10)',
          border: `1px solid ${RISK_COLORS[today.dispatchRisk]}44`,
          borderRadius: T.rSm,
          padding: '10px 14px',
          maxWidth: 280,
        }}>
          <div style={{ fontSize: 11, color: T.text3, marginBottom: 4 }}>Dispatch Note</div>
          <div style={{ fontSize: 12, color: T.text2 }}>{today.riskReason}</div>
        </div>
      </div>

      {/* Forecast cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: 10 }}>
        {rest.map(day => (
          <div key={day.date} style={{
            background: T.surface,
            border: `1px solid ${T.border}`,
            borderRadius: T.r,
            padding: '12px 14px',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
              <span style={{ fontSize: 12, fontWeight: 600, color: T.text2 }}>{day.label}</span>
              <span style={{ fontSize: 20 }}>{CONDITION_ICON[day.condition] || '🌡'}</span>
            </div>
            <div style={{ fontSize: 18, fontWeight: 700, color: T.text }}>
              {day.high}° <span style={{ fontSize: 12, color: T.text3 }}>/ {day.low}°</span>
            </div>
            <div style={{ fontSize: 11, color: T.text3, margin: '4px 0' }}>{day.condition}</div>
            <div style={{ fontSize: 10, color: T.text3 }}>Precip: {day.precip}%</div>
            <div style={{ marginTop: 8 }}>
              <Badge variant={riskVariant[day.dispatchRisk]}>
                {day.dispatchRisk}
              </Badge>
            </div>
          </div>
        ))}
      </div>

      <div style={{ fontSize: 11, color: T.text4 }}>
        MVP: Seed data — Phase 2 will connect to OpenWeatherMap API via VITE_WEATHER_API_KEY
      </div>
    </div>
  )
}
