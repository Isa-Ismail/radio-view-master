import { AxiosClient } from "@/hooks/axios";
import { AppUser } from "@/models/user";
import { clearAuthCookies } from "@/utils/cookie";
import { createApi, fakeBaseQuery } from "@reduxjs/toolkit/query/react";
import { LoginResponse } from "./authSlice";

export const authApi = createApi({
  reducerPath: "authApi",
  baseQuery: fakeBaseQuery(),
  endpoints: (builder) => ({
    login: builder.mutation<
      LoginResponse,
      { userName: string; password: string; axios: AxiosClient }
    >({
      queryFn: async ({ userName, password, axios }) => {
        const res = await axios.post({
          path: "/login",

          data: JSON.stringify({ username: userName, password }),
        });
        let data = res.data;
        if (res.ok) {
          const { refresh_token, token, User_Info, ip_address } = data;

          return {
            data: {
              refresh_token: refresh_token,
              token: token,
              ip_address,
              user: AppUser.fromJson(User_Info),
            },
          };
        }
        let error = res.data ?? res.message;
        if (error === "validation-error") {
          error = "Invalid credentials";
        }
        return {
          error: {
            data: error,
          },
        };
      },
    }),
    getAuthData: builder.query<
      LoginResponse,
      { token: string; refreshToken: string; axios: AxiosClient }
    >({
      queryFn: async ({ token, refreshToken, axios }) => {
        if (token === "" || refreshToken === "") {
          clearAuthCookies();
          return {
            error: {
              data: "Token Expired",
            },
          };
        }
        const headers = AxiosClient.getAuthHeaders({
          token: token,
        });
        const res = await axios.get({
          path: "/getdetails",
          headers: headers,
        });

        let data = res.data;
        if (res.ok) {
          const { refreshToken, token, User_Info } = data;

          return {
            data: {
              refresh_token: refreshToken,
              token: token,
              user: AppUser.fromJson(User_Info),
            },
          };
        }
        clearAuthCookies();

        return {
          error: {
            data,
          },
        };
      },
    }),
    forgotPassword: builder.mutation<any, { email: string; axios: AxiosClient }>({
      queryFn: async ({ email, axios }) => {
        const res = await axios.post({
          path: "/forgot-password",
          data: JSON.stringify({ email: email }),
        });
        if (res.ok) {
          let data = res.data;
          return {
            data: data,
          };
        }
        const data = res.data ?? res.message;
        console.log("Res Error", data);
        if (data?.includes("User not found")) {
          return {
            error: {
              data: "This email is not registered as an user",
            },
          };
        }

        return {
          error: {
            data,
          },
        };
      },
    }),
    verifyForgotPasswordOtp: builder.mutation<
      any,
      { email: string; otp: string; axios: AxiosClient }
    >({
      queryFn: async ({ email, otp, axios }) => {
        const res = await axios.post({
          path: "/forgot-password/verify-otp",

          data: JSON.stringify({ email: email, otp: otp }),
        });
        if (res.ok) {
          let data = res.data;
          return {
            data: data,
          };
        }
        const data = res.data ?? res.message;
        console.log("Res Error", data);
        if (data === "User details not found" || data === "Incorrect OTP") {
          return {
            error: {
              data: "You have provided a wrong OTP",
            },
          };
        }

        return {
          error: {
            data,
          },
        };
      },
    }),
    createNewPassword: builder.mutation<
      any,
      { email: string; password: string; axios: AxiosClient }
    >({
      queryFn: async ({ email, password, axios }) => {
        const res = await axios.post({
          path: "/forgot-password/create-password",

          data: JSON.stringify({ email: email, password: password }),
        });
        let data = res.data;
        if (res.ok) {
          return {
            data: data,
          };
        }
        const error = res.data ?? res.message;
        console.log("Error", error);
        if (error.includes("User not found")) {
          return {
            error: {
              data: "This email is not registered as an user",
            },
          };
        }

        return {
          error: {
            data: error,
          },
        };
      },
    }),
    changePassword: builder.mutation<
      any,
      {
        oldPassword: string;
        newPassword: string;
        email: string;
        token: string;
        axios: AxiosClient;
      }
    >({
      queryFn: async ({ oldPassword, newPassword, email, token, axios }) => {
        const res = await axios.post({
          path: "/change-password",

          data: JSON.stringify({
            oldPassword: oldPassword,
            newPassword: newPassword,
            email: email,
          }),
          headers: AxiosClient.getAuthHeaders({
            token: token,
          }),
        });
        let data = res.data;
        if (res.ok) {
          return {
            data: data,
          };
        }
        let error = data ?? res.message;
        if (error == "current password not match" || error === "validation-error") {
          error = "Your current password is incorrect";
        }

        if (data?.error.includes("User not found")) {
          return {
            error: {
              data: "This email is not registered as an user",
            },
          };
        }

        return {
          error: {
            data: error,
          },
        };
      },
    }),
    checkPasswordUpdate: builder.query<boolean, { email: string; axios: AxiosClient }>({
      queryFn: async ({ email, axios }) => {
        const res = await axios.post({
          path: "/check-password-update",

          data: JSON.stringify({ email: email }),
        });
        let data = res.data;
        if (res.ok) {
          return {
            data: data["password-update"],
          };
        }
        console.log("Error", data);
        if (data.error.includes("User not found")) {
          return {
            error: {
              data: "This email is not registered as an user",
            },
          };
        }

        return {
          error: {
            data,
          },
        };
      },
    }),
  }),
});

export const {
  useLoginMutation,
  useGetAuthDataQuery,
  useForgotPasswordMutation,
  useVerifyForgotPasswordOtpMutation,
  useCreateNewPasswordMutation,
  useChangePasswordMutation,
  useCheckPasswordUpdateQuery,
} = authApi;
