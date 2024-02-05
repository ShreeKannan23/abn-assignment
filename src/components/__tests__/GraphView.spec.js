import { describe, it, expect, vi, afterEach, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import GraphView from '../GraphView.vue'

const mockGraphData = [
  {
    name: 'A',
    description: 'This is a description of A',
    parent: ''
  },
  {
    name: 'B',
    description: 'This is a description of B',
    parent: 'A'
  },
  {
    name: 'C',
    description: 'This is a description of C',
    parent: 'A'
  }
]
describe('GraphView', () => {
  let wrapper

  afterEach(() => {
    vi.restoreAllMocks()
  })

  beforeEach(() => {
    const ele = document.createElement('div')
    ele.setAttribute('id', 'graphView')
    if (document.body) {
      document.body.appendChild(ele)
    }
    wrapper = mount(GraphView, {
      props: { data: mockGraphData, resetSelection: false },
      shallow: true,
      attachTo: ele
    })
  })

  it('should renders properly', async () => {
    const graphView = wrapper.find('#graphView')
    expect(graphView).exist
  })

  it('should set proper graph data from D3', async () => {
    wrapper.vm.setupGraph(mockGraphData)
    await wrapper.vm.$nextTick()
    expect(wrapper.vm.graph.treeGraph).is.not.toBeNull
  })

  it('should not create svg element', async () => {
    const mockWrapper = mount(GraphView, {
      props: { data: [], resetSelection: false },
      shallow: true
    })
    mockWrapper.vm.setupGraph(mockGraphData)
    await mockWrapper.vm.$nextTick()
    expect(mockWrapper.vm.graph.treeGraph).is.toBeNull
  })

  it('should not create svg element', async () => {
    const mockWrapper = mount(GraphView, {
      props: { data: [], resetSelection: false },
      shallow: true
    })
    const spy = vi.spyOn(mockWrapper.vm, 'setupGraph')
    await mockWrapper.vm.$nextTick()
    expect(spy).not.toBeCalled
  })

  it('should call draw method', async () => {
    const spy = vi.spyOn(wrapper.vm, 'draw')
    wrapper.vm.setupGraph(mockGraphData)
    await wrapper.vm.$nextTick()
    expect(spy).toBeCalled
  })

  it('should return 3 tree node', async () => {
    wrapper.vm.setupGraph(mockGraphData)
    await wrapper.vm.$nextTick()
    expect(wrapper.vm.treeNodes._groups[0].length).toBe(3)
  })

  it('should call buildTreeNodeData', async () => {
    const spy = vi.spyOn(wrapper.vm, 'buildTreeNodeData')
    wrapper.vm.setupGraph(mockGraphData)
    await wrapper.vm.$nextTick()
    expect(spy).toBeCalled
  })

  it('should return proper tree data when buildTreeNodeData called', () => {
    const treeData = wrapper.vm.buildTreeNodeData(mockGraphData, '')
    expect(treeData[0].name).toBe('A')
    expect(treeData[0].description).toBe('This is a description of A')
    expect(treeData[0].parent).toBe('')
    expect(treeData[0].children.length).toBe(2)
    expect(treeData[0].children[0].name).toBe('B')
    expect(treeData[0].children[0].description).toBe('This is a description of B')
    expect(treeData[0].children[0].parent).toBe('A')
  })

  it('should emit onNodeSelection event with proper data', async () => {
    wrapper.vm.setupGraph(mockGraphData)
    await wrapper.vm.$nextTick()
    document.createElement
    wrapper.vm.handleClickAction(
      { currentTarget: wrapper.vm.treeNodes._groups[0][0] },
      { data: { name: 'A', description: 'test' } }
    )
    expect(wrapper.emitted('onNodeSelection')[0]).toEqual([
      { selectedNode: { name: 'A', description: 'test' } }
    ])
    wrapper.vm.handleClickAction(
      { currentTarget: wrapper.vm.treeNodes._groups[0][0] },
      { data: { name: 'A', description: 'test' } }
    )
    expect(wrapper.emitted('onNodeSelection')[0]).toEqual([
      { selectedNode: { name: 'A', description: 'test' } }
    ])
  })

  it('check reset works', async () => {
    wrapper.vm.setupGraph(mockGraphData)
    await wrapper.vm.$nextTick()
    wrapper.vm.resetNodeSelection()
    await wrapper.vm.$nextTick()
    expect('node', wrapper.vm.treeNodes._groups[0][0]).not.toBe(null)
  })
})
