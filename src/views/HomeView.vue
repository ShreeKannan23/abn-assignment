<script setup>
import { ref } from 'vue'
import { getGraphData, ENDPOINTS } from '../../service/service.js'
import GraphView from '../components/GraphView.vue'

// MARK - properties

const graphData = ref([])
const nodeContent = ref({})
const resetSelection = ref(false)

// MARK - methods

async function fetchGraphData() {
  try {
    const { data } = await getGraphData(ENDPOINTS.GET_GRAPH_DATA)
    graphData.value = data
  } catch (err) {
    console.log('unable to get graph data',err)
  }
}

function displaySelectedNode({ selectedNode: { name, description } }) {
  nodeContent.value = {
    ...nodeContent.value,
    name,
    description
  }
  resetSelection.value = false
}

fetchGraphData()

</script>

<template>
  <main>
    <h2 class="header">Graph View</h2>
    <div class="content">
      <div class="left-pane">
        <template v-if="nodeContent.name && !resetSelection">
        <div class="selected-node">
            <h3>Node {{ nodeContent.name }} selected</h3>
            <p>{{ nodeContent.description }}</p>
            <div class="close-button" @click="resetSelection = true">X</div>
          </div>
      </template>
      </div>
      <div class="right-pane graphView">
        <GraphView :data="graphData" @onNodeSelection="displaySelectedNode" :resetSelection="resetSelection"/>
      </div>
    </div>
  </main>
</template>

<style scoped>
.header {
  padding: 16px;
  border-bottom: 1px solid #a5a5a5;
}

.content {
  width: 100%;
  display: flex;
  justify-content: center;
}

.left-pane {
  width: 30%;
}
.selected-node {
  padding: 16px;
  margin: 24px 0 0 24px;
  border: 1px solid #235743;
  height: fit-content;
  position: relative;
  background: #bebebe;
  color: #000;
  border-radius: 4px;
}

.close-button {
  position: absolute;
  top: 0px;
  right: 0px;
  width: 24px;
  height: max-content;
  background: #235743;
  text-align: center;
  cursor: pointer;
}

.right-pane {
  width: 70%;
}
</style>
