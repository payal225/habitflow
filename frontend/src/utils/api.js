import axios from "axios";

const BASE_URL = window.location.hostname === "localhost"
  ? "http://localhost:5000/api"
  : "https://habitflow-production-b60d.up.railway.app/api";

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 10000
});

api.interceptors.request.use(config => {
  const token = localStorage.getItem("ht_token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  response => response.data,
  error => {
    if (error.response?.status === 401) {
      localStorage.removeItem("ht_token");
      localStorage.removeItem("ht_user");
      window.location.href = "/login";
    }
    return Promise.reject(new Error(error.response?.data?.message || "Something went wrong"));
  }
);

export default api;
