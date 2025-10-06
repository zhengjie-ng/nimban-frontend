import nimbanAPI from "./nimbanAPI"

// Get all customers (admin only)
export const apiGetAllCustomers = async () => {
  const response = await nimbanAPI.get("/api/admin/customers")
  return response.data
}

// Get customer by ID (admin only)
export const apiGetCustomerById = async (id) => {
  const response = await nimbanAPI.get(`/api/admin/customers/${id}`)
  return response.data
}

// Update customer status (admin only)
export const apiUpdateCustomerStatus = async (id, enabled) => {
  const response = await nimbanAPI.put(
    `/api/admin/customers/${id}/status?enabled=${enabled}`
  )
  return response.data
}

// Update customer role (admin only)
export const apiUpdateCustomerRole = async (id, roleName) => {
  const response = await nimbanAPI.put(
    `/api/admin/customers/${id}/role?roleName=${roleName}`
  )
  return response.data
}

// Update customer lock status (admin only)
export const apiUpdateCustomerLock = async (id, locked) => {
  const response = await nimbanAPI.put(
    `/api/admin/customers/${id}/lock?locked=${locked}`
  )
  return response.data
}

// Update customer password (admin only)
export const apiUpdateCustomerPassword = async (id, password) => {
  const response = await nimbanAPI.put(
    `/api/admin/customers/${id}/password?password=${encodeURIComponent(password)}`
  )
  return response.data
}
