export interface ScreenSchema {
  version: '2.1.0'
  id: string
  name: string
  canvas: CanvasConfig
  dataSources: DataSource[]
  variables: Variable[]
  globalFilters: Filter[]
  theme: ThemeConfig
  pages: Page[]
  events: EventBinding[]
}

export interface CanvasConfig {
  width: number
  height: number
  background: Background
  fitMode: 'scale' | 'vw' | 'rem'
  canvasMode: 'screen' | 'hybrid' | 'topology'
  grid?: GridConfig
  rulers?: boolean
}

export interface Background {
  color?: string
  image?: string
  opacity?: number
  size?: string
  position?: string
  repeat?: string
}

export interface GridConfig {
  enabled: boolean
  size: number
  snap: boolean
  color?: string
  majorColor?: string
  showMajor?: boolean
  majorInterval?: number
}

export interface DataSource {
  id: string
  name: string
  type: 'rest' | 'websocket' | 'database' | 'mqtt' | 'static'
  config: Record<string, unknown>
}

export interface Variable {
  id: string
  name: string
  type: 'string' | 'number' | 'boolean' | 'object' | 'array'
  defaultValue: unknown
}

export interface Filter {
  id: string
  name: string
  code: string
}

export interface ThemeConfig {
  mode: 'light' | 'dark' | 'auto'
  primaryColor?: string
  customVars?: Record<string, string>
}

export interface Page {
  id: string
  name: string
  nodes: ComponentNode[]
  graphNodes?: GraphNodeSchema[]
  edges?: EdgeSchema[]
  graphLayout?: GraphLayout
}

export interface ComponentNode {
  id: string
  nodeKind: 'widget'
  type: string
  label: string
  layout: NodeLayout
  props: Record<string, unknown>
  style: NodeStyle
  dataBinding?: DataBinding
  events?: NodeEvent[]
  locked?: boolean
  visible?: boolean
}

export interface GraphNodeSchema {
  id: string
  nodeKind: 'graph'
  graphType: string
  svgSource?: string
  label: string
  layout: NodeLayout
  ports: Port[]
  stateMapping?: StateMapping
  tooltip?: TooltipConfig
}

export interface EdgeSchema {
  id: string
  source: string
  sourcePort: string
  target: string
  targetPort: string
  pathType: 'bezier' | 'straight' | 'step' | 'smoothstep' | 'orthogonal'
  style: EdgeStyle
  animation: EdgeAnimation
  label?: EdgeLabel
}

export interface NodeLayout {
  x: number
  y: number
  w: number
  h: number
  rotate?: number
}

export interface NodeStyle {
  background?: string
  border?: string
  borderRadius?: number
  opacity?: number
  shadow?: string
}

export interface Port {
  id: string
  position: 'top' | 'right' | 'bottom' | 'left'
  offset?: { x: number; y: number }
  type: 'source' | 'target' | 'both'
  allowedEdges?: string[]
}

export interface DataBinding {
  dataSourceId: string
  jsonPath?: string
  filterId?: string
  fieldMapping?: Record<string, string>
  refreshInterval?: number
}

export interface StateMapping {
  dataSourceId: string
  field: string
  rules: StateRule[]
}

export interface StateRule {
  condition: string
  style?: Partial<NodeStyle>
  nodeAnimation?: 'rotate' | 'blink' | 'pulse' | 'none'
  badge?: { text: string; color: string }
  affectEdges?: boolean
}

export interface TooltipConfig {
  fields: { label: string; binding: DataBinding }[]
  showMiniChart: boolean
}

export interface EdgeStyle {
  stroke: string
  strokeWidth: number
  opacity: number
}

export interface EdgeAnimation {
  type: 'none' | 'waterFlow' | 'electric' | 'arrowFlow' | 'particle' | 'pulse' | 'custom'
  speed: number
  direction: 'forward' | 'reverse' | 'auto'
  color: string
  opacity: number
  pipeWidth?: number
  fluidWidth?: number
  pipeColor?: string
  showPipe?: boolean
  particleCount?: number
  particleSize?: number
  particleGlow?: boolean
  dataBinding?: AnimationDataBinding
}

export interface AnimationDataBinding {
  speedField?: string
  dirField?: string
  colorField?: string
  activeField?: string
  colorMap?: { value: number; color: string }[]
}

export interface EdgeLabel {
  text: string
  dataBinding?: DataBinding
  position: number
  align: 'center' | 'source' | 'target'
}

export interface NodeEvent {
  eventName: string
  actions: Action[]
}

export interface Action {
  type: string
  targetId?: string
  params?: Record<string, unknown>
  condition?: string
  delay?: number
}

export interface EventBinding {
  sourceId: string
  eventName: string
  actions: Action[]
}

export interface GraphLayout {
  algorithm: 'dagre' | 'elk' | 'force' | 'manual'
  options: Record<string, unknown>
}
