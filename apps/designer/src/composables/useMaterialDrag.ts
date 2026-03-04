import type { ComponentMeta } from '@screen/components'

export interface MaterialDragData {
  type: string
  meta: ComponentMeta
}

export function useMaterialDrag() {
  function startDrag(e: DragEvent, data: MaterialDragData) {
    if (!e.dataTransfer) return
    
    e.dataTransfer.setData('application/json', JSON.stringify(data))
    e.dataTransfer.effectAllowed = 'copy'
    
    const ghost = document.createElement('div')
    ghost.className = 'material-ghost'
    ghost.textContent = data.meta.name
    ghost.style.cssText = `
      position: absolute;
      top: -1000px;
      padding: 8px 16px;
      background: var(--color-primary);
      color: white;
      border-radius: 4px;
      font-size: 12px;
    `
    document.body.appendChild(ghost)
    e.dataTransfer.setDragImage(ghost, 0, 0)
    
    setTimeout(() => ghost.remove(), 0)
  }

  function parseDragData(e: DragEvent): MaterialDragData | null {
    const data = e.dataTransfer?.getData('application/json')
    if (!data) return null
    
    try {
      return JSON.parse(data)
    } catch {
      return null
    }
  }

  return {
    startDrag,
    parseDragData,
  }
}
