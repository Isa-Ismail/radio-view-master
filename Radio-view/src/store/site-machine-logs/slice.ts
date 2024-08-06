import { DateRangeDefaults, getDateRange } from "@/utils/DateRange";
import { createSlice } from "@reduxjs/toolkit";
import dayjs from "dayjs";
import { siteMachineLogsApi } from "./api";

export type SiteMachineLog = {
  site_id: string;
  site_name: string;
  site_alias: string;
  site_address: string;
  site_contact: string;
  last_study: {
    study_date: string;
    study_time: string;
    patient_name: string;
  };

  service_logs: {
    timestamp: string;
  }[];
};
export const siteMachineLogsDefaultFilter = {
  dateRange: getDateRange(2),
};

export type SiteMachineLogFilter = {
  siteName?: string;
  dateRange?: dayjs.Dayjs[];
  defaultDateRange?: DateRangeDefaults;
};

export type SiteMachineLogsData = {
  logs: SiteMachineLog[];
  filter?: SiteMachineLogFilter;
};

const initialState: SiteMachineLogsData = {
  logs: [],
  filter: {
    ...siteMachineLogsDefaultFilter,
  },
};

export const siteMachineLogsSlice = createSlice({
  name: "siteMachineLogs",
  initialState,
  reducers: {
    setSiteMachineLogsData: (state, action: { payload: SiteMachineLogsData }) => {
      return {
        ...state,
        logs: action.payload.logs,
      };
    },
    setSiteMachineLogsFilter: (state, action: { payload: SiteMachineLogFilter }) => {
      return {
        ...state,
        filter: action.payload,
      };
    },
  },
  extraReducers: (builder) => {
    builder.addMatcher(
      siteMachineLogsApi.endpoints.getSiteMachineLogs.matchFulfilled,
      (_state, { payload }) => {
        return {
          ..._state,
          logs: payload,
        };
      }
    );
  },
});

export default siteMachineLogsSlice.reducer;
export const selectSiteMachineLogs = (state: { siteMachineLogs: SiteMachineLogsData }) =>
  state.siteMachineLogs;
export const { setSiteMachineLogsData, setSiteMachineLogsFilter } = siteMachineLogsSlice.actions;
