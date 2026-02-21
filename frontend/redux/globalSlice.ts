// src/redux/globalSlice.ts
import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

interface GlobalState {
  menus: any[];
  user: any | null;
  accessToken: string | null;
  refreshToken: string | null;
}

/* ---------------- SAFE HELPERS ---------------- */

const safeParse = (value: string | null) => {
  try {
    return value ? JSON.parse(value) : null;
  } catch {
    return null;
  }
};

const getStorageItem = (key: string) => {
  if (typeof window !== "undefined") {
    return localStorage.getItem(key);
  }
  return null;
};

/* ---------------- INITIAL STATE ---------------- */

const initialState: GlobalState = {
  menus: [],
  user: safeParse(getStorageItem("user")),
  accessToken: getStorageItem("access_token"),
  refreshToken: getStorageItem("refresh_token"),
};

/* ---------------- SLICE ---------------- */

const globalSlice = createSlice({
  name: "global",
  initialState,
  reducers: {
    setMenus(state, action: PayloadAction<any[]>) {
      state.menus = action.payload;
    },

    setUser(state, action: PayloadAction<any | null>) {
      state.user = action.payload;

      if (typeof window !== "undefined") {
        if (action.payload) {
          localStorage.setItem("user", JSON.stringify(action.payload));
        } else {
          localStorage.removeItem("user");
        }
      }
    },

    setTokens(
      state,
      action: PayloadAction<{ accessToken: string; refreshToken: string }>
    ) {
      const { accessToken, refreshToken } = action.payload;

      state.accessToken = accessToken;
      state.refreshToken = refreshToken;

      if (typeof window !== "undefined") {
        localStorage.setItem("access_token", accessToken);
        localStorage.setItem("refresh_token", refreshToken);
      }
    },

    clearTokens(state) {
      state.accessToken = null;
      state.refreshToken = null;

      if (typeof window !== "undefined") {
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");
      }
    },

    logout(state) {
      state.user = null;
      state.menus = [];
      state.accessToken = null;
      state.refreshToken = null;

      if (typeof window !== "undefined") {
        localStorage.removeItem("user");
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");
      }
    },
  },
});

export const { setMenus, setUser, setTokens, clearTokens, logout } =
  globalSlice.actions;

export default globalSlice.reducer;