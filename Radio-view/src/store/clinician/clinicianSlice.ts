import { Clinician } from "@/models/clinician";
import { createSlice } from "@reduxjs/toolkit";
import { clinicianApi } from "./clinicianApi";

export type ClinicianFilterProps = {
  email: string;
  name: string;
  systemId?: {
    id: string;
    name: string;
  };
  siteId?: {
    id: string;
    name: string;
  };
};
export type ClinicianData = {
  total: number;
  data: Clinician[];
  filter?: ClinicianFilterProps;
};

const initialState: ClinicianData = {
  data: [],
  total: 0,
};

export const clinicianSlice = createSlice({
  name: "Clinician",
  initialState,
  reducers: {
    setClinicianData: (state, action: { payload: ClinicianData }) => {
      // state.data = action.payload.data;
      // state.total = action.payload.total;
      return {
        ...state,
        data: action.payload.data,
        total: action.payload.total,
      };
    },

    setClinicianFilter: (state, action: { payload: ClinicianFilterProps | undefined }) => {
      return {
        ...state,
        filter: action.payload,
      };
    },
  },
  extraReducers: (builder) => {
    builder.addMatcher(clinicianApi.endpoints.getData.matchFulfilled, (_state, { payload }) => {
      return {
        ..._state,
        data: payload?.data,
        total: payload?.total,
      };
    });

    builder.addMatcher(
      clinicianApi.endpoints.deleteClinician.matchFulfilled,
      (state, { payload }) => {
        const data = state.data.filter((clinician) => !payload.includes(clinician.hsaiGuid));
        return {
          ...state,
          data: data,
          total: state.total - 1,
        };
      }
    );
  },
});

export default clinicianSlice.reducer;
export const selectClinician = (state: { clinician: Partial<ClinicianData> }) => state.clinician;
export const { setClinicianData, setClinicianFilter } = clinicianSlice.actions;
