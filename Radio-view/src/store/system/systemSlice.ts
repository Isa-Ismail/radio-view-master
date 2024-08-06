import { HsaiSystem, SystemAdmin } from "@/models/system";
import { createSlice } from "@reduxjs/toolkit";
import { systemApi } from "./systemApi";
export type SystemData = {
  total: number;
  data: SystemAdmin[];
  byId?: SystemAdmin;
  systems?: HsaiSystem[];
  filter?: SystemFilterProps;
};
export type SystemFilterProps = {
  alias: string;
  name: string;

  email: string;
};

const initialState: SystemData = {
  data: [],
  total: 0,
  byId: undefined,
  systems: [],
};

export const systemSlice = createSlice({
  name: "system",
  initialState,
  reducers: {
    setSystemData: (state, action: { payload: SystemData }) => {
      return {
        ...state,
        data: action.payload.data,
        total: action.payload.total,
      };
    },
    setSystemFilter: (state, action: { payload: SystemFilterProps | undefined }) => {
      return {
        ...state,
        filter: action.payload,
      };
    },
  },
  extraReducers: (builder) => {
    builder.addMatcher(systemApi.endpoints.getSystemData.matchFulfilled, (state, { payload }) => {
      return {
        ...state,
        data: payload.data,
        total: payload.total,
      };
    });
    builder.addMatcher(systemApi.endpoints.getSystemById.matchFulfilled, (state, { payload }) => {
      return {
        ...state,
        byId: payload,
      };
    });
    builder.addMatcher(
      systemApi.endpoints.getSystemsForSite.matchFulfilled,
      (state, { payload }) => {
        return {
          ...state,
          systems: payload,
        };
      }
    );
    builder.addMatcher(systemApi.endpoints.deleteSystem.matchFulfilled, (state, { payload }) => {
      const data = state.data.filter((system) => !payload.includes(system.hsaiGuid!));
      return {
        ...state,
        data: data,
        total: state.total - 1,
      };
    });
  },
});

export default systemSlice.reducer;
export const selectsystem = (state: { system: SystemData }) => state.system;
export const { setSystemData, setSystemFilter } = systemSlice.actions;
