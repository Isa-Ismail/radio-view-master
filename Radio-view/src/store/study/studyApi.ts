import { AxiosClient } from "@/hooks/axios";
import fetchStudies from "@/lib/study/fetchStudies/fetchStudies";
import { Study } from "@/models/study";
import { AppUser } from "@/models/user";
import { createApi, fakeBaseQuery } from "@reduxjs/toolkit/query/react";
import dayjs from "dayjs";

export const studyApi = createApi({
  reducerPath: "studyApi",
  baseQuery: fakeBaseQuery(),
  tagTypes: ["Study"],
  endpoints: (builder) => ({
    getStudies: builder.query<
      {
        total: number;
        data: Study[];
        rrg: any
      },
      {
        token: string;
        offset: number;
        limit: number;
        user: AppUser | undefined;
        modality?: string;
        bodyPart?: string;
        site?: string | undefined;
        dateRange?: dayjs.Dayjs[] | undefined;
        name?: string | undefined;
        axios: AxiosClient;
      }
    >({
      queryFn: async ({ token, offset, limit, user, site, modality, bodyPart, dateRange, name, axios }) => {
        const { error, data } = await fetchStudies({
          token,
          offset,
          limit,
          user,
          site,
          modality,
          bodyPart,
          dateRange,
          name,
          axios,
        });
        if (data) {
          return { data };
        }
        return { error };
      },
    }),
  }),
});

export const { useGetStudiesQuery } = studyApi;
