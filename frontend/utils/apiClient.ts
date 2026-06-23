import axios from "axios";

export const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL || "https://pos-backend-q4r0.onrender.com",
  withCredentials: true,
});
