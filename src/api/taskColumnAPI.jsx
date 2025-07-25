import nimbanAPI from "./nimbanAPI"

export async function apiPatchTaskColumn(columnId, props) {
  try {
    const response = await nimbanAPI.patch(`taskColumns/${columnId}`, props)
    return response.data
  } catch (error) {
    console.log(error.message)
  }
}

export async function apiCreateTaskColumn(id, props) {
  try {
    const response = await nimbanAPI.post(`projects/${id}/taskColumns`, props)
    return response.data
  } catch (error) {
    console.log(error.message)
  }
}

export async function apiDeleteTaskColumn(columnId) {
  try {
    const response = await nimbanAPI.delete(`taskColumns/${columnId}`)
    return response.data
  } catch (error) {
    console.log(error.message)
  }
}
