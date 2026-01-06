import axios from "axios";
import { auth } from "../config/firebase";

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
});

/* ================= AUTH INTERCEPTOR ================= */
api.interceptors.request.use(
  async (config) => {
    const user = auth.currentUser;

    if (user) {
      const token = await user.getIdToken();
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

export default api;
