import nimbanAPI from "./nimbanAPI"

export async function apiCreateProject(props) {
  try {
    const response = await nimbanAPI.post(`/projects`, props)
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

export async function apiPatchProject(id, props) {
  try {
    const response = await nimbanAPI.patch(`/projects/${id}`, props)
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
