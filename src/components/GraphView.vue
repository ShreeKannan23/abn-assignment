<!-- eslint-disable no-unused-vars -->
<script setup>
import { ref, toRef, watch } from 'vue';
import * as d3 from 'd3'

// MARK - properties

const props = defineProps(['data', 'resetSelection'])
const emit = defineEmits(['onNodeSelection'])
const graph = ref({})
let treeNodes = {}

// MARK - methods

function buildTreeNodeData(data, parent) {
    const children = data.filter(item => item.parent === parent);
    return children.map(child => {
        const nestedChildren = buildTreeNodeData(data, child.name);
        return {
            ...child,
            children: nestedChildren.length ? nestedChildren : null,
        }
    })
}

function setupGraph(graphData) {
    const treeData = buildTreeNodeData(graphData, '')
    const container = document.querySelector('#graphView');
    if (container) {
        const margin = { top: 20, right: 90, bottom: 30, left: 90 }
        const width = container.clientWidth - margin.left - margin.right
        const height = container.clientHeight - margin.top - margin.bottom

        graph.value.treeGraph = d3.select("#graphView")
            .append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)

        const treeGraphLayout = d3.tree()
            .size([height, width])

        const hierarchyRoot = d3.hierarchy(treeData[0]);

        treeGraphLayout(hierarchyRoot);

        draw(hierarchyRoot)
    }
}

function draw(hierarchyRoot) {
    graph.value.treeGraph
        .append("g")
        .attr('class', 'paths-group')
        .selectAll('path.link')
        .data(hierarchyRoot.links())
        .enter().append('path')
        .attr('class', 'link')
        .attr('d', d3.linkVertical()
            .x(d => d.y)
            .y(d => d.x))
        .style("fill", "none")
        .style("stroke", "darkslateblue")
        .style("stroke-width", "4px")

    treeNodes = graph.value.treeGraph
        .selectAll('rect.node')
        .data(hierarchyRoot.descendants())
        .enter().append('rect')
        .attr('class', 'node')
        .attr('x', d => d.y)
        .attr('y', d => d.x - 30)
        .attr('width', 140)
        .attr('height', 60)
        .on('click', handleClickAction)

    graph.value.treeGraph
        .selectAll('text.label')
        .data(hierarchyRoot.descendants())
        .enter().append('text')
        .attr('class', 'label')
        .attr('x', d => d.y + 70)
        .attr('y', d => d.x)
        .attr('dy', '0.3em')
        .attr('text-anchor', 'middle')
        .text(d => d.data.name)
}

function handleClickAction({ currentTarget }, d) {
    const { data } = d
    resetNodeSelection(d)
    d3.select(currentTarget)
        .classed('highLighted', true)
        .attr('class', 'hightLight')
    emit('onNodeSelection', { selectedNode: data })
}

function resetNodeSelection(selectedNode) {
    treeNodes
        .classed('highlighted', false);
    treeNodes.filter(node => selectedNode ? node !== selectedNode : node).attr('class', 'node')
}

// MARK - watchers

watch(toRef(props, 'data'), (newValue, _oldValue) => {
    if (newValue.length > 0) {
        setupGraph(newValue)
    }
}, { immediate: true })

watch(toRef(props, 'resetSelection'), (newValue, _oldValue) => {
    if (newValue) {
        resetNodeSelection()
    }
}, { immediate: true })


</script>

<template>
    <div id="graphView">
    </div>
</template>

<style>
#graphView {
    width: 100%;
    height: 100Vh;
}

.node {
    fill: rgb(0, 113, 75);
    stroke: #212121;
    stroke-width: 2;
    cursor: pointer;
}

.hightLight {
    fill: rgb(3, 160, 107);
    stroke: #e2e2e2;
}

.label {
    fill: #000;
    pointer-events: none;
}
</style>