import axios from "axios"

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8080"
const nimbanAPI = axios.create({ baseURL: BASE_URL })

// Add JWT token to all requests
nimbanAPI.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("jwtToken")
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Handle 401 responses (unauthorized)
nimbanAPI.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid, clear storage and redirect to login
      localStorage.removeItem("jwtToken")
      localStorage.removeItem("userEmail")
      window.location.href = "/"
    }
    return Promise.reject(error)
  }
)

export default nimbanAPI
