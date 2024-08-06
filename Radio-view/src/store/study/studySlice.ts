import { Study, StudyFilter } from "@/models/study";
import { DateRangeDefaults } from "@/utils/DateRange";
import { createSlice } from "@reduxjs/toolkit";
import dayjs from "dayjs";
import { studyApi } from "./studyApi";

export type StudyFilterProps = {
  dateRange?: dayjs.Dayjs[];
  dateRangeDefault?: DateRangeDefaults;
  name?: string;
};
export type StudyData = {
  total: number;
  data: any[];
  rrg: any;
  filter?: StudyFilter;
  filterProps?: StudyFilterProps;
};

const initialState: StudyData = {
  data: [],
  rrg:[],
  total: 0,
};

export const studySlice = createSlice({
  name: "study",
  initialState,
  reducers: {
    setstudyData: (state, action: { payload: StudyData }) => {
      return {
        ...state,
        data: action.payload.data,
        total: action.payload.total,
        rrg: action.payload.rrg
      };
    },
    setstudyFilter: (state, action: { payload: StudyFilterProps | undefined }) => {
      const filterProps = {
        ...state.filterProps,
        ...action.payload,
      };
      return {
        ...state,
        filterProps: filterProps,
      };
    },
  },
  extraReducers: (builder) => {
    builder.addMatcher(studyApi.endpoints.getStudies.matchFulfilled, (_state, { payload }) => {
      return { ..._state, data: payload?.data, total: payload?.total, rrg: payload?.rrg };
    });
  },
});

export default studySlice.reducer;
export const selectstudy = (state: { study: StudyData }) => state.study;
export const { setstudyData, setstudyFilter } = studySlice.actions;
