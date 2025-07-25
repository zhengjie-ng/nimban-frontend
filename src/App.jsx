import { BrowserRouter, Routes, Route } from "react-router-dom"
import LoginPage from "./routes/LoginPage"
import { GlobalProvider } from "./context/GlobalContext"
import HomePage from "./routes/HomePage"
import SignUpPage from "./routes/SignUpPage"
import ForgetPasswordPage from "./routes/ForgetPasswordPage"

function App() {
  return (
    <div>
      <BrowserRouter>
        <GlobalProvider>
          <Routes>
            <Route path="/" element={<LoginPage />} />
            <Route path="/home" element={<HomePage />} />
            <Route path="/signup" element={<SignUpPage />} />
            <Route path="/forgetpassword" element={<ForgetPasswordPage />} />
          </Routes>
        </GlobalProvider>
      </BrowserRouter>
    </div>
  )
}

export default App
