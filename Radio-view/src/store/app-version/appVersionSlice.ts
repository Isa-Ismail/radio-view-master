import AppVersion from "@/models/app-versions";
import { DateRangeDefaults } from "@/utils/DateRange";
import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import dayjs from "dayjs";
import { appVersionApi } from "./appVersionApi";

export interface AppVersionFilter {
  dateRange: dayjs.Dayjs[];
  defaultDateRange: DateRangeDefaults;
  timeRange?: string[];

  version?: string;
  description?: string;
}

export interface AppVersionState {
  total: number;
  data: AppVersion[];
  filter?: AppVersionFilter;
}

const initialState: AppVersionState = {
  data: [],
  total: 0,
};

const appVersionSlice = createSlice({
  name: "AppVersion",
  initialState,
  reducers: {
    setAppVersion(state, action: { payload: AppVersionState }) {
      return {
        ...state,
        ...action.payload,
      };
    },
    setAppVersionFilter(state, action: PayloadAction<AppVersionFilter | undefined>) {
      return {
        ...state,
        filter: action.payload,
      };
    },
  },
  extraReducers(builder) {
    builder.addMatcher(
      appVersionApi.endpoints.getVersions.matchFulfilled,
      (_state, { payload }) => {
        return {
          ..._state,
          data: payload.data,
          total: payload.total,
        };
      }
    );
  },
});

export const { setAppVersion, setAppVersionFilter } = appVersionSlice.actions;
export default appVersionSlice.reducer;
export const selectAppVersion = (state: { appVersion: Partial<AppVersionState> }) =>
  state.appVersion;
