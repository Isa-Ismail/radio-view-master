import { AxiosClient } from "@/hooks/axios";
import fetchActivities from "@/lib/activities/fetchActivities/fetchActivities";
import ActivitiesModel, {
  ActivitySource,
  ActivityStatus,
  AppActivityApiCall,
  WebActivityApiCall,
} from "@/models/activities";
import { createApi, fakeBaseQuery } from "@reduxjs/toolkit/query/react";
import dayjs from "dayjs";

export const activitiesApi = createApi({
  reducerPath: "activitiesApi",
  baseQuery: fakeBaseQuery(),
  keepUnusedDataFor: 0,
  endpoints: (builder) => ({
    getActivities: builder.query<
      ActivitiesModel[],
      {
        source: ActivitySource;
        status?: ActivityStatus;

        webApiCall?: WebActivityApiCall;
        appApiCall?: AppActivityApiCall;
        token: string;
        dateRange?: dayjs.Dayjs[];
        email?: string;
        axios: AxiosClient;
      }
    >({
      queryFn: async ({
        source,
        status,
        webApiCall,
        appApiCall,
        token,
        dateRange,
        email,
        axios,
      }) => {
        const { data, error } = await fetchActivities({
          source,
          status,
          webApiCall,
          appApiCall,
          token,
          dateRange,
          email,
          axios,
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

export const { useGetActivitiesQuery } = activitiesApi;
