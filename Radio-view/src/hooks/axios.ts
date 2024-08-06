"use client";
import axios, { AxiosError, AxiosHeaders, AxiosResponse } from "axios";

import { CookieNames, getAuthCookie } from "@/utils/cookie";
import { StoreReturnType } from "@/utils/typedef";
import { useRouter } from "next/navigation";
import { logout } from "../store/auth/authSlice";
import { useAppDispatch } from "../store/hooks";
import getAccessToken from "../utils/get_acess_token";

class HttpResponse {
  status: boolean;
  message: string;
  data: any;
  rawResponse?: AxiosResponse<any>;
  ok: boolean;

  constructor({
    status,
    message,
    data,

    rawResponse,
    isOk,
  }: {
    status: boolean;
    message: string;
    data: any;
    rawResponse?: AxiosResponse<any>;
    isOk: boolean;
  }) {
    this.rawResponse = rawResponse;
    this.status = status;
    this.message = message;
    this.data = data;
    this.ok = isOk;
  }

  static fromAxiosResponse(rawResponse: AxiosResponse<any>): HttpResponse {
    const status = rawResponse.data["Status"];
    const message = rawResponse.data["Message"];
    const data = rawResponse.data;

    let isOk = rawResponse.status >= 200 && rawResponse.status < 300;
    if (status !== undefined && isOk) {
      isOk = status;
    }
    return new HttpResponse({
      status,
      message,
      data,
      rawResponse,
      isOk,
    });
  }
}

class HttpError extends Error {
  status: number;
  response: AxiosResponse<any> | undefined;
  constructor(message: string, status: number, response: AxiosResponse<any, any> | undefined) {
    super(message);
    this.status = status;
    this.response = response;
  }
}

class AxiosClient {
  defaultUrl: string;
  defaultTimeout: number;
  logout: () => void;

  constructor({
    defaultUrl,
    defaultTimeout = 10000,
    logout,
  }: {
    defaultUrl: string;
    defaultTimeout?: number;
    logout: () => void;
  }) {
    this.defaultUrl = defaultUrl;
    this.defaultTimeout = defaultTimeout;

    this.logout = logout;
  }

  static getAuthHeaders({ token }: { token: string }): AxiosHeaders {
    const ip_address = getAuthCookie(CookieNames.USER_NET_LOC);
    if (ip_address) {
      return new AxiosHeaders({
        Authorization: `Bearer ${token}`,

        "X-Client-IP": ip_address!,
      });
    } else {
      return new AxiosHeaders({
        Authorization: `Bearer ${token}`,
      });
    }
  }

  async processResponse({
    request,
    token,
  }: {
    request: (token?: string) => Promise<AxiosResponse<any, any>>;
    token?: string;
  }): Promise<HttpResponse> {
    try {
      const response = await request(token);
      const data = await response.data;
      const status = data.Status ?? data.status ?? true;
      if (!status) {
        const message = data.Message ?? data.message ?? "An unknown error occurred";
        throw new HttpError(message, 400, response);
      }
      return HttpResponse.fromAxiosResponse(response);
    } catch (error) {
      if (error instanceof AxiosError) {
        const status = error.response?.status ?? 500;
        console.log("Axios Error", status, error.code);

        if (status >= 500 || status === 405) {
          return new HttpResponse({
            isOk: false,
            rawResponse: error.response,
            message: "The server is currently unavailable, please try again later",
            status: false,
            data: undefined,
          });
        }

        const json = error.response?.data;
        console.log("Axios Error 1", json);
        let message: string;
        if (json?.detail) {
          message = error.response?.data?.detail;
          console.log("Axios Error 2", error.response?.data?.detail);
        } else {
          console.log("Axios Error 3", json);

          if (json?.error) {
            console.log("Axios Error Detail", json.error?.detail instanceof Array);
            if (typeof json.error === "string") {
              message = json.error;
            } else if (json.error instanceof Array || json.error?.detail instanceof Array) {
              const array = json.error instanceof Array ? json.error : json.error.detail;
              const msg = array[0].message;
              console.log("Axios Error Msg", msg);
              if (
                array[0].message?.includes("JWTExpired") ||
                array[0].message?.includes("Authorization")
              ) {
                message = "Session expired, please login again";
              } else if (array[0].type !== undefined && array[0].loc !== undefined) {
                message = "validation-error";
              } else {
                message = "An unknown error occurred";
              }
            } else {
              console.log("Axios Error 4", json.error.detail);
              if (json.error.detail) {
                const detail = json.error.detail;
                if (typeof detail === "string") {
                  message = detail;
                } else if ("message" in detail) {
                  message = detail.message;
                } else {
                  message = "An unknown error occurred";
                }
              } else if (json.error.message) {
                message = json.error.message;
              } else {
                const error = json?.error[0];
                message = error?.message ?? error?.extensions?.code ?? error?.extensions?.path;
              }
            }
          } else {
            message = json?.error ?? json?.Error ?? json?.message ?? json?.Message ?? error.message;
          }
        }

        console.log("Axios Error 5", message);
        let sessionExpired = false;
        if (message?.toString()?.toLowerCase().includes("expired")) {
          console.log("token expired, trying to refresh token");

          const { data, error } = await getAccessToken({ forceRotate: true });
          console.log("Successfully refreshed token");
          if (data) {
            const { token } = data;
            return this.processResponse({
              request,
              token,
            });
          } else if (error) {
            message = "Session expired, please login again";
            console.log("Refresh token expired error");
            sessionExpired = true;
            this.logout();
          }
        }
        console.log("Error", error);
        return new HttpResponse({
          isOk: false,
          rawResponse: error.response,
          message: sessionExpired ? "Session expired, please login again" : message,
          status: false,
          data: undefined,
        });
      } else if (error instanceof HttpError) {
        console.log("Error", error);
        return HttpResponse.fromAxiosResponse(error.response!);
      }
      console.log("Error", error);
      return new HttpResponse({
        status: false,
        message: "An unknown error occurred",
        data: undefined,
        rawResponse: undefined,
        isOk: false,
      });
    }
  }

  async get({ path = "", headers }: { path?: string; headers?: AxiosHeaders }) {
    let url = this.defaultUrl;
    if (path) {
      url = `${this.defaultUrl}${path}`;
    }
    return this.processResponse({
      request: (token) => {
        let _headers: any = headers;
        if (token) {
          _headers = {
            ...headers,
            Authorization: `Bearer ${token}`,
          };
        }

        return axios({
          url,
          method: "GET",
          headers: _headers,
          timeout: this.defaultTimeout,
        });
      },
    });
  }

  async post({ path, data, headers }: { path?: string; data?: any; headers?: AxiosHeaders }) {
    let url = this.defaultUrl;
    if (path) {
      url = `${this.defaultUrl}${path}`;
    }

    return this.processResponse({
      request: (token) => {
        let _headers: any = headers;
        if (token) {
          _headers = {
            ...headers,
            Authorization: `Bearer ${token}`,
          };
        }
        return axios({
          url,
          method: "POST",
          data,
          headers: _headers,
          timeout: this.defaultTimeout,
        });
      },
    });
  }

  async put({ path = "", data, headers }: { path?: string; data?: any; headers: AxiosHeaders }) {
    let url = this.defaultUrl;
    if (path) {
      url = `${this.defaultUrl}${path}`;
    }
    return this.processResponse({
      request: (token) => {
        let _headers: any = headers;
        if (token) {
          _headers = {
            ...headers,
            Authorization: `Bearer ${token}`,
          };
        }

        return axios({
          url,
          method: "PUT",
          data,
          headers: _headers,
          timeout: this.defaultTimeout,
        });
      },
    });
  }

  async delete({ path = "", headers, data }: { path: string; headers: AxiosHeaders; data: any }) {
    let url = this.defaultUrl;
    if (path) {
      url = `${this.defaultUrl}${path}`;
    }
    return this.processResponse({
      request: (token) => {
        let _headers: any = headers;
        if (token) {
          _headers = {
            ...headers,
            Authorization: `Bearer ${token}`,
          };
        }
        return axios({
          url,
          method: "DELETE",
          data,
          headers: _headers,
          timeout: this.defaultTimeout,
        });
      },
    });
  }

  static async parseResponseForStore<T>({
    res,
    parseData,
  }: {
    res: HttpResponse;
    parseData: (data: any) => Promise<T>;
  }): Promise<StoreReturnType<T>> {
    if (res.ok) {
      return {
        data: await parseData(res.data),
      };
    } else {
      const json = res.data;
      console.log("error", res.message, json);
      if (json || res.message) {
        let error = res.message ?? json.error;
        if (typeof json === "string") {
          error = json;
        }
        console.log("error", error);

        return {
          error: {
            status: 400,
            statusText: "Bad Request",
            data: error,
          },
        };
      }
      return {
        error: {
          status: 500,
          statusText: "Internal Server Error",
          data: "Something went wrong",
        },
      };
    }
  }
}

// const clientAxiosClient = new AxiosClient({
//   defaultUrl: "/api",
//   isClientSide: true,
// });

const useClientAxiosClient = () => {
  const dispatch = useAppDispatch();
  const router = useRouter();

  return new AxiosClient({
    defaultUrl: "/api",
    logout() {
      dispatch(
        logout({
          session_expired: true,
        })
      );
      const path = window.location.pathname;
      if (path !== "/signin") {
        router.replace("/signin?session_expired=true");
      }
    },
  });
};

export { AxiosClient, HttpResponse as AxiosResponse, HttpError, useClientAxiosClient };
