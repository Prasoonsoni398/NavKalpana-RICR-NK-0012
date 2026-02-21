// src/redux/selectors.ts

import { RootState } from "./store";

export const selectAccessToken = (state: RootState) =>
  state.global.accessToken;

export const selectIsLoggedIn = (state: RootState) =>
  !!state.global.accessToken;