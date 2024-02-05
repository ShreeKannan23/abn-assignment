export const ENDPOINTS = {
    GET_GRAPH_DATA: '/api/graphData'
}

export async function getGraphData(url) {
    const origin = import.meta.env.DEV ? 'http://localhost:3000' : window.origin
    const endpoint = `${origin}${url}`
    const response = await fetch(endpoint)
    return response.json()
}
