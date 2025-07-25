import nimbanAPI from "./nimbanAPI"

export async function apiGetCustomers() {
  try {
    const response = await nimbanAPI.get("/customers")
    return response.data
  } catch (error) {
    console.log(error.message)
  }
}

export async function apiGetCustomer(id) {
  try {
    const response = await nimbanAPI.get(`/customers/${id}`)
    return response.data
  } catch (error) {
    console.log(error.message)
  }
}

export async function apiPatchCustomer(id, props) {
  try {
    const response = await nimbanAPI.patch(`/customers/${id}`, props)
    return response.data
  } catch (error) {
    console.log(error.message)
  }
}
