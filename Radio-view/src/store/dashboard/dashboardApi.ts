import { AxiosClient } from "@/hooks/axios";
import { fetchDashboardData } from "@/lib/dashboard/fetchDashboardData/fetchDashboardData";
import { fetchDashboardGraph } from "@/lib/dashboard/fetchDashboardGraph/fetchDashboardGraph";
import { createApi, fakeBaseQuery } from "@reduxjs/toolkit/query/react";
import { DashboardData, DashboardGraph } from "./dashboardSlice";

export const dashboardApi = createApi({
  reducerPath: "dashboardApi",
  baseQuery: fakeBaseQuery(),
  endpoints: (builder) => ({
    getData: builder.query<
      DashboardData,
      {
        token: string;
        axios: AxiosClient;
      }
    >({
      queryFn: async ({ token, axios }) => {
        const { data, error } = await fetchDashboardData({ token, axios });
        if (data) {
          return { data: data };
        }
        return { error: error };
      },
    }),
    getGraph: builder.query<
      DashboardGraph[],
      {
        token: string;
        year: number;
        id?: string;
        axios: AxiosClient;
      }
    >({
      queryFn: async ({ token, year, id, axios }) => {
        const { data, error } = await fetchDashboardGraph({ token, year, id, axios });
        if (data) {
          return { data };
        }
        return { error };
      },
    }),
  }),
});

export const { useGetDataQuery, useGetGraphQuery } = dashboardApi;
