import ActivitiesModel, {
  ActivitySource,
  ActivityStatus,
  AppActivityApiCall,
  WebActivityApiCall,
} from "@/models/activities";
import { DateRangeDefaults, getDateRangeFromDefault } from "@/utils/DateRange";
import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import dayjs from "dayjs";
import { activitiesApi } from "./activitiesApi";

export interface ActivitiesState {
  activities: ActivitiesModel[];
  source: ActivitySource;
  status?: ActivityStatus;

  webApiCall?: WebActivityApiCall;
  appApiCall?: AppActivityApiCall;
  dateRange?: dayjs.Dayjs[];
  timeRange?: string[];
  defaultDateRange?: DateRangeDefaults;
  email?: string;
}

export const activityLogsDefaultFilter = {
  ...getDateRangeFromDefault(DateRangeDefaults.Month),
};

const initialState: ActivitiesState = {
  activities: [],
  source: ActivitySource.web,
  ...activityLogsDefaultFilter,
};

export const activitiesSlice = createSlice({
  name: "activities",
  initialState,
  reducers: {
    setActivities: (state, action: PayloadAction<ActivitiesModel[]>) => {
      return {
        ...state,
        activities: action.payload,
      };
    },
    setSource: (state, action: PayloadAction<ActivitySource>) => {
      // state.source = action.payload;
      return {
        ...state,
        source: action.payload,
        webActivityCollection: undefined,
        appActivityCollection: undefined,
      };
    },
    setStatus: (state, action: PayloadAction<ActivityStatus>) => {
      // state.status = action.payload;
      return {
        ...state,
        status: action.payload,
      };
    },

    setWebApiCall: (state, action: PayloadAction<WebActivityApiCall | undefined>) => {
      // state.webApiCall = action.payload;
      return {
        ...state,
        webApiCall: action.payload,
      };
    },
    setAppApiCall: (state, action: PayloadAction<AppActivityApiCall | undefined>) => {
      // state.appApiCall = action.payload;
      return {
        ...state,
        appApiCall: action.payload,
      };
    },
    setDateRange: (state, action: PayloadAction<dayjs.Dayjs[] | undefined>) => {
      if (action.payload === undefined) {
        return {
          ...state,
          dateRange: [dayjs().subtract(30, "days").startOf("day"), dayjs().endOf("day")],
        };
      }
      return {
        ...state,
        dateRange: action.payload,
      };
    },
    setTimeRange: (state, action: PayloadAction<string[] | undefined>) => {
      return {
        ...state,
        timeRange: action.payload,
      };
    },
    setEmail: (state, action: PayloadAction<string | undefined>) => {
      return {
        ...state,
        email: action.payload,
      };
    },

    setDefaultDateRange: (state, action: PayloadAction<DateRangeDefaults | undefined>) => {
      if (action.payload === undefined) {
        return {
          ...state,
          defaultDateRange: DateRangeDefaults.Month,
        };
      }
      return {
        ...state,

        defaultDateRange: action.payload,
      };
    },
  },
  extraReducers(builder) {
    builder.addMatcher(
      activitiesApi.endpoints.getActivities.matchFulfilled,
      (_state, { payload }) => {
        return {
          ..._state,
          activities: payload,
        };
      }
    );
  },
});

export const {
  setActivities,
  setSource,
  setStatus,
  setWebApiCall,
  setAppApiCall,
  setDateRange,
  setTimeRange,
  setEmail,
  setDefaultDateRange,
} = activitiesSlice.actions;

export const selectActivities = (state: { activities: ActivitiesState }) => state.activities;

export default activitiesSlice.reducer;
