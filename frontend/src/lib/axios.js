import axios from "axios";

const BASE_URL =
  import.meta.env.MODE === "development"
    ? "http://localhost:3000"
    : "https://yoga-master-server-zquu.onrender.com";

const api = axios.create({
  baseURL: BASE_URL,
});


export default api;


