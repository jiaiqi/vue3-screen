export interface GraphNodeMeta {
  type: string
  name: string
  category: GraphNodeCategory
  icon: string
  svgSource?: string
  defaultSize: { w: number; h: number }
  defaultPorts: PortConfig[]
  stateMapping?: StateMappingConfig
}

export type GraphNodeCategory = 'industrial' | 'electrical' | 'instrument' | 'it-topology'

export interface PortConfig {
  id: string
  position: 'top' | 'right' | 'bottom' | 'left'
  offset?: { x: number; y: number }
  type: 'source' | 'target' | 'both'
  allowedEdges?: string[]
}

export interface StateMappingConfig {
  states: StateDefinition[]
}

export interface StateDefinition {
  name: string
  condition: string
  style: {
    borderColor?: string
    fillColor?: string
    opacity?: number
  }
  animation?: 'rotate' | 'blink' | 'pulse' | 'none'
  badge?: {
    text: string
    color: string
  }
}

export interface GraphNodeInstance {
  id: string
  type: string
  meta: GraphNodeMeta
  component: any
}
