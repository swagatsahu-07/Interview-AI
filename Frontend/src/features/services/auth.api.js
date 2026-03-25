import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
});

// ✅ Har request mein token automatically add hoga
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export async function register({ userName, email, password }) {
  const response = await api.post("/api/auth/register", {
    userName,
    email,
    password,
  });
  localStorage.setItem("token", response.data.token); // ✅ token save karo
  return response.data;
}

export async function login({ email, password }) {
  const response = await api.post("/api/auth/login", {
    email,
    password,
  });
  localStorage.setItem("token", response.data.token); // ✅ token save karo
  return response.data;
}

export async function logout() {
  localStorage.removeItem("token"); // ✅ token remove karo
  const response = await api.get("/api/auth/logout");
  return response.data;
}

export async function getMe() {
  const response = await api.get("/api/auth/get-me");
  return response.data;
}