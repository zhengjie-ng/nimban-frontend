import nimbanAPI from "./nimbanAPI"

export async function apiGetCustomers(email = null) {
  try {
    const params = {}
    if (email) {
      params.email = email
    }
    const response = await nimbanAPI.get("/customers", { params })
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

export async function apiUpdateCustomer(id, props) {
  try {
    const response = await nimbanAPI.patch(`/customers/${id}`, props)
    return response.data
  } catch (error) {
    console.log(error.message)
  }
}

export async function apiCreateCustomer(props) {
  try {
    const response = await nimbanAPI.post(`/customers`, props)
    return response.data
  } catch (error) {
    console.log(error.message)
  }
}

export async function apiCheckEmailExists(email) {
  try {
    const response = await nimbanAPI.get("/customers", {
      params: { email },
    })
    return response.data.length > 0
  } catch (error) {
    console.log(error.message)
    return false
  }
}
