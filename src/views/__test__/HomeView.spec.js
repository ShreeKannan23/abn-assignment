import { describe, it, expect, vi, afterEach, beforeEach } from 'vitest'
import { flushPromises, mount } from '@vue/test-utils'
import HomeView from '../HomeView.vue'
import GraphViewVue from '@/components/GraphView.vue'
import * as service from '../../../service/service'

describe('HomeView', () => {
  let wrapper
  afterEach(() => {
    vi.restoreAllMocks()
  })

  beforeEach(() => {
    wrapper = mount(HomeView, { shallow: true })
  })

  it('should render', () => {
    const header = wrapper.get('h2')
    const leftPane = wrapper.get('.left-pane')
    const rightPane = wrapper.get('.right-pane')
    expect(header.text()).equals('Graph View')
    expect(leftPane).to.exist
    expect(rightPane).to.exist
  })

  it('should emit proper node data when graph is selected', async () => {
    const leftPane = wrapper.get('.left-pane')
    expect(leftPane).exist
    const graph = wrapper.getComponent(GraphViewVue)
    expect(graph).to.exist
    graph.vm.$emit('onNodeSelection', { selectedNode: { name: 'A', description: 'test' } })
    await graph.vm.$nextTick()
    expect(graph.emitted('onNodeSelection')[0]).toEqual([
      { selectedNode: { name: 'A', description: 'test' } }
    ])
  })

  it('should call getGraphData when fetchGraphData called', async () => {
    const spy = vi.spyOn(service, 'getGraphData')
    wrapper.vm.fetchGraphData()
    await wrapper.vm.$nextTick()
    await flushPromises()
    expect(spy).toBeCalled()
    expect(spy).toBeCalledWith(service.ENDPOINTS.GET_GRAPH_DATA)
  })

  it('should return proper response data', async () => {
    const response = await service.getGraphData(service.ENDPOINTS.GET_GRAPH_DATA)
    await flushPromises()
    expect(response).toEqual({
      data: [
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
        },
        {
          name: 'D',
          description: 'This is a description of D',
          parent: 'A'
        },
        {
          name: 'B-1',
          description: 'This is a description of B-1',
          parent: 'B'
        },
        {
          name: 'B-2',
          description: 'This is a description of B-2',
          parent: 'B'
        },
        {
          name: 'B-3',
          description: 'This is a description of B-3',
          parent: 'B'
        }
      ]
    })
  })

  it('should display proper name & description on left pane', async () => {
    const graph = wrapper.getComponent(GraphViewVue)
    graph.vm.$emit('onNodeSelection', { selectedNode: { name: 'A', description: 'test' } })
    await graph.vm.$nextTick()
    const node = wrapper.find('.selected-node')
    expect(node.find('h3').text()).equals('Node A selected')
    expect(node.find('p').text()).equals('test')
  })

  it('should set resetSelection to true when close button clicked', async () => {
    const graph = wrapper.getComponent(GraphViewVue)
    graph.vm.$emit('onNodeSelection', { selectedNode: { name: 'A', description: 'test' } })
    await graph.vm.$nextTick()
    const node = wrapper.find('.selected-node')
    const closeBtn = node.find('.close-button')
    closeBtn.trigger('click')
    await graph.vm.$nextTick()
    expect(wrapper.vm.resetSelection).toBeTruthy
  })
})
