import { SiteAdmin } from "@/models/site";
import { createSlice } from "@reduxjs/toolkit";
import { siteApi } from "./siteApi";

export type SitesFilterProps = {
  alias: string;
  name: string;
  system?:
    | {
        id: string;
        name: string;
      }
    | undefined;
  email: string;
};
export type SiteData = {
  total: number;
  data: SiteAdmin[];
  filter?: SitesFilterProps;
};

const initialState: SiteData = {
  data: [],
  total: 0,
};

export const siteSlice = createSlice({
  name: "site",
  initialState,
  reducers: {
    setSiteData: (state, action: { payload: SiteData }) => {
      return {
        ...state,
        data: action.payload.data,
        total: action.payload.total,
      };
    },
    setSiteFilter: (state, action: { payload: SitesFilterProps | undefined }) => {
      return {
        ...state,
        filter: action.payload,
      };
    },
  },
  extraReducers: (builder) => {
    builder.addMatcher(siteApi.endpoints.getSiteData.matchFulfilled, (_state, { payload }) => {
      return {
        ..._state,
        data: payload?.data,
        total: payload.total,
      };
    });
    builder.addMatcher(siteApi.endpoints.deleteSite.matchFulfilled, (_state, { payload }) => {
      const data = _state.data.filter((site) => !payload.includes(site.hsaiGuid!));
      return {
        ..._state,
        data: data,
        total: _state.total - 1,
      };
    });
  },
});

export default siteSlice.reducer;
export const selectSite = (state: { site: Partial<SiteData> }) => state.site;
export const { setSiteData, setSiteFilter } = siteSlice.actions;
