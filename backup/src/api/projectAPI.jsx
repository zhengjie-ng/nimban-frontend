import nimbanAPI from "./nimbanAPI"

export async function apiCreateProject(id, props) {
  try {
    const response = await nimbanAPI.post(`/customers/${id}/projects`, props)
    return response.data
  } catch (error) {
    console.log(error.message)
  }
}

export async function apiGetProject(projectId) {
  try {
    const response = await nimbanAPI.get(`projects/${projectId}`)
    return response.data
  } catch (error) {
    console.log(error.message)
  }
}

export async function apiDeleteProject(projectId) {
  try {
    const response = await nimbanAPI.delete(`projects/${projectId}`)
    return response.data
  } catch (error) {
    console.log(error.message)
  }
}
