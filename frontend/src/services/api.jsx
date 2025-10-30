import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:8000/api/v1", // backend URL
  withCredentials: true, // so cookies (JWT) are sent automatically
});

// Interceptor to add Authorization header if token exists
API.interceptors.request.use((req) => {
  const token = localStorage.getItem("accessToken");
  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }
  return req;
});
export const requestPasswordReset = (email) => {
  return API.post("/users/forgot-password", { email });
};


export default API;
