import axios from "axios";
import { store } from "@/redux/store";
import { setTokens, logout } from "@/redux/globalSlice";


const API_URL = process.env.NEXT_PUBLIC_API_URL!;
const IMAGE_URL = process.env.NEXT_PUBLIC_IMAGE_URL!;

if (!API_URL) throw new Error("NEXT_PUBLIC_API_URL is not defined");
if (!IMAGE_URL) throw new Error("NEXT_PUBLIC_IMAGE_URL is not defined");

// Create Axios instance
export const api = axios.create({
  baseURL: API_URL,
  headers: { "Content-Type": "application/json" },
});

// Request Interceptor
api.interceptors.request.use(
  (config) => {
    if (typeof window !== "undefined") {
      const accessToken = localStorage.getItem("access_token");
      if (accessToken) {
        config.headers.Authorization = `Bearer ${accessToken}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 403) {
     console.log("You are not authorized to access this");
    }

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        if (typeof window === "undefined") throw error;

        const refreshToken = localStorage.getItem("refresh_token");
        if (!refreshToken) throw new Error("No refresh token");

        const refreshResponse = await axios.post(
          `${API_URL}/auth/refresh-token`,
          { refreshToken }
        );

        const { accessToken, refreshToken: newRefreshToken } =
          refreshResponse.data;

        store.dispatch(
          setTokens({ accessToken, refreshToken: newRefreshToken })
        );

        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        return api(originalRequest);
      } catch (err) {
        store.dispatch(logout());

        if (typeof window !== "undefined") {
          window.location.replace("/");
        }

        return Promise.reject(err);
      }
    }

    return Promise.reject(error);
  }
);

// Utility
export const getImageUrl = (path: string) => `${IMAGE_URL}/${path}`;
