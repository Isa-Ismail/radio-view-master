import { AddEditAppVersionFormType } from "@/app/app-version/components/form";
import { AxiosClient, AxiosResponse } from "@/hooks/axios";
import AppVersion from "@/models/app-versions";
import getAccessToken from "@/utils/get_acess_token";
import { createApi, fakeBaseQuery } from "@reduxjs/toolkit/query/react";
import { AppVersionFilter } from "./appVersionSlice";

export const appVersionApi = createApi({
  reducerPath: "appVersionApi",
  baseQuery: fakeBaseQuery(),
  keepUnusedDataFor: 0,
  endpoints: (builder) => ({
    getVersions: builder.query<
      {
        data: AppVersion[];
        total: number;
      },
      {
        filter: AppVersionFilter | undefined;
        token: string;
        offset: number;
        limit: number;
        axios: AxiosClient;
      }
    >({
      queryFn: async ({ filter, token, offset, limit, axios }) => {
        let url = `/data/app-version?offset=${offset}&limit=${limit}`;
        if (filter?.version) {
          url += `&version=${filter.version}`;
        }
        if (filter?.dateRange) {
          url += `&start_date=${filter.dateRange[0].toISOString()}&end_date=${filter.dateRange[1].toISOString()}`;
        }
        if (filter?.description) {
          url += `&description=${filter.description}`;
        }

        const res = await axios.get({
          path: url,

          headers: AxiosClient.getAuthHeaders({
            token: token,
          }),
        });
        if (!res.ok) {
          const data = res.data;
          console.log("Error", data);
          return {
            error: data,
          };
        }
        let { data, count } = res.data;
        const versions = (data as any[]).map((version) => {
          return AppVersion.fromJSON(version);
        });

        return {
          data: {
            data: versions,
            total: count,
          },
        };
      },
    }),
    addUpdateVersion: builder.mutation<
      string,
      {
        postData: AddEditAppVersionFormType;
        axios: AxiosClient;
      }
    >({
      queryFn: async ({ postData, axios }) => {
        const { data: tokenData, error: tokenError } = await getAccessToken({});
        let token: string = "";
        if (tokenData) {
          token = tokenData.token;
        } else {
          axios.logout();
          return {
            error: {
              status: 401,
              statusText: "Unauthorized",
              data: tokenError,
            },
          };
        }

        let url = `/data/app-version`;
        let res: AxiosResponse;
        const json = {
          id: postData.id,
          appstore_review: postData.appstore_review ? "yes" : "no",
          description: postData.description,
          force_update: postData.force_update ? "yes" : "no",
          playstore_review: postData.playstore_review ? "yes" : "no",
          version: postData.version,
        };
        if (!json.id) {
          res = await axios.post({
            path: url,
            data: json,
            headers: AxiosClient.getAuthHeaders({
              token: token,
            }),
          });
        } else {
          res = await axios.put({
            path: url,
            data: json,
            headers: AxiosClient.getAuthHeaders({
              token: token,
            }),
          });
        }
        if (res.ok === false) {
          const json = await res.data;
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
        let { id } = res.data;

        return {
          data: id,
        };
      },
    }),
    getSingleVersion: builder.query<
      AppVersion,
      {
        token: string;
        version: string;
        axios: AxiosClient;
      }
    >({
      queryFn: async ({ token, version, axios }) => {
        let url = `/data/app-version?version=${version}`;

        const res = await axios.get({
          path: url,

          headers: AxiosClient.getAuthHeaders({
            token: token,
          }),
        });
        if (!res.ok) {
          const data = res.data;
          console.log("Error", data);
          return {
            error: data,
          };
        }
        let { data } = res.data;

        const appVersion = AppVersion.fromJSON(data[0]);

        return {
          data: appVersion,
        };
      },
    }),
  }),
});

export const { useGetVersionsQuery, useAddUpdateVersionMutation, useGetSingleVersionQuery } =
  appVersionApi;
