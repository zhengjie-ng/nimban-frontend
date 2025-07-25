import { BrowserRouter, Routes, Route } from "react-router-dom"
import LoginPage from "./routes/LoginPage"
import { ProductProvider } from "./context/ProductContext"
import HomePage from "./routes/HomePage"

function App() {
  return (
    <div>
      <BrowserRouter>
        <ProductProvider>
          <Routes>
            <Route path="/" element={<LoginPage />} />
            <Route path="/home" element={<HomePage />} />
          </Routes>
        </ProductProvider>
      </BrowserRouter>
    </div>
  )
}

export default App
