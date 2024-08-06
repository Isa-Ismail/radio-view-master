import { AddEditSystemFormType } from "@/app/systems/components/add_edit_form";
import { AxiosClient } from "@/hooks/axios";
import addEditSystemData from "@/lib/system/addEditSystemData/addEditSystemData";
import deleteSystem from "@/lib/system/deleteSystem/deleteSystem";
import fetchSystemById from "@/lib/system/fetchSystemById/fetchSystemById";
import fetchSystemData from "@/lib/system/fetchSystemData/fetchSystemData";
import fetchSystemsForFilter from "@/lib/system/fetchSystemsForFilter/fetchSystemsForFilter";
import { HsaiUser } from "@/models/hsai_user";
import { HsaiSystem, SystemAdmin } from "@/models/system";
import { createApi, fakeBaseQuery } from "@reduxjs/toolkit/query/react";
import { SystemFilterProps } from "./systemSlice";

export const systemApi = createApi({
  reducerPath: "systemApi",
  baseQuery: fakeBaseQuery(),
  keepUnusedDataFor: 0,
  endpoints: (builder) => ({
    getSystemData: builder.query<
      {
        total: number;
        data: SystemAdmin[];
      },
      {
        token: string;
        offset: number;
        limit: number;
        filter: SystemFilterProps | undefined;
        axios: AxiosClient;
      }
    >({
      queryFn: async ({ token, offset, limit, filter, axios }) => {
        const { data, error } = await fetchSystemData({
          axios,
          filter,
          limit,
          offset,
          token,
        });
        if (data) {
          return { data };
        } else {
          return { error };
        }
      },
    }),
    getSystemById: builder.query<SystemAdmin, { token: string; id: string; axios: AxiosClient }>({
      async queryFn({ token, id, axios }) {
        const { error, data } = await fetchSystemById({
          axios,
          id,
          token,
        });

        if (data) {
          return { data };
        } else {
          return { error };
        }
      },
    }),

    addSystemData: builder.mutation<
      string,
      { systemData: AddEditSystemFormType; axios: AxiosClient }
    >({
      queryFn: async ({ systemData, axios }) => {
        const { data, error } = await addEditSystemData({ axios, systemData });
        if (data) {
          return { data };
        }
        return { error };
      },
    }),
    getSystemsForSite: builder.query<
      HsaiSystem[],
      {
        token: string;
        axios: AxiosClient;
      }
    >({
      queryFn: async ({ token, axios }) => {
        const { data, error } = await fetchSystemsForFilter({ token, axios });
        if (data) {
          return { data };
        } else {
          return { error };
        }
      },
    }),
    deleteSystem: builder.mutation<
      string[],
      {
        data: {
          hsaiGuid: string;
          hsaiSystem: HsaiSystem;
          hsaiUser: HsaiUser;
          user: string;
        }[];
        axios: AxiosClient;
      }
    >({
      queryFn: async ({ data, axios }) => {
        const { data: deleted, error } = await deleteSystem({
          data: data.map((item) => ({
            email: item.hsaiUser.email!,
            hsaiGuid: item.hsaiGuid!,
            profileId: item.hsaiUser.profileId!,
            systemGuid: item.hsaiSystem.systemGuid!,
          })),
          axios,
        });
        if (deleted) {
          return { data: deleted };
        } else {
          return { error };
        }
      },
    }),
  }),
});

export const {
  useGetSystemDataQuery,
  useAddSystemDataMutation,
  useGetSystemByIdQuery,
  useGetSystemsForSiteQuery,
  useDeleteSystemMutation,
} = systemApi;
