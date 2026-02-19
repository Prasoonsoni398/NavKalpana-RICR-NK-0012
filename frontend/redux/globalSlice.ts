// src/redux/globalSlice.ts
import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

interface GlobalState {
  menus: any[];
  user: any | null;
  accessToken: string | null;
  refreshToken: string | null;
}

const initialState: GlobalState = {
  menus: [],
  user: JSON.parse(localStorage.getItem("user") || "null"),
  accessToken: localStorage.getItem("access_token"),
  refreshToken: localStorage.getItem("refresh_token"),
};

const globalSlice = createSlice({
  name: "global",
  initialState,
  reducers: {
    setMenus(state, action: PayloadAction<any[]>) {
      state.menus = action.payload;
    },

    setUser(state, action: PayloadAction<any | null>) {
      state.user = action.payload;
      if (action.payload) {
        localStorage.setItem("user", JSON.stringify(action.payload));
      } else {
        localStorage.removeItem("user");
      }
    },

    setTokens(
      state,
      action: PayloadAction<{ accessToken: string; refreshToken: string }>
    ) {
      const { accessToken, refreshToken } = action.payload;
      state.accessToken = accessToken;
      state.refreshToken = refreshToken;
      localStorage.setItem("access_token", accessToken);
      localStorage.setItem("refresh_token", refreshToken);
    },

    clearTokens(state) {
      state.accessToken = null;
      state.refreshToken = null;
      localStorage.removeItem("access_token");
      localStorage.removeItem("refresh_token");
    },

    logout(state) {
      state.user = null;
      state.menus = [];
      state.accessToken = null;
      state.refreshToken = null;

      localStorage.removeItem("user");
      localStorage.removeItem("access_token");
      localStorage.removeItem("refresh_token");
    },
  },
});

export const { setMenus, setUser, setTokens, clearTokens, logout } =
  globalSlice.actions;
export default globalSlice.reducer;
