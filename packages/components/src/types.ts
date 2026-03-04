import type { JSONSchema7 } from 'json-schema'

export interface ComponentMeta {
  type: string
  name: string
  category: ComponentCategory
  icon: string
  thumbnail?: string
  defaultProps: Record<string, unknown>
  defaultSize: { w: number; h: number }
  propsSchema: JSONSchema7
  styleSchema?: JSONSchema7
  dataSchema?: JSONSchema7
  events?: EventDef[]
  actions?: ActionDef[]
  resizable: boolean
  aspectRatio?: number
}

export type ComponentCategory = 
  | 'chart' 
  | 'map' 
  | 'data' 
  | 'decoration' 
  | 'container' 
  | 'media'

export interface EventDef {
  name: string
  description?: string
  params?: JSONSchema7
}

export interface ActionDef {
  type: string
  description?: string
  params?: JSONSchema7
}

export interface ComponentInstance {
  id: string
  type: string
  meta: ComponentMeta
  component: any
}
