import type { GraphNodeMeta } from '../types'

export const breakerMeta: GraphNodeMeta = {
  type: 'graph-breaker',
  name: '断路器',
  category: 'electrical',
  icon: 'i-carbon-power',
  defaultSize: { w: 60, h: 80 },
  defaultPorts: [
    { id: 'in', position: 'top', type: 'target' },
    { id: 'out', position: 'bottom', type: 'source' },
  ],
  svgSource: `<svg viewBox="0 0 60 80" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="10" y="10" width="40" height="60" stroke="currentColor" stroke-width="2" fill="var(--color-surface-elevated)"/>
    <line x1="30" y1="20" x2="30" y2="35" stroke="currentColor" stroke-width="2"/>
    <line x1="30" y1="45" x2="30" y2="60" stroke="currentColor" stroke-width="2"/>
    <line x1="20" y1="40" x2="40" y2="30" stroke="currentColor" stroke-width="2"/>
  </svg>`,
  stateMapping: {
    states: [
      { name: 'closed', condition: 'v === "closed"', style: { fillColor: '#00e676' } },
      { name: 'open', condition: 'v === "open"', style: { fillColor: '#ff9800' } },
      { name: 'tripped', condition: 'v === "tripped"', style: { fillColor: '#ff4081' }, badge: { text: '跳闸', color: '#ff4081' } },
    ],
  },
}

export const transformerMeta: GraphNodeMeta = {
  type: 'graph-transformer',
  name: '变压器',
  category: 'electrical',
  icon: 'i-carbon-diagram',
  defaultSize: { w: 80, h: 100 },
  defaultPorts: [
    { id: 'primary', position: 'top', type: 'target' },
    { id: 'secondary', position: 'bottom', type: 'source' },
  ],
  svgSource: `<svg viewBox="0 0 80 100" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="15" y="10" width="50" height="35" stroke="currentColor" stroke-width="2" fill="var(--color-surface-elevated)"/>
    <rect x="15" y="55" width="50" height="35" stroke="currentColor" stroke-width="2" fill="var(--color-surface-elevated)"/>
    <line x1="40" y1="5" x2="40" y2="10" stroke="currentColor" stroke-width="2"/>
    <line x1="40" y1="45" x2="40" y2="55" stroke="currentColor" stroke-width="2"/>
    <line x1="40" y1="90" x2="40" y2="95" stroke="currentColor" stroke-width="2"/>
    <line x1="25" y1="20" x2="25" y2="35" stroke="currentColor" stroke-width="1"/>
    <line x1="35" y1="20" x2="35" y2="35" stroke="currentColor" stroke-width="1"/>
    <line x1="45" y1="20" x2="45" y2="35" stroke="currentColor" stroke-width="1"/>
    <line x1="55" y1="20" x2="55" y2="35" stroke="currentColor" stroke-width="1"/>
    <line x1="25" y1="65" x2="25" y2="80" stroke="currentColor" stroke-width="1"/>
    <line x1="35" y1="65" x2="35" y2="80" stroke="currentColor" stroke-width="1"/>
    <line x1="45" y1="65" x2="45" y2="80" stroke="currentColor" stroke-width="1"/>
    <line x1="55" y1="65" x2="55" y2="80" stroke="currentColor" stroke-width="1"/>
  </svg>`,
}
