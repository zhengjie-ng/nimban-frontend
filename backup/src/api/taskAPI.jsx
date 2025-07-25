import nimbanAPI from "./nimbanAPI"

export async function apiPatchTask(id, props) {
  try {
    const response = await nimbanAPI.patch(`/tasks/${id}`, props)
    return response.data
  } catch (error) {
    console.log(error.message)
  }
}
