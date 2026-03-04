import type { GraphNodeMeta } from '../types'

export const gaugeMeta: GraphNodeMeta = {
  type: 'graph-gauge',
  name: '压力表',
  category: 'instrument',
  icon: 'i-carbon-dashboard',
  defaultSize: { w: 60, h: 60 },
  defaultPorts: [
    { id: 'in', position: 'bottom', type: 'target' },
  ],
  svgSource: `<svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="50" cy="50" r="45" stroke="currentColor" stroke-width="3" fill="var(--color-surface-elevated)"/>
    <path d="M50 50 L50 20" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
    <circle cx="50" cy="50" r="5" fill="currentColor"/>
    <path d="M20 70 A35 35 0 0 1 80 70" stroke="currentColor" stroke-width="2" fill="none"/>
  </svg>`,
}

export const flowMeterMeta: GraphNodeMeta = {
  type: 'graph-flowmeter',
  name: '流量计',
  category: 'instrument',
  icon: 'i-carbon-data-vis-1',
  defaultSize: { w: 80, h: 40 },
  defaultPorts: [
    { id: 'in', position: 'left', type: 'target' },
    { id: 'out', position: 'right', type: 'source' },
  ],
  svgSource: `<svg viewBox="0 0 100 50" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="5" y="5" width="90" height="40" rx="5" stroke="currentColor" stroke-width="2" fill="var(--color-surface-elevated)"/>
    <ellipse cx="50" cy="25" rx="20" ry="15" stroke="currentColor" stroke-width="2" fill="none"/>
    <line x1="50" y1="10" x2="50" y2="40" stroke="currentColor" stroke-width="1"/>
    <line x1="35" y1="25" x2="65" y2="25" stroke="currentColor" stroke-width="1"/>
  </svg>`,
}
