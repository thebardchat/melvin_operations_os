// Melvin Operations OS — full ecosystem service map
// Each node: id, label, description, url, status, layer, deps[], tags[]
// status: 'live' | 'planned' | 'offline' | 'unknown'
// layer: 'frontend' | 'engine' | 'api' | 'data' | 'infra' | 'repos'

export const LAYERS = [
  { id: 'frontend', label: 'Frontend', color: '#D4745F' },
  { id: 'engine',   label: 'Dispatch Engine', color: '#5B9BC7' },
  { id: 'api',      label: 'API / AI', color: '#D4A03C' },
  { id: 'data',     label: 'Data / Memory', color: '#A5D6A7' },
  { id: 'infra',    label: 'Infrastructure', color: '#B794D6' },
  { id: 'repos',    label: 'GitHub Repos', color: '#7A746E' },
]

export const SERVICES = [
  // ── FRONTEND ──────────────────────────────────────────────────────────────
  {
    id: 'melvin-app',
    label: 'Melvin OS',
    description: 'Local-first operations command center',
    url: 'http://10.0.0.19:5174',
    ghPages: 'https://thebardchat.github.io/melvin_operations_os/',
    status: 'live',
    layer: 'frontend',
    deps: ['dispatch-engine', 'mcp-server'],
    tags: ['React', 'Vite'],
  },

  // ── ENGINE ────────────────────────────────────────────────────────────────
  {
    id: 'dispatch-engine',
    label: 'Dispatch Engine',
    description: 'buildRoute · rotation · fairness · substitutions',
    url: null,
    status: 'live',
    layer: 'engine',
    deps: ['srm-tenant'],
    tags: ['pure JS', 'local'],
  },
  {
    id: 'srm-tenant',
    label: 'SRM Tenant Data',
    description: 'Drivers · plants · subs · BP groups',
    url: null,
    status: 'live',
    layer: 'engine',
    deps: [],
    tags: ['JSON', 'local'],
  },
  {
    id: 'briefing-engine',
    label: 'Briefing Engine',
    description: 'buildMorningBriefing — plain text for copy/push/TTS',
    url: null,
    status: 'live',
    layer: 'engine',
    deps: ['dispatch-engine'],
    tags: ['pure JS', 'local'],
  },

  // ── API / AI ──────────────────────────────────────────────────────────────
  {
    id: 'mcp-server',
    label: 'ShaneBrain MCP',
    description: '42 tools · knowledge · RAG · social · vault · health',
    url: 'http://localhost:8100/health',
    status: 'live',
    layer: 'api',
    deps: ['weaviate', 'shanebrain-pi'],
    tags: ['Docker', 'port 8100'],
  },
  {
    id: 'angel-cloud',
    label: 'Angel Cloud Gateway',
    description: 'FastAPI front door · registration · chat · leaderboard',
    url: 'http://localhost:4200',
    status: 'live',
    layer: 'api',
    deps: ['shanebrain-pi'],
    tags: ['FastAPI', 'port 4200'],
  },
  {
    id: 'weather-api',
    label: 'Weather API',
    description: 'OpenWeatherMap · dispatch risk overlay',
    url: null,
    status: 'planned',
    layer: 'api',
    deps: [],
    tags: ['future', 'VITE_WEATHER_API_KEY'],
  },
  {
    id: 'sms-notify',
    label: 'SMS Notify',
    description: 'vtext gateway · alerter + dispatch push',
    url: null,
    status: 'planned',
    layer: 'api',
    deps: ['shanebrain-pi'],
    tags: ['future', 'vtext'],
  },

  // ── DATA ──────────────────────────────────────────────────────────────────
  {
    id: 'weaviate',
    label: 'Weaviate',
    description: '25 collections · MiniLM-L6-v2 · 3200+ knowledge objects',
    url: 'http://neworleans:8080/v1/.well-known/ready',
    status: 'live',
    layer: 'data',
    deps: ['neworleans'],
    tags: ['v1.36.2', 'port 8080'],
  },
  {
    id: 'local-storage',
    label: 'Browser Storage',
    description: 'localStorage · dispatch state · start overrides',
    url: null,
    status: 'live',
    layer: 'data',
    deps: [],
    tags: ['localStorage', 'offline-first'],
  },
  {
    id: 'melvin-memory',
    label: 'Melvin Memory',
    description: 'MelvinDispatchRecord · MelvinShiftNote · MelvinBriefing',
    url: null,
    status: 'planned',
    layer: 'data',
    deps: ['weaviate'],
    tags: ['future', 'Weaviate'],
  },
  {
    id: 'n8n',
    label: 'N8N Workflows',
    description: 'Automation pipelines · briefing push · ingest',
    url: 'http://neworleans:5678',
    status: 'live',
    layer: 'data',
    deps: ['neworleans'],
    tags: ['port 5678'],
  },

  // ── INFRA ─────────────────────────────────────────────────────────────────
  {
    id: 'shanebrain-pi',
    label: 'shanebrain (Pi 5)',
    description: 'Controller · 16GB · RAID 1 2×2TB · all services',
    url: 'http://shanebrain:9000',
    status: 'live',
    layer: 'infra',
    deps: [],
    tags: ['Pi 5', 'Tailscale'],
  },
  {
    id: 'neworleans',
    label: 'neworleans',
    description: 'Data node · Weaviate · N8N · Postgres · Redis',
    url: null,
    status: 'live',
    layer: 'infra',
    deps: [],
    tags: ['Tailscale'],
  },
  {
    id: 'gulfshores',
    label: 'gulfshores',
    description: 'Build node · Node v24 · GitHub Pages deploy',
    url: null,
    status: 'live',
    layer: 'infra',
    deps: [],
    tags: ['Node v24', 'npm 11', 'build'],
    buildNode: true,
  },

  // ── REPOS ─────────────────────────────────────────────────────────────────
  {
    id: 'repo-melvin',
    label: 'melvin_operations_os',
    description: 'This repo — Melvin MVP',
    url: 'https://github.com/thebardchat/melvin_operations_os',
    status: 'live',
    layer: 'repos',
    deps: [],
    tags: ['main'],
  },
  {
    id: 'repo-srm-dispatch',
    label: 'srm-dispatch',
    description: 'Source dispatch logic (dump truck era)',
    url: 'https://github.com/thebardchat/srm-dispatch',
    status: 'live',
    layer: 'repos',
    deps: [],
    tags: ['reference'],
  },
  {
    id: 'repo-shanebrain-core',
    label: 'shanebrain-core',
    description: 'Local-first architecture · MCP · RAG',
    url: 'https://github.com/thebardchat/shanebrain-core',
    status: 'live',
    layer: 'repos',
    deps: [],
    tags: ['private'],
  },
  {
    id: 'repo-angel-cloud',
    label: 'angel-cloud',
    description: 'Wellness platform · messenger · leaderboard',
    url: 'https://github.com/thebardchat/angel-cloud',
    status: 'live',
    layer: 'repos',
    deps: [],
    tags: ['public'],
  },
  {
    id: 'repo-shanebrain-mcp',
    label: 'shanebrain_mcp',
    description: 'MCP server mirror — 42 tools',
    url: 'https://github.com/thebardchat/shanebrain_mcp',
    status: 'live',
    layer: 'repos',
    deps: [],
    tags: ['public'],
  },
  {
    id: 'repo-sb-management',
    label: 'SB-Management-OS',
    description: 'SOPs · operating standards · management OS',
    url: 'https://github.com/thebardchat/SB-Management-OS',
    status: 'live',
    layer: 'repos',
    deps: [],
    tags: ['reference'],
  },
]

export function getLayer(id) {
  return LAYERS.find(l => l.id === id)
}

export function getServicesByLayer(layerId) {
  return SERVICES.filter(s => s.layer === layerId)
}
