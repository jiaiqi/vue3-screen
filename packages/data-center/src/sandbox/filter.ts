import dayjs from 'dayjs'
import _ from 'lodash-es'
import type { DataFilter, DataFilterContext } from '../types'

const allowedGlobals = new Set([
  'Math', 'JSON', 'Array', 'Object', 'String', 'Number', 'Boolean',
  'Date', 'RegExp', 'Error', 'Map', 'Set', 'Promise',
  'parseInt', 'parseFloat', 'isNaN', 'isFinite',
  'encodeURI', 'decodeURI', 'encodeURIComponent', 'decodeURIComponent',
])

const defaultContext: DataFilterContext = {
  $dayjs: dayjs,
  $_: _,
  Math,
  JSON,
  console: {
    log: () => {},
    warn: () => {},
    error: () => {},
  },
}

export function createFilter(code: string): DataFilter {
  const wrappedCode = `
    return (function(data, params, context) {
      const { $dayjs, $_, Math, JSON, console } = context;
      ${code}
    })
  `

  try {
    const factory = new Function(wrappedCode)
    const filter = factory()

    return (data: unknown, params: Record<string, unknown>, context = defaultContext) => {
      return filter(data, params, context)
    }
  } catch (error) {
    console.error('Failed to create filter:', error)
    return (data) => data
  }
}

export function executeFilter(
  filter: DataFilter,
  data: unknown,
  params: Record<string, unknown> = {},
  timeout: number = 2000
): Promise<unknown> {
  return new Promise((resolve, reject) => {
    const timeoutId = setTimeout(() => {
      reject(new Error('Filter execution timeout'))
    }, timeout)

    try {
      const result = filter(data, params, defaultContext)
      clearTimeout(timeoutId)
      
      if (result instanceof Promise) {
        result.then(resolve).catch(reject)
      } else {
        resolve(result)
      }
    } catch (error) {
      clearTimeout(timeoutId)
      reject(error)
    }
  })
}
