<script setup lang="ts">
import { computed, ref, onMounted, watch, markRaw, shallowRef } from 'vue'
import { VueFlow } from '@vue-flow/core'
import { Background } from '@vue-flow/background'
import '@vue-flow/core/dist/style.css'
import '@vue-flow/core/dist/theme-default.css'

import type { ScreenSchema, ComponentNode, GraphNodeSchema, EdgeSchema } from '@screen/core'
import { getComponent } from '@screen/components'
import { getGraphNode } from '@screen/graph-nodes'
import { WaterFlowEdge, ElectricEdge, ArrowFlowEdge, ParticleEdge, PulseEdge } from '@screen/edge-animations'

interface Props {
  schema: ScreenSchema
  containerWidth: number
  containerHeight: number
}

const props = defineProps<Props>()

const edgeTypes = {
  waterFlow: markRaw(WaterFlowEdge),
  electric: markRaw(ElectricEdge),
  arrowFlow: markRaw(ArrowFlowEdge),
  particle: markRaw(ParticleEdge),
  pulse: markRaw(PulseEdge),
}

const scale = computed(() => {
  const scaleX = props.containerWidth / props.schema.canvas.width
  const scaleY = props.containerHeight / props.schema.canvas.height
  return Math.min(scaleX, scaleY)
})

const transform = computed(() => {
  const offsetX = (props.containerWidth - props.schema.canvas.width * scale.value) / 2
  const offsetY = (props.containerHeight - props.schema.canvas.height * scale.value) / 2
  return `translate(${offsetX}px, ${offsetY}px) scale(${scale.value})`
})

const canvasStyle = computed(() => ({
  width: `${props.schema.canvas.width}px`,
  height: `${props.schema.canvas.height}px`,
  transform: transform.value,
  transformOrigin: 'top left',
  backgroundColor: props.schema.canvas.background?.color || '#0d1117',
  backgroundImage: props.schema.canvas.background?.image 
    ? `url(${props.schema.canvas.background.image})` 
    : undefined,
  backgroundSize: 'cover',
  backgroundPosition: 'center',
}))

const page = computed(() => props.schema.pages[0])

const nodes = computed(() => {
  const widgetNodes = page.value.nodes.map(n => ({
    id: n.id,
    type: 'widget',
    position: { x: n.layout.x, y: n.layout.y },
    data: n,
  }))

  const graphNodes = (page.value.graphNodes || []).map(n => ({
    id: n.id,
    type: 'graph',
    position: { x: n.layout.x, y: n.layout.y },
    data: n,
  }))

  return [...widgetNodes, ...graphNodes]
})

const edges = computed(() => {
  return (page.value.edges || []).map(e => ({
    id: e.id,
    source: e.source,
    sourceHandle: e.sourcePort,
    target: e.target,
    targetHandle: e.targetPort,
    type: e.animation?.type || 'default',
    animated: e.animation?.type !== 'none',
    style: e.style,
    data: { animation: e.animation },
  }))
})

const hasGraphContent = computed(() => 
  (page.value.graphNodes?.length || 0) > 0 || (page.value.edges?.length || 0) > 0
)
</script>

<template>
  <div class="screen-renderer relative h-full w-full overflow-hidden">
    <div class="canvas-viewport absolute inset-0 flex items-center justify-center">
      <div class="canvas relative" :style="canvasStyle">
        <!-- Widget Nodes -->
        <div
          v-for="node in page.nodes"
          :key="node.id"
          class="widget-node absolute"
          :style="{
            left: `${node.layout.x}px`,
            top: `${node.layout.y}px`,
            width: `${node.layout.w}px`,
            height: `${node.layout.h}px`,
            opacity: node.style?.opacity ?? 1,
            borderRadius: `${node.style?.borderRadius || 0}px`,
            transform: node.layout?.rotate ? `rotate(${node.layout.rotate}deg)` : undefined,
          }"
        >
          <component
            :is="getComponent(node.type)?.component"
            v-if="getComponent(node.type)"
            v-bind="node.props"
          />
        </div>

        <!-- Graph Layer (Vue Flow) -->
        <div v-if="hasGraphContent" class="graph-layer absolute inset-0 pointer-events-none">
          <VueFlow
            :nodes="nodes"
            :edges="edges"
            :edge-types="edgeTypes"
            :pan-on-drag="false"
            :zoom-on-scroll="false"
            :zoom-on-pinch="false"
            :prevent-scrolling="false"
            :nodes-draggable="false"
            :nodes-connectable="false"
            :elements-selectable="false"
          >
            <Background :gap="20" :size="1" pattern-color="transparent" />
          </VueFlow>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.screen-renderer {
  touch-action: none;
}

.graph-layer {
  z-index: 10;
}

.graph-layer :deep(.vue-flow__node) {
  pointer-events: auto;
}
</style>
