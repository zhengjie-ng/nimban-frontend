import { BrowserRouter, Routes, Route } from "react-router-dom"
import LoginPage from "./routes/LoginPage"
import { GlobalProvider } from "./context/GlobalContext"
import HomePage from "./routes/HomePage"

function App() {
  return (
    <div>
      <BrowserRouter>
        <GlobalProvider>
          <Routes>
            <Route path="/" element={<LoginPage />} />
            <Route path="/home" element={<HomePage />} />
          </Routes>
        </GlobalProvider>
      </BrowserRouter>
    </div>
  )
}

export default App
