import nimbanAPI from "./nimbanAPI"

export async function apiCreateTask(id, props) {
  try {
    const response = await nimbanAPI.post(`/projects/${id}/tasks`, props)
    return response.data
  } catch (error) {
    console.log(error.message)
  }
}

export async function apiPatchTask(id, props) {
  try {
    const response = await nimbanAPI.patch(`/tasks/${id}`, props)
    return response.data
  } catch (error) {
    console.log(error.message)
  }
}

export async function apiDeleteTask(id) {
  try {
    const response = await nimbanAPI.delete(`tasks/${id}`)
    return response.data
  } catch (error) {
    console.log(error.message)
  }
}
