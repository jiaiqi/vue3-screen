import type { GraphNodeMeta } from '../types'

export const pumpMeta: GraphNodeMeta = {
  type: 'graph-pump',
  name: '水泵',
  category: 'industrial',
  icon: 'i-carbon-cube',
  defaultSize: { w: 80, h: 80 },
  defaultPorts: [
    { id: 'in', position: 'left', type: 'target' },
    { id: 'out', position: 'right', type: 'source' },
  ],
  svgSource: `<svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="50" cy="50" r="40" stroke="currentColor" stroke-width="4" fill="var(--color-surface-elevated)"/>
    <path d="M30 50 L50 30 L70 50 L50 70 Z" fill="currentColor" opacity="0.5"/>
    <circle cx="50" cy="50" r="10" fill="currentColor"/>
  </svg>`,
  stateMapping: {
    states: [
      { name: 'running', condition: 'v === "running"', style: { borderColor: '#00e676' }, animation: 'rotate' },
      { name: 'fault', condition: 'v === "fault"', style: { borderColor: '#ff4081' }, animation: 'blink', badge: { text: '故障', color: '#ff4081' } },
      { name: 'stop', condition: 'v === "stop"', style: { opacity: 0.4 }, animation: 'none' },
    ],
  },
}

export const valveMeta: GraphNodeMeta = {
  type: 'graph-valve',
  name: '阀门',
  category: 'industrial',
  icon: 'i-carbon-settings',
  defaultSize: { w: 60, h: 60 },
  defaultPorts: [
    { id: 'in', position: 'left', type: 'target' },
    { id: 'out', position: 'right', type: 'source' },
  ],
  svgSource: `<svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M20 30 L50 50 L20 70 Z" fill="currentColor" opacity="0.5"/>
    <path d="M80 30 L50 50 L80 70 Z" fill="currentColor" opacity="0.5"/>
    <rect x="45" y="10" width="10" height="40" fill="currentColor"/>
    <circle cx="50" cy="10" r="8" stroke="currentColor" stroke-width="2" fill="var(--color-surface-elevated)"/>
  </svg>`,
  stateMapping: {
    states: [
      { name: 'open', condition: 'v === "open"', style: { fillColor: '#00e676' } },
      { name: 'closed', condition: 'v === "closed"', style: { fillColor: '#ff4081' } },
    ],
  },
}

export const tankMeta: GraphNodeMeta = {
  type: 'graph-tank',
  name: '储罐',
  category: 'industrial',
  icon: 'i-carbon-cube',
  defaultSize: { w: 100, h: 120 },
  defaultPorts: [
    { id: 'in', position: 'top', type: 'target' },
    { id: 'out', position: 'bottom', type: 'source' },
  ],
  svgSource: `<svg viewBox="0 0 100 120" fill="none" xmlns="http://www.w3.org/2000/svg">
    <ellipse cx="50" cy="20" rx="40" ry="15" stroke="currentColor" stroke-width="2" fill="var(--color-surface-elevated)"/>
    <rect x="10" y="20" width="80" height="80" stroke="currentColor" stroke-width="2" fill="var(--color-surface-elevated)"/>
    <ellipse cx="50" cy="100" rx="40" ry="15" stroke="currentColor" stroke-width="2" fill="var(--color-surface-elevated)"/>
    <rect x="20" y="40" width="60" height="50" fill="currentColor" opacity="0.3"/>
  </svg>`,
}

export const motorMeta: GraphNodeMeta = {
  type: 'graph-motor',
  name: '电机',
  category: 'industrial',
  icon: 'i-carbon-renew',
  defaultSize: { w: 80, h: 80 },
  defaultPorts: [
    { id: 'power', position: 'left', type: 'target' },
    { id: 'out', position: 'right', type: 'source' },
  ],
  svgSource: `<svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="10" y="30" width="60" height="40" rx="5" stroke="currentColor" stroke-width="2" fill="var(--color-surface-elevated)"/>
    <circle cx="80" cy="50" r="15" stroke="currentColor" stroke-width="2" fill="var(--color-surface-elevated)"/>
    <circle cx="80" cy="50" r="5" fill="currentColor"/>
    <line x1="30" y1="40" x2="50" y2="40" stroke="currentColor" stroke-width="2"/>
    <line x1="30" y1="50" x2="50" y2="50" stroke="currentColor" stroke-width="2"/>
    <line x1="30" y1="60" x2="50" y2="60" stroke="currentColor" stroke-width="2"/>
  </svg>`,
  stateMapping: {
    states: [
      { name: 'running', condition: 'v === "running"', style: { borderColor: '#00e676' }, animation: 'rotate' },
      { name: 'fault', condition: 'v === "fault"', style: { borderColor: '#ff4081' }, animation: 'blink' },
    ],
  },
}
