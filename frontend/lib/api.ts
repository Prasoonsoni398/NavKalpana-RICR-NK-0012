import axios from "axios";
import { store } from "@/redux/store";
import { setTokens, logout } from "@/redux/globalSlice";

const API_URL = process.env.NEXT_PUBLIC_API_URL!;
const IMAGE_URL = process.env.NEXT_PUBLIC_IMAGE_URL!;

if (!API_URL) throw new Error("NEXT_PUBLIC_API_URL is not defined");
if (!IMAGE_URL) throw new Error("NEXT_PUBLIC_IMAGE_URL is not defined");

// ===============================
// 🔹 Helper: Get Cookie
// ===============================
const getCookie = (name: string): string | null => {
  if (typeof document === "undefined") return null;

  const match = document.cookie.match(
    new RegExp("(^| )" + name + "=([^;]+)")
  );

  return match ? match[2] : null;
};

// ===============================
// 🔹 Axios Instance
// ===============================
export const api = axios.create({
  baseURL: API_URL,
  headers: { "Content-Type": "application/json" },
});

// ===============================
// 🔹 Request Interceptor
// ===============================
api.interceptors.request.use(
  (config) => {
    const accessToken = getCookie("accessToken");

    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// ===============================
// 🔹 Response Interceptor
// ===============================
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 403) {
      console.log("You are not authorized to access this");
    }

    // 🔥 Handle 401 (Token expired)
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = getCookie("refreshToken");
        if (!refreshToken) throw new Error("No refresh token");

        const refreshResponse = await axios.post(
          `${API_URL}/auth/refresh-token`,
          { refreshToken }
        );

        const { accessToken, refreshToken: newRefreshToken } =
          refreshResponse.data;

        // ✅ Update Redux
        store.dispatch(
          setTokens({
            accessToken,
            refreshToken: newRefreshToken,
          })
        );

        // ✅ Update Cookies
        document.cookie = `accessToken=${accessToken}; path=/; max-age=86400; SameSite=Lax`;
        document.cookie = `refreshToken=${newRefreshToken}; path=/; max-age=604800; SameSite=Lax`;

        // Retry original request
        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        return api(originalRequest);
      } catch (err) {
        // ❌ Logout if refresh fails
        store.dispatch(logout());

        document.cookie = "accessToken=; path=/; max-age=0;";
        document.cookie = "refreshToken=; path=/; max-age=0;";

        if (typeof window !== "undefined") {
          window.location.replace("/auth/student-login");
        }

        return Promise.reject(err);
      }
    }

    return Promise.reject(error);
  }
);

// ===============================
// 🔹 Utility
// ===============================
export const getImageUrl = (path: string) => `${IMAGE_URL}/${path}`;