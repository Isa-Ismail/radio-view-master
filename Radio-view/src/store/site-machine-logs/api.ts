import { AxiosClient } from "@/hooks/axios";
import fetchSiteMachineLogs from "@/lib/site-machine-logs/fetchSiteMachineLogs/fetchSiteMachineLogs";
import { createApi, fakeBaseQuery } from "@reduxjs/toolkit/query/react";
import { SiteMachineLog, SiteMachineLogFilter } from "./slice";

export const siteMachineLogsApi = createApi({
  reducerPath: "siteMachineLogsApi",
  baseQuery: fakeBaseQuery(),
  endpoints: (builder) => ({
    getSiteMachineLogs: builder.query<
      SiteMachineLog[],
      {
        token: string;
        axios: AxiosClient;
        filter?: SiteMachineLogFilter;
      }
    >({
      queryFn: async ({ token, axios, filter }) => {
        const { data, error } = await fetchSiteMachineLogs({
          token,
          axios,
          filter,
        });
        if (data) {
          return { data };
        } else {
          return { error };
        }
      },
    }),
  }),
});
export const { useGetSiteMachineLogsQuery } = siteMachineLogsApi;
