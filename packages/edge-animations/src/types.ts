export interface EdgeAnimationConfig {
  type: 'none' | 'waterFlow' | 'electric' | 'arrowFlow' | 'particle' | 'pulse'
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
}

export interface DataDrivenAnimation {
  speedField?: string
  dirField?: string
  colorField?: string
  activeField?: string
  colorMap?: { value: number; color: string }[]
}
