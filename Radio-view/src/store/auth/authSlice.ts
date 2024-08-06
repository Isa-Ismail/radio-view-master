"use client";
import { AppUser } from "@/models/user";
import { CookieNames, getValidAuthTokens, setAuthCookie } from "@/utils/cookie";
import { createSlice } from "@reduxjs/toolkit";

import { deleteCookie } from "cookies-next";
import { authApi } from "./authApi";
export type LoginResponse = {
  user?: AppUser | undefined;
  token?: string | undefined;
  refresh_token?: string | undefined;
  ip_address?: string | undefined;
  logging_out?: boolean;
};

const initialState: LoginResponse = {
  logging_out: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    initiateLogout: (state) => {
      return {
        ...state,
        logging_out: true,
      };
    },
    cancelLogout: (state) => {
      return {
        ...state,
        logging_out: false,
      };
    },
    logout: (
      state,
      action: {
        payload: {
          session_expired?: boolean;
        };
      }
    ) => {
      // const logging_out =
      //   action.payload.session_expired === undefined || action.payload.session_expired === false;
      if (!state.user) return {};
      deleteCookie("auth_token");
      deleteCookie("auth_refresh_token");

      return {};
    },
  },

  extraReducers: (builder) => {
    builder
      .addMatcher(authApi.endpoints.login.matchFulfilled, (_state, { payload }) => {
        setAuthCookie(payload.token!, CookieNames.AUTH_TOKEN);
        setAuthCookie(payload.refresh_token!, CookieNames.AUTH_REFRESH_TOKEN);

        setAuthCookie(payload.ip_address!, CookieNames.USER_NET_LOC);

        return payload;
      })
      .addMatcher(authApi.endpoints.getAuthData.matchFulfilled, (_state, { payload }) => {
        const { refreshToken, token } = getValidAuthTokens();
        return {
          ...payload,
          token,
          refresh_token: refreshToken,
        };
      });
  },
});

export default authSlice.reducer;
export const selectAuth = (state: { auth: LoginResponse }) => state.auth;
export const { logout, initiateLogout, cancelLogout } = authSlice.actions;
