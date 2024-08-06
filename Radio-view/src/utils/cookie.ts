import { deleteCookie, getCookie, setCookie } from "cookies-next";

export enum CookieNames {
  AUTH_TOKEN = "auth_token",
  AUTH_REFRESH_TOKEN = "auth_refresh_token",

  USER_NET_LOC = "usr_net_loc",
}

export const getAuthCookie = (name: CookieNames) => {
  const cookie = getCookie(name, {
    sameSite: "strict",
    secure: true,
  });

  if (!cookie) return undefined;

  return Buffer.from(cookie, "base64").toString("ascii");
};

export function getValidAuthTokens(): {
  token?: string;
  refreshToken?: string;
} {
  const token = getCookie(CookieNames.AUTH_TOKEN);
  const refreshToken = getCookie(CookieNames.AUTH_REFRESH_TOKEN);

  return {
    token: token,
    refreshToken,
  };
}

export const setAuthCookie = (token: string, name: CookieNames) => {
  if (!token) return;
  const toBase64 = token

  setCookie(name, toBase64, {
    maxAge: 30 * 24 * 60 * 60,
    path: "/",
    // more security options here
    sameSite: "strict",
    secure: true,
  });
};

export function deleteAuthCookie(name: CookieNames) {
  deleteCookie(name);
}

export function clearAuthCookies() {
  deleteAuthCookie(CookieNames.AUTH_TOKEN);
  deleteAuthCookie(CookieNames.AUTH_REFRESH_TOKEN);
}
