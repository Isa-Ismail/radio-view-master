import { AddEditClinicianFormType } from "@/app/clinicians/components/form";

import { AxiosClient } from "@/hooks/axios";
import addEditClinician from "@/lib/clinician/addEditClinician/addEditClinician";
import deleteClinician from "@/lib/clinician/deleteClinician/deleteClinician";
import fetchClinicianById from "@/lib/clinician/fetchClinicianById/fetchClinicianById";
import fetchClinician from "@/lib/clinician/fetchClinicians/fetchClinicians";
import { Clinician } from "@/models/clinician";
import { createApi, fakeBaseQuery } from "@reduxjs/toolkit/query/react";
import { ClinicianFilterProps } from "./clinicianSlice";

export const clinicianApi = createApi({
  reducerPath: "clinicianApi",
  baseQuery: fakeBaseQuery(),
  keepUnusedDataFor: 0,
  endpoints: (builder) => ({
    getData: builder.query<
      { total: number; data: Clinician[] },
      {
        token: string;
        offset: number;
        limit: number;
        systemId?: string | undefined;
        siteId?: string | undefined;
        filter: ClinicianFilterProps | undefined;
        axios: AxiosClient;
      }
    >({
      queryFn: async ({ token, offset, limit, systemId, siteId, filter, axios }) => {
        const { data, error } = await fetchClinician({
          token,
          offset,
          limit,
          systemId,
          siteId,
          filter,
          axios,
        });
        if (data) {
          return { data };
        }
        return { error };
      },
    }),
    clinicianById: builder.query<Clinician, { id: string; token: string; axios: AxiosClient }>({
      queryFn: async ({ id, token, axios }) => {
        const { data, error } = await fetchClinicianById({ id, token, axios });
        if (data) {
          return { data };
        } else {
          return { error };
        }
      },
    }),

    addClinicianData: builder.mutation<
      string,
      { clinicianData: AddEditClinicianFormType; axios: AxiosClient }
    >({
      queryFn: async ({ clinicianData, axios }) => {
        const { data, error } = await addEditClinician({ clinicianData, axios });

        if (data) {
          return { data };
        } else {
          return { error };
        }
      },
    }),
    deleteClinician: builder.mutation<
      string[],
      {
        data: {
          hsai_guid: string;
          profile_id: string;
          email: string;
        }[];
        axios: AxiosClient;
      }
    >({
      queryFn: async ({ data, axios }) => {
        const { data: res, error } = await deleteClinician({ data, axios });

        if (res) {
          return { data: res };
        } else {
          return { error };
        }
      },
    }),
  }),
});

export const {
  useGetDataQuery,
  useAddClinicianDataMutation,
  useClinicianByIdQuery,
  useDeleteClinicianMutation,
} = clinicianApi;
