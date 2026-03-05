<script setup lang="ts">
import { computed } from 'vue'
import type { Position } from '@vue-flow/core'

export interface PortProps {
  portId: string
  nodeId: string
  position: 'top' | 'right' | 'bottom' | 'left'
  portType: 'input' | 'output' | 'both'
  offset?: { x: number; y: number }
  dataType?: string
  disabled?: boolean
}

const props = withDefaults(defineProps<PortProps>(), {
  offset: () => ({ x: 50, y: 50 }),
  dataType: 'any',
  disabled: false,
})

const emit = defineEmits<{
  dragStart: [portId: string, event: MouseEvent]
  dragEnd: [portId: string, event: MouseEvent]
}>()

const positionMap: Record<string, Position> = {
  top: Position.Top,
  right: Position.Right,
  bottom: Position.Bottom,
  left: Position.Left,
}

const vueFlowPosition = computed(() => positionMap[props.position])

const portStyle = computed(() => {
  const baseStyle: Record<string, string> = {
    position: 'absolute',
    width: '12px',
    height: '12px',
    borderRadius: '50%',
    backgroundColor: getPortColor(),
    border: '2px solid white',
    cursor: props.disabled ? 'not-allowed' : 'crosshair',
    transition: 'all 0.2s ease',
    zIndex: '10',
  }

  const offsetPercent = `${props.offset.x}%`
  
  if (props.position === 'top' || props.position === 'bottom') {
    baseStyle.left = offsetPercent
    baseStyle.top = props.position === 'top' ? '-6px' : 'auto'
    baseStyle.bottom = props.position === 'bottom' ? '-6px' : 'auto'
  } else {
    baseStyle.top = offsetPercent
    baseStyle.left = props.position === 'left' ? '-6px' : 'auto'
    baseStyle.right = props.position === 'right' ? '-6px' : 'auto'
  }

  return baseStyle
})

function getPortColor(): string {
  if (props.disabled) {
    return '#6b7280'
  }
  
  switch (props.portType) {
    case 'input':
      return '#10b981'
    case 'output':
      return '#00d4ff'
    case 'both':
      return '#8b5cf6'
    default:
      return '#00d4ff'
  }
}

function handleMouseDown(event: MouseEvent) {
  if (props.disabled) return
  event.preventDefault()
  event.stopPropagation()
  emit('dragStart', props.portId, event)
}

function handleMouseUp(event: MouseEvent) {
  if (props.disabled) return
  event.preventDefault()
  event.stopPropagation()
  emit('dragEnd', props.portId, event)
}

function handleMouseEnter(event: MouseEvent) {
  if (props.disabled) return
  const target = event.target as HTMLElement
  target.style.transform = 'scale(1.3)'
  target.style.boxShadow = '0 0 12px rgba(0, 212, 255, 0.6)'
}

function handleMouseLeave(event: MouseEvent) {
  const target = event.target as HTMLElement
  target.style.transform = 'scale(1)'
  target.style.boxShadow = 'none'
}

const indicatorStyle = computed(() => {
  const size = '6px'
  const baseStyle: Record<string, string> = {
    position: 'absolute',
    width: size,
    height: size,
    borderRadius: '50%',
    backgroundColor: getIndicatorColor(),
    transition: 'all 0.2s ease',
  }

  const positionOffset = props.portType === 'input' ? '-8px' : '8px'
  
  if (props.position === 'top') {
    baseStyle.left = '50%'
    baseStyle.transform = 'translateX(-50%)'
    baseStyle.top = props.portType === 'input' ? '-14px' : '14px'
  } else if (props.position === 'bottom') {
    baseStyle.left = '50%'
    baseStyle.transform = 'translateX(-50%)'
    baseStyle.bottom = props.portType === 'input' ? '-14px' : '14px'
  } else if (props.position === 'left') {
    baseStyle.top = '50%'
    baseStyle.transform = 'translateY(-50%)'
    baseStyle.left = props.portType === 'input' ? '-14px' : '14px'
  } else {
    baseStyle.top = '50%'
    baseStyle.transform = 'translateY(-50%)'
    baseStyle.right = props.portType === 'input' ? '-14px' : '14px'
  }

  return baseStyle
})

function getIndicatorColor(): string {
  if (props.disabled) {
    return '#9ca3af'
  }
  
  switch (props.portType) {
    case 'input':
      return '#10b981'
    case 'output':
      return '#00d4ff'
    case 'both':
      return '#8b5cf6'
    default:
      return '#00d4ff'
  }
}
</script>

<template>
  <div
    :style="portStyle"
    :data-port-id="portId"
    :data-node-id="nodeId"
    :data-port-type="portType"
    @mousedown="handleMouseDown"
    @mouseup="handleMouseUp"
    @mouseenter="handleMouseEnter"
    @mouseleave="handleMouseLeave"
  >
    <div :style="indicatorStyle" />
  </div>
</template>

<style scoped>
.port {
  user-select: none;
}

.port:hover {
  z-index: 100;
}
</style>
