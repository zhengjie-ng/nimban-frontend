import nimbanAPI from "./nimbanAPI"

// Login
export const apiLogin = async (email, password) => {
  const response = await nimbanAPI.post("/api/auth/public/signin", {
    email,
    password,
  })
  return response.data
}

// Signup
export const apiSignup = async (signupData) => {
  const response = await nimbanAPI.post("/api/auth/public/signup", signupData)
  return response.data
}

// Get current user info
export const apiGetUserInfo = async () => {
  const response = await nimbanAPI.get("/api/auth/user")
  return response.data
}

// Logout
export const apiLogout = async () => {
  const response = await nimbanAPI.post("/api/auth/signout")
  return response.data
}
