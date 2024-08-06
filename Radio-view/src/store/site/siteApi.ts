import { AddEditSiteFormType } from "@/app/sites/components/form";
import { AxiosClient } from "@/hooks/axios";
import addEditSiteData from "@/lib/site/addEditSiteData/addEditSiteData";
import deleteSite from "@/lib/site/deleteSite/deleteSite";
import fetchSiteById from "@/lib/site/fetchSiteById/fetchSiteById";
import fetchSiteData from "@/lib/site/fetchSiteData/fetchSiteData";
import fetchSitesBySystem from "@/lib/site/fetchSitesBySystem/fetchSitesBySystem";
import { Site, SiteAdmin } from "@/models/site";
import { createApi, fakeBaseQuery } from "@reduxjs/toolkit/query/react";
import { SitesFilterProps } from "./siteSlice";

export const siteApi = createApi({
  reducerPath: "siteApi",
  baseQuery: fakeBaseQuery(),
  keepUnusedDataFor: 0,
  endpoints: (builder) => ({
    getSiteData: builder.query<
      {
        total: number;
        data: SiteAdmin[];
      },
      {
        token: string;
        offset: number;
        limit: number;
        systemId?: string | undefined;
        filter?: SitesFilterProps | undefined;
        axios: AxiosClient;
      }
    >({
      queryFn: async ({ token, offset, limit, systemId, filter, axios }) => {
        const { data, error } = await fetchSiteData({
          token,
          offset,
          limit,
          systemId,
          filter,
          axios,
        });
        if (data) {
          return { data };
        } else {
          return { error: error };
        }
      },
    }),
    addSiteData: builder.mutation<string, { siteData: AddEditSiteFormType; axios: AxiosClient }>({
      queryFn: async ({ siteData, axios }) => {
        const { data, error } = await addEditSiteData({ siteData, axios });
        if (data) {
          return { data: data };
        }
        return { error: error };
      },
    }),
    getAllSites: builder.query<
      Site[],
      {
        token: string;
        systemIds?: string[] | undefined;
        axios: AxiosClient;
      }
    >({
      queryFn: async ({ token, systemIds, axios }) => {
        const { data, error } = await fetchSitesBySystem({ axios, token, systemIds });
        if (data) {
          return { data };
        } else {
          return { error: error };
        }
      },
    }),
    getSiteById: builder.query<
      SiteAdmin,
      {
        token: string;
        siteId: string;
        axios: AxiosClient;
      }
    >({
      queryFn: async ({ token, siteId, axios }) => {
        const { data, error } = await fetchSiteById({ token, siteId, axios });
        if (data) {
          return { data };
        } else {
          return { error: error };
        }
      },
    }),
    deleteSite: builder.mutation<
      string[],
      {
        data: {
          hsaiGuid: string;
          siteId: string;
          profile_id: string;
          email: string;
          systems: string[];
        }[];
        axios: AxiosClient;
      }
    >({
      queryFn: async ({ data, axios }) => {
        const { data: responseData, error } = await deleteSite({ data, axios });
        if (responseData) {
          return { data: responseData };
        } else {
          return { error: error };
        }
      },
    }),
  }),
});

export const {
  useGetSiteDataQuery,
  useAddSiteDataMutation,
  useGetAllSitesQuery,
  useGetSiteByIdQuery,
  useDeleteSiteMutation,
} = siteApi;
