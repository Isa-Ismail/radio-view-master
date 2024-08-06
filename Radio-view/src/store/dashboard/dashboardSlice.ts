import { createSlice } from "@reduxjs/toolkit";
import { dashboardApi } from "./dashboardApi";

export type DashboardGraph = {
  month_name: string;
  data: number;
};

export type DashboardData = {
  clincians: number;
  sites: number;
  studies: number;
  systems: number;
  patients: number;
  graph: DashboardGraph[];
};

const initialState: DashboardData = {
  clincians: 0,
  sites: 0,
  studies: 0,
  systems: 0,
  patients: 0,
  graph: [],
};

export const dashboardSlice = createSlice({
  name: "dashboard",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addMatcher(dashboardApi.endpoints.getData.matchFulfilled, (_state, { payload }) => {
      return {
        ..._state,
        clincians: payload?.clincians || 0,
        patients: payload?.patients || 0,
        sites: payload?.sites || 0,
        studies: payload?.studies || 0,

        systems: payload?.systems || 0,
      };
    });
    builder.addMatcher(dashboardApi.endpoints.getGraph.matchFulfilled, (_state, { payload }) => {
      return {
        ..._state,
        graph: payload,
      };
    });
  },
});

export default dashboardSlice.reducer;
export const selectDashboard = (state: { dashboard: Partial<DashboardData> }) => state.dashboard;
export const {} = dashboardSlice.actions;
