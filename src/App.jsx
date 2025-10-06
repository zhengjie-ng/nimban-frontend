import { BrowserRouter, Routes, Route } from "react-router-dom"
import LoginPage from "./routes/LoginPage"
import { GlobalProvider } from "./context/GlobalContext"
import { AdminProvider } from "./context/AdminContext"
import HomePage from "./routes/HomePage"
import SignUpPage from "./routes/SignUpPage"
import ForgetPasswordPage from "./routes/ForgetPasswordPage"
import AdminPage from "./routes/AdminPage"
import NightModeButton from "./components/NightModeButton"
import { ThemeProvider } from "@/components/theme-provider"

function App() {
  return (
    <div>
      <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
        <BrowserRouter>
          <GlobalProvider>
            <AdminProvider>
              <Routes>
                <Route path="/" element={<NightModeButton />}>
                  <Route index element={<LoginPage />} />
                  <Route path="home" element={<HomePage />} />
                  <Route path="signup" element={<SignUpPage />} />
                  <Route path="forgetpassword" element={<ForgetPasswordPage />} />
                  <Route path="admin" element={<AdminPage />} />
                </Route>
              </Routes>
            </AdminProvider>
          </GlobalProvider>
        </BrowserRouter>
      </ThemeProvider>
    </div>
  )
}

export default App
