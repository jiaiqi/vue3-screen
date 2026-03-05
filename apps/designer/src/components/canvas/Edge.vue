<script setup lang="ts">
import { computed } from 'vue'

export interface EdgeProps {
  id: string
  sourceX: number
  sourceY: number
  targetX: number
  targetY: number
  sourcePosition?: 'top' | 'right' | 'bottom' | 'left'
  targetPosition?: 'top' | 'right' | 'bottom' | 'left'
  selected?: boolean
  animated?: boolean
  type?: 'straight' | 'bezier' | 'orthogonal'
}

const props = withDefaults(defineProps<EdgeProps>(), {
  sourcePosition: 'right',
  targetPosition: 'left',
  selected: false,
  animated: false,
  type: 'bezier',
})

const emit = defineEmits<{
  click: [edgeId: string, event: MouseEvent]
  contextmenu: [edgeId: string, event: MouseEvent]
}>()

const path = computed(() => {
  if (props.type === 'straight') {
    return `M ${props.sourceX} ${props.sourceY} L ${props.targetX} ${props.targetY}`
  }

  if (props.type === 'orthogonal') {
    return calculateOrthogonalPath()
  }

  return calculateBezierPath()
})

function calculateBezierPath(): string {
  const curvature = 0.5
  const distance = Math.sqrt(
    Math.pow(props.targetX - props.sourceX, 2) +
    Math.pow(props.targetY - props.sourceY, 2)
  )
  const controlOffset = distance * curvature

  const sourceOffsets = getControlOffsets(props.sourcePosition, controlOffset)
  const targetOffsets = getControlOffsets(props.targetPosition, controlOffset)

  const controlX1 = props.sourceX + sourceOffsets.x
  const controlY1 = props.sourceY + sourceOffsets.y
  const controlX2 = props.targetX - targetOffsets.x
  const controlY2 = props.targetY - targetOffsets.y

  return `M ${props.sourceX} ${props.sourceY} C ${controlX1} ${controlY1} ${controlX2} ${controlY2} ${props.targetX} ${props.targetY}`
}

function calculateOrthogonalPath(): string {
  const margin = 20
  const points = [
    { x: props.sourceX, y: props.sourceY },
  ]

  const sourceOffset = getDirectionOffset(props.sourcePosition, margin)
  const targetOffset = getDirectionOffset(props.targetPosition, margin)

  points.push({
    x: props.sourceX + sourceOffset.x,
    y: props.sourceY + sourceOffset.y,
  })

  const intermediateX = props.targetX - targetOffset.x
  const intermediateY = props.targetY - targetOffset.y

  if (props.sourcePosition === 'top' || props.sourcePosition === 'bottom') {
    if (Math.abs(points[1].x - intermediateX) > margin) {
      points.push({ x: intermediateX, y: points[1].y })
    }
  } else {
    if (Math.abs(points[1].y - intermediateY) > margin) {
      points.push({ x: points[1].x, y: intermediateY })
    }
  }

  points.push({ x: intermediateX, y: intermediateY })
  points.push({ x: props.targetX, y: props.targetY })

  return pointsToPath(points)
}

function getControlOffsets(position: string, offset: number): { x: number; y: number } {
  switch (position) {
    case 'top':
      return { x: 0, y: -offset }
    case 'bottom':
      return { x: 0, y: offset }
    case 'left':
      return { x: -offset, y: 0 }
    case 'right':
      return { x: offset, y: 0 }
    default:
      return { x: offset, y: 0 }
  }
}

function getDirectionOffset(position: string, distance: number): { x: number; y: number } {
  switch (position) {
    case 'top':
      return { x: 0, y: -distance }
    case 'bottom':
      return { x: 0, y: distance }
    case 'left':
      return { x: -distance, y: 0 }
    case 'right':
      return { x: distance, y: 0 }
    default:
      return { x: distance, y: 0 }
  }
}

function pointsToPath(points: { x: number; y: number }[]): string {
  if (points.length === 0) return ''

  let path = `M ${points[0].x} ${points[0].y}`

  for (let i = 1; i < points.length; i++) {
    path += ` L ${points[i].x} ${points[i].y}`
  }

  return path
}

const strokeColor = computed(() => {
  return props.selected ? '#00d4ff' : '#6b7280'
})

const strokeWidth = computed(() => {
  return props.selected ? 3 : 2
})

const arrowMarkerId = computed(() => {
  return `arrow-${props.id}`
})

function handleClick(event: MouseEvent) {
  emit('click', props.id, event)
}

function handleContextMenu(event: MouseEvent) {
  event.preventDefault()
  emit('contextmenu', props.id, event)
}
</script>

<template>
  <g
    class="edge-group"
    @click="handleClick"
    @contextmenu="handleContextMenu"
  >
    <defs>
      <marker
        :id="arrowMarkerId"
        markerWidth="10"
        markerHeight="10"
        refX="9"
        refY="3"
        orient="auto"
        markerUnits="strokeWidth"
      >
        <path
          d="M0,0 L0,6 L9,3 z"
          :fill="strokeColor"
        />
      </marker>
    </defs>

    <path
      :d="path"
      fill="none"
      :stroke="strokeColor"
      :stroke-width="strokeWidth"
      :stroke-dasharray="animated ? '5,5' : 'none'"
      :marker-end="`url(#${arrowMarkerId})`"
      class="edge-path"
      :class="{ selected, animated }"
    />

    <path
      :d="path"
      fill="none"
      stroke="transparent"
      :stroke-width="10"
      class="edge-hit-area"
    />
  </g>
</template>

<style scoped>
.edge-group {
  cursor: pointer;
  transition: all 0.2s ease;
}

.edge-path {
  transition: stroke 0.2s ease, stroke-width 0.2s ease;
}

.edge-path.selected {
  filter: drop-shadow(0 0 4px rgba(0, 212, 255, 0.6));
}

.edge-path.animated {
  animation: dashAnimation 1s linear infinite;
}

@keyframes dashAnimation {
  to {
    stroke-dashoffset: -10;
  }
}

.edge-hit-area {
  pointer-events: stroke;
}
</style>
