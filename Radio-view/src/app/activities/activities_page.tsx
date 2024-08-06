"use client";
import AppButton from "@/app/components/Button";
import DataTable from "@/app/components/DataTable";
import { StyledTextField } from "@/app/components/Input";
import DateTimeFilter from "@/app/components/date-time-filter";
import { useClientAxiosClient } from "@/hooks/axios";
import useDebouncer from "@/hooks/debounce";
import {
  ActivitySource,
  AppActivityApiCall,
  WebActivityApiCall,
  normalizeCollectionName,
} from "@/models/activities";
import { useGetActivitiesQuery } from "@/store/activities/activitiesApi";
import {
  activityLogsDefaultFilter,
  selectActivities,
  setAppApiCall,
  setDateRange,
  setDefaultDateRange,
  setEmail,
  setSource,
  setTimeRange,
  setWebApiCall,
} from "@/store/activities/activitiesSlice";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { getValidAuthTokens } from "@/utils/cookie";
import { Autocomplete } from "@mui/material";
import { CalendarIcon } from "@mui/x-date-pickers";
import { MUIDataTableColumnDef } from "mui-datatables";
import { useEffect, useRef, useState } from "react";

const columns: MUIDataTableColumnDef[] = [
  {
    name: "email",
    label: "Email",
    options: {},
  },

  {
    name: "date",
    label: "Date",
  },
  {
    name: "time",
    label: "Time",
  },
  {
    name: "status",
    label: "Status",
    options: {
      customBodyRender(value, tableMeta, updateValue) {
        let color = "text-red-700";
        let text = "Failed";
        let bgColor = "bg-red-100";
        if (value === "success") {
          color = "text-green-700";
          text = "Success";
          bgColor = "bg-green-100";
        }
        return (
          <div
            className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${color} ${bgColor}`}>
            <span>{text}</span>
          </div>
        );
      },
    },
  },
  {
    name: "apiCall",
    label: "Action",
  },
  {
    name: "description",
    label: "Description",
  },
];

type Row = {
  email: string;
  date: string;
  time: string;
  status: string;
  apiCall: string;
  description: string;
};

export default function ActivtiesPage({ nonce }: { nonce: string }) {
  const { token } = getValidAuthTokens();
  const [page, setPage] = useState(0);
  const {
    activities,
    source,

    appApiCall,
    status,

    webApiCall,
    dateRange,
    timeRange,
    defaultDateRange,
    email,
  } = useAppSelector(selectActivities);
  const dispatch = useAppDispatch();
  const axios = useClientAxiosClient();
  const [rows, setRows] = useState<Row[]>([]);

  const { isLoading, isFetching, error } = useGetActivitiesQuery(
    {
      token: token || "",
      source: source,
      appApiCall: appApiCall,
      status: status,
      webApiCall: webApiCall,
      dateRange: dateRange,
      email,
      axios,
    },
    {
      refetchOnMountOrArgChange: true,
    }
  );
  const [dateRangeFilterOpen, setDateRangeFilterOpen] = useState<boolean>(false);

  const [emailFilter, setEmailFilter] = useState<string | undefined>(email);
  const debounce = useRef(useDebouncer(500));
  useEffect(() => {
    debounce.current(() => {
      if (email !== emailFilter) {
        dispatch(setEmail(emailFilter));
      }
    });
  }, [debounce, dispatch, email, emailFilter]);

  useEffect(() => {
    setPage(0);
  }, [source, email]);

  useEffect(() => {
    if (activities) {
      setRows(
        activities.map((activity) => ({
          email: activity.email,
          date: activity.timeZoneBasedDate,
          time: activity.timeZoneBasedTime,
          status: activity.status,
          apiCall: activity.apiCall,
          description: activity.description,
        }))
      );
    }
  }, [activities]);

  const resetFilters = () => {
    setPage(0);
    setEmailFilter(undefined);
    dispatch(setWebApiCall(undefined));
    dispatch(setAppApiCall(undefined));
    dispatch(setEmail(undefined));
    dispatch(setDateRange(undefined));
  };

  return (
    <div>
      <div className="flex mb-2">
        <AppButton
          nonce={nonce}
          variant={`${source === ActivitySource.app ? "outlined" : "contained"}`}
          onClick={() => {
            dispatch(setSource(ActivitySource.web));
          }}
          small
          className="mr-2">
          Web
        </AppButton>
        <AppButton
          small
          nonce={nonce}
          variant={`${source === ActivitySource.web ? "outlined" : "contained"}`}
          onClick={() => {
            dispatch(setSource(ActivitySource.app));
          }}>
          App
        </AppButton>
      </div>
      <div className="flex mb-2 justify-between">
        <div className="w-1/5">
          <Autocomplete
            fullWidth
            key={[source, appApiCall, webApiCall].join("")}
            options={
              source === ActivitySource.web
                ? Object.values(WebActivityApiCall)
                : Object.values(AppActivityApiCall)
            }
            getOptionLabel={(option) => normalizeCollectionName(option)}
            onChange={(e, value) => {
              if (value === null) {
                dispatch(setWebApiCall(undefined));
                dispatch(setAppApiCall(undefined));
              } else if (source === ActivitySource.web) {
                dispatch(setWebApiCall(value as WebActivityApiCall));
              } else {
                dispatch(setAppApiCall(value as AppActivityApiCall));
              }
            }}
            value={source === ActivitySource.web ? webApiCall : appApiCall}
            size="small"
            renderInput={(params) => (
              <StyledTextField {...params} placeholder="Select log type" />
            )}></Autocomplete>
        </div>
        <div
          className="flex items-center align-middle
        ">
          <AppButton
            nonce={nonce}
            className="mr-5"
            variant={dateRange ? "contained" : "outlined"}
            onClick={() => {
              setDateRangeFilterOpen(true);
            }}>
            Filter by date
            <span className="ml-2">
              <CalendarIcon />
            </span>
          </AppButton>
          <StyledTextField
            size="small"
            label="Search by email"
            // key={email}
            value={emailFilter}
            onChange={(e) => {
              setEmailFilter(e.target.value);
            }}
          />
        </div>
      </div>
      <DataTable
        nonce={nonce}
        allowSelect={false}
        columns={columns}
        loading={isLoading || isFetching}
        error={error}
        serverSidePagination={false}
        onNextPage={setPage}
        paginationModel={{
          data: rows,
          page: page,
          totalCount: activities.length,
        }}></DataTable>
      <DateTimeFilter
        nonce={nonce}
        defaultValue={activityLogsDefaultFilter}
        onConfirm={(value) => {
          dispatch(setTimeRange(value?.timeRange ?? undefined));
          dispatch(setDateRange(value?.dateRange ?? undefined));
          dispatch(setDefaultDateRange(value?.defaultDateRange ?? undefined));
        }}
        value={{
          dateRange: dateRange,
          timeRange: timeRange,
          defaultDateRange: defaultDateRange,
        }}
        dialogOpen={dateRangeFilterOpen}
        setDialogOpen={setDateRangeFilterOpen}></DateTimeFilter>
    </div>
  );
}
