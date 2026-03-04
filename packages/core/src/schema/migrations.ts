import type { ScreenSchema } from './types'

export interface Migration {
  from: string
  to: string
  migrate: (schema: Record<string, unknown>) => ScreenSchema
}

export const migrations: Migration[] = [
  {
    from: '2.0.0',
    to: '2.1.0',
    migrate(schema: Record<string, unknown>): ScreenSchema {
      const s = schema as unknown as ScreenSchema
      s.pages?.forEach((p) => {
        p.graphNodes ??= []
        p.edges ??= []
        p.nodes?.forEach((n) => {
          n.nodeKind ??= 'widget'
        })
      })
      s.canvas.canvasMode ??= 'screen'
      return s
    },
  },
]

export function migrateSchema(schema: Record<string, unknown>, _targetVersion: string): ScreenSchema {
  let current: Record<string, unknown> = schema
  for (const migration of migrations) {
    if (current.version === migration.from) {
      current = migration.migrate(current) as unknown as Record<string, unknown>
    }
  }
  return current as unknown as ScreenSchema
}
