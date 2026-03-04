<script setup lang="ts">
import { ref, computed, onMounted, markRaw } from 'vue'
import { VueFlow, useVueFlow, type Node, type Edge, type Connection } from '@vue-flow/core'
import { Background } from '@vue-flow/background'
import { Controls } from '@vue-flow/controls'
import { MiniMap } from '@vue-flow/minimap'
import '@vue-flow/core/dist/style.css'
import '@vue-flow/core/dist/theme-default.css'
import '@vue-flow/controls/dist/style.css'
import '@vue-flow/minimap/dist/style.css'

import WidgetNode from './nodes/WidgetNode.vue'
import GraphNode from './nodes/GraphNode.vue'
import { useDesignerStore } from '@/stores/designer'

const designerStore = useDesignerStore()

const nodeTypes = {
  widget: markRaw(WidgetNode),
  graph: markRaw(GraphNode),
}

const { onConnect, onNodesChange, onEdgesChange, addNodes, addEdges, project } = useVueFlow()

const nodes = computed<Node[]>(() => {
  const widgetNodes: Node[] = designerStore.nodes.map(n => ({
    id: n.id,
    type: 'widget',
    position: { x: n.layout.x, y: n.layout.y },
    data: { 
      label: n.label, 
      props: n.props, 
      style: n.style,
      componentType: n.type,
    },
  }))

  const graphNodes: Node[] = designerStore.graphNodes.map(n => ({
    id: n.id,
    type: 'graph',
    position: { x: n.layout.x, y: n.layout.y },
    data: {
      label: n.label,
      graphType: n.graphType,
      svgSource: n.svgSource,
      ports: n.ports,
    },
  }))

  return [...widgetNodes, ...graphNodes]
})

const edges = computed<Edge[]>(() => {
  return (designerStore.edges || []).map(e => ({
    id: e.id,
    source: e.source,
    sourceHandle: e.sourcePort,
    target: e.target,
    targetHandle: e.targetPort,
    type: e.animation?.type || 'default',
    animated: e.animation?.type !== 'none',
    style: {
      stroke: e.style.stroke,
      strokeWidth: e.style.strokeWidth,
      opacity: e.style.opacity,
    },
    data: {
      animation: e.animation,
      label: e.label,
    },
  }))
})

onConnect((params: Connection) => {
  addEdges([{
    id: `edge-${Date.now()}`,
    source: params.source,
    sourceHandle: params.sourceHandle,
    target: params.target,
    targetHandle: params.targetHandle,
    type: 'default',
  }])
})

const fitViewOnInit = true
</script>

<template>
  <div class="topology-canvas h-full w-full">
    <VueFlow
      :nodes="nodes"
      :edges="edges"
      :node-types="nodeTypes"
      :fit-view-on-init="fitViewOnInit"
      :snap-to-grid="true"
      :snap-grid="[20, 20]"
      class="bg-canvas-bg"
    >
      <Background :gap="20" :size="1" pattern-color="rgba(255,255,255,0.05)" />
      <Controls />
      <MiniMap />
    </VueFlow>
  </div>
</template>

<style>
.vue-flow__minimap {
  background: var(--color-surface);
  border: 1px solid var(--color-border);
}

.vue-flow__controls {
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: 8px;
}

.vue-flow__controls-button {
  background: transparent;
  border-bottom: 1px solid var(--color-border);
  color: var(--color-text-secondary);
}

.vue-flow__controls-button:hover {
  background: var(--color-surface-elevated);
  color: var(--color-primary);
}
</style>
