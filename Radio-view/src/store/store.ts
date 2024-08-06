import { configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query";
import { activitiesApi } from "./activities/activitiesApi";
import activitiesSlice from "./activities/activitiesSlice";
import { appVersionApi } from "./app-version/appVersionApi";
import appVersionSlice from "./app-version/appVersionSlice";
import appSlice from "./app/appSlice";
import { authApi } from "./auth/authApi";
import authSlice from "./auth/authSlice";
import { clinicianApi } from "./clinician/clinicianApi";
import clinicianSlice from "./clinician/clinicianSlice";
import { dashboardApi } from "./dashboard/dashboardApi";
import dashboardSlice from "./dashboard/dashboardSlice";
import { siteMachineLogsApi } from "./site-machine-logs/api";
import siteMachineLogsSlice from "./site-machine-logs/slice";
import { siteApi } from "./site/siteApi";
import siteSlice from "./site/siteSlice";
import { studyApi } from "./study/studyApi";
import studySlice from "./study/studySlice";
import { systemApi } from "./system/systemApi";
import systemSlice from "./system/systemSlice";

export const store = configureStore({
  reducer: {
    [authApi.reducerPath]: authApi.reducer,
    [dashboardApi.reducerPath]: dashboardApi.reducer,
    [systemApi.reducerPath]: systemApi.reducer,
    [siteApi.reducerPath]: siteApi.reducer,
    [clinicianApi.reducerPath]: clinicianApi.reducer,
    [studyApi.reducerPath]: studyApi.reducer,
    [siteMachineLogsApi.reducerPath]: siteMachineLogsApi.reducer,
    [activitiesApi.reducerPath]: activitiesApi.reducer,
    [appVersionApi.reducerPath]: appVersionApi.reducer,
    auth: authSlice,
    dashboard: dashboardSlice,
    system: systemSlice,
    site: siteSlice,
    clinician: clinicianSlice,
    study: studySlice,
    app: appSlice,
    activities: activitiesSlice,
    appVersion: appVersionSlice,
    siteMachineLogs: siteMachineLogsSlice,
  },
  middleware: (getDefaultMiddleware: any) =>
    getDefaultMiddleware({
      thunk: true,
      immutableCheck: true,
      serializableCheck: false,
      actionCreatorCheck: true,
    })
      .concat(authApi.middleware)
      .concat(dashboardApi.middleware)
      .concat(systemApi.middleware)
      .concat(siteApi.middleware)
      .concat(clinicianApi.middleware)
      .concat(studyApi.middleware)
      .concat(siteMachineLogsApi.middleware)
      .concat(activitiesApi.middleware)
      .concat(appVersionApi.middleware),

  devTools: process.env.NODE_ENV !== "production",
});
setupListeners(store.dispatch);
export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
