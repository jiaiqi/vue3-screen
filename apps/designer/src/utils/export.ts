import type { ScreenSchema } from '@screen/core'

export interface ExportOptions {
  format: 'json' | 'html' | 'zip'
  includeAssets: boolean
  minify: boolean
}

export async function exportSchema(
  schema: ScreenSchema,
  options: ExportOptions
): Promise<Blob> {
  switch (options.format) {
    case 'json':
      return exportAsJson(schema, options)
    case 'html':
      return exportAsHtml(schema, options)
    case 'zip':
      return exportAsZip(schema, options)
    default:
      throw new Error(`Unsupported format: ${options.format}`)
  }
}

async function exportAsJson(schema: ScreenSchema, options: ExportOptions): Promise<Blob> {
  const json = JSON.stringify(schema, null, options.minify ? 0 : 2)
  return new Blob([json], { type: 'application/json' })
}

async function exportAsHtml(schema: ScreenSchema, options: ExportOptions): Promise<Blob> {
  const html = `<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${schema.name}</title>
  <script src="https://unpkg.com/vue@3/dist/vue.global.prod.js"></script>
  <script src="https://unpkg.com/echarts@5/dist/echarts.min.js"></script>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { overflow: hidden; background: ${schema.canvas.background?.color || '#0d1117'}; }
    #app { width: 100vw; height: 100vh; }
  </style>
</head>
<body>
  <div id="app"></div>
  <script>
    const schema = ${JSON.stringify(schema)};
    // 渲染逻辑...
  </script>
</body>
</html>`

  return new Blob([html], { type: 'text/html' })
}

async function exportAsZip(schema: ScreenSchema, options: ExportOptions): Promise<Blob> {
  throw new Error('ZIP export requires JSZip library')
}

export function downloadBlob(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}

export function downloadSchema(schema: ScreenSchema, options: ExportOptions): void {
  exportSchema(schema, options).then(blob => {
    const ext = options.format === 'json' ? 'json' : options.format === 'html' ? 'html' : 'zip'
    downloadBlob(blob, `${schema.name}.${ext}`)
  })
}
