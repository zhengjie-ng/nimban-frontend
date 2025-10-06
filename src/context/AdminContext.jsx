import { createContext, useState, useCallback } from "react"
import {
  apiGetAllCustomers,
  apiGetCustomerById,
  apiUpdateCustomerStatus,
  apiUpdateCustomerRole,
  apiUpdateCustomerLock,
  apiUpdateCustomerPassword,
} from "@/api/adminAPI"

const AdminContext = createContext()

export function AdminProvider({ children }) {
  const [customers, setCustomers] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const fetchCustomers = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)

      const token = localStorage.getItem("jwtToken")
      if (!token) {
        throw new Error("No authentication token found")
      }

      const data = await apiGetAllCustomers()
      const sortedCustomers = data.sort((a, b) => a.id - b.id)
      setCustomers(sortedCustomers)
    } catch (err) {
      console.error("Admin fetch error:", err)
      const errorMessage =
        err.response?.data?.message ||
        err.message ||
        "Error fetching customers"
      setError(errorMessage)
    } finally {
      setLoading(false)
    }
  }, [])

  const getCustomerById = useCallback(async (id) => {
    try {
      const customer = await apiGetCustomerById(id)
      return customer
    } catch (err) {
      const errorMessage =
        err.response?.data?.message ||
        err.message ||
        "Error fetching customer details"
      console.error(errorMessage)
      return null
    }
  }, [])

  const updateCustomerStatus = useCallback(async (id, enabled) => {
    try {
      await apiUpdateCustomerStatus(id, enabled)

      // Update local state
      setCustomers((prev) =>
        prev
          .map((customer) =>
            customer.id === id ? { ...customer, enabled } : customer
          )
          .sort((a, b) => a.id - b.id)
      )

      return { success: true }
    } catch (err) {
      const errorMessage =
        err.response?.data?.message ||
        err.message ||
        "Error updating customer status"
      console.error(errorMessage)
      return { success: false, error: errorMessage }
    }
  }, [])

  const updateCustomerRole = useCallback(async (id, roleName) => {
    try {
      const updated = await apiUpdateCustomerRole(id, roleName)

      // Update local state
      setCustomers((prev) =>
        prev
          .map((customer) =>
            customer.id === id ? { ...customer, role: updated.role } : customer
          )
          .sort((a, b) => a.id - b.id)
      )

      return { success: true }
    } catch (err) {
      const errorMessage =
        err.response?.data?.message ||
        err.message ||
        "Error updating customer role"
      console.error(errorMessage)
      return { success: false, error: errorMessage }
    }
  }, [])

  const updateCustomerLock = useCallback(async (id, locked) => {
    try {
      await apiUpdateCustomerLock(id, locked)

      // Update local state
      setCustomers((prev) =>
        prev
          .map((customer) =>
            customer.id === id
              ? { ...customer, accountNonLocked: !locked }
              : customer
          )
          .sort((a, b) => a.id - b.id)
      )

      return { success: true }
    } catch (err) {
      const errorMessage =
        err.response?.data?.message ||
        err.message ||
        "Error updating customer lock status"
      console.error(errorMessage)
      return { success: false, error: errorMessage }
    }
  }, [])

  const updateCustomerPassword = useCallback(async (id, password) => {
    try {
      await apiUpdateCustomerPassword(id, password)
      return { success: true }
    } catch (err) {
      const errorMessage =
        err.response?.data?.message ||
        err.message ||
        "Error updating customer password"
      console.error(errorMessage)
      return { success: false, error: errorMessage }
    }
  }, [])

  const contextValue = {
    customers,
    loading,
    error,
    fetchCustomers,
    getCustomerById,
    updateCustomerStatus,
    updateCustomerRole,
    updateCustomerLock,
    updateCustomerPassword,
  }

  return (
    <AdminContext.Provider value={contextValue}>
      {children}
    </AdminContext.Provider>
  )
}

export default AdminContext
