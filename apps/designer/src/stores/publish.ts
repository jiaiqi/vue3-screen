import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { ScreenSchema } from '@screen/core'

export interface PublishConfig {
  id: string
  name: string
  password?: string
  token?: string
  expireAt?: string
  ipWhitelist?: string[]
  refererWhitelist?: string[]
  embedEnabled: boolean
  shareEnabled: boolean
}

export interface PublishedVersion {
  id: string
  version: string
  schema: ScreenSchema
  publishedAt: string
  publishedBy: string
  config: PublishConfig
}

export const usePublishStore = defineStore('publish', () => {
  const versions = ref<PublishedVersion[]>([])
  const currentVersion = ref<PublishedVersion | null>(null)
  const isPublishing = ref(false)

  const latestVersion = computed(() => versions.value[0])

  async function publish(schema: ScreenSchema, config: Partial<PublishConfig>): Promise<PublishedVersion> {
    isPublishing.value = true

    try {
      const version: PublishedVersion = {
        id: `ver-${Date.now()}`,
        version: generateVersion(versions.value.length),
        schema: JSON.parse(JSON.stringify(schema)),
        publishedAt: new Date().toISOString(),
        publishedBy: 'current-user',
        config: {
          id: schema.id,
          name: schema.name,
          embedEnabled: true,
          shareEnabled: true,
          ...config,
        },
      }

      const response = await fetch('/api/screens/publish', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(version),
      })

      if (!response.ok) {
        throw new Error(`发布失败: ${response.statusText}`)
      }

      versions.value.unshift(version)
      currentVersion.value = version

      return version
    } finally {
      isPublishing.value = false
    }
  }

  async function loadVersions(screenId: string): Promise<PublishedVersion[]> {
    const response = await fetch(`/api/screens/${screenId}/versions`)
    if (!response.ok) {
      throw new Error(`加载版本失败: ${response.statusText}`)
    }
    
    versions.value = await response.json()
    return versions.value
  }

  async function rollback(versionId: string): Promise<void> {
    const version = versions.value.find(v => v.id === versionId)
    if (!version) {
      throw new Error('版本不存在')
    }

    await publish(version.schema, version.config)
  }

  function generateUrl(version: PublishedVersion, type: 'view' | 'embed' | 'sdk'): string {
    const baseUrl = window.location.origin
    const token = version.config.token || ''

    switch (type) {
      case 'view':
        return `${baseUrl}/view?id=${version.id}&token=${token}`
      case 'embed':
        return `${baseUrl}/embed?id=${version.id}&token=${token}`
      case 'sdk':
        return `${baseUrl}/sdk/screen.js?id=${version.id}`
      default:
        return ''
    }
  }

  function generateEmbedCode(version: PublishedVersion): string {
    const url = generateUrl(version, 'embed')
    return `<iframe src="${url}" width="100%" height="100%" frameborder="0"></iframe>`
  }

  function generateSdkCode(version: PublishedVersion): string {
    const url = generateUrl(version, 'sdk')
    return `<script src="${url}"></script>
<screen-renderer screen-id="${version.id}" token="${version.config.token || ''}"></screen-renderer>`
  }

  return {
    versions,
    currentVersion,
    latestVersion,
    isPublishing,
    publish,
    loadVersions,
    rollback,
    generateUrl,
    generateEmbedCode,
    generateSdkCode,
  }
})

function generateVersion(count: number): string {
  const major = Math.floor(count / 10) + 1
  const minor = count % 10
  return `v${major}.${minor}.0`
}
