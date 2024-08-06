import axios, { AxiosError } from "axios";
import { CookieNames, getValidAuthTokens, setAuthCookie } from "./cookie";

export default async function getAccessToken({ forceRotate }: { forceRotate?: boolean }): Promise<{
  data?: { token: string; refreshToken: string };
  error?: string;
}> {
  const { token, refreshToken } = getValidAuthTokens();

  // const parsed = parseJwt({ token: token! });
  // const now = Date.now() / 1000;
  // const expiresAt = parsed?.exp;
  // const expired = expiresAt && expiresAt < now;

  if (forceRotate === true) {
    try {
      const res = await axios.get(`/api/rotate-refresh-token`, {
        headers: {
          Authorization: `Bearer ${refreshToken}`,
        },
      });
      const data = res.data;

      const { token: newToken, refreshToken: newRefreshToken } = data;

      setAuthCookie(newToken, CookieNames.AUTH_TOKEN);
      setAuthCookie(newRefreshToken, CookieNames.AUTH_REFRESH_TOKEN);

      return {
        data: {
          token: newToken,
          refreshToken: newRefreshToken,
        },
      };
    } catch (error) {
      console.log("Error", error);
      if (error instanceof AxiosError) {
        const data = error.response?.data;
        const { Status: status, Message: message } = data;
        console.log("Rotate Refresh Token Error", data);
        if (message?.includes("refresh token")) {
          // store.dispatch(logout({ isSessionExpired: true }));
          // throw new Error("Refresh token expired please login again");
        } else {
          // throw new Error(data.detail);
          console.log("Error", data);
        }
      }
      return {
        error: "Refresh token expired please login again",
      };
      // throw new Error("Something went wrong");
    }
  } else {
    return {
      data: {
        token: token!,
        refreshToken: refreshToken!,
      },
    };
  }
}
