import axios from "axios"
const BASE_URL = "http://localhost:8080"
// const BASE_URL = "/api/"
const nimbanAPI = axios.create({ baseURL: BASE_URL })

export default nimbanAPI
