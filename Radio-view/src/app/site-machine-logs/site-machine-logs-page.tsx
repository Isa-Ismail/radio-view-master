"use client";

import DataTable from "@/app/components/DataTable";
import DateTimeFilter from "@/app/components/date-time-filter";
import { useClientAxiosClient } from "@/hooks/axios";
import useDebouncer from "@/hooks/debounce";
import { Study } from "@/models/study";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { useGetSiteMachineLogsQuery } from "@/store/site-machine-logs/api";
import {
  selectSiteMachineLogs,
  setSiteMachineLogsFilter,
  siteMachineLogsDefaultFilter,
} from "@/store/site-machine-logs/slice";
import { getValidAuthTokens } from "@/utils/cookie";
import dayjs from "dayjs";
import { MUIDataTableColumn } from "mui-datatables";
import { useEffect, useRef, useState } from "react";
type Row = {
  site_alias: string;
  site_name: string;
  last_study: string;
};
const columns: MUIDataTableColumn[] = [
  {
    name: "site_alias",
    label: "Site Alias",
  },
  {
    name: "site_name",
    label: "Site Name",
  },
  {
    name: "last_study",
    label: "Last Study Date | Time",
  },
];
export default function SiteMachineLogsPage({ nonce }: { nonce: string }) {
  const { token } = getValidAuthTokens();
  const axios = useClientAxiosClient();
  const { logs, filter } = useAppSelector(selectSiteMachineLogs);

  const { isLoading, isFetching } = useGetSiteMachineLogsQuery(
    {
      token: token || "",
      axios,
      filter,
    },
    {
      skip: !token,
      refetchOnMountOrArgChange: true,
      refetchOnFocus: false,
    }
  );
  const [rows, setRows] = useState<Row[]>([]);
  const [page, setPage] = useState(0);
  const [dateFilterDialog, setDateFilterDialog] = useState(false);
  const dispatch = useAppDispatch();
  const [search, setSearch] = useState<string>("");
  const debouncer = useRef(useDebouncer(200));

  useEffect(() => {
    debouncer.current(() => {
      let _search = search === "" ? undefined : search;
      if (_search !== filter?.siteName) {
        dispatch(
          setSiteMachineLogsFilter({
            ...filter,
            siteName: _search === "" ? undefined : _search,
          })
        );
      }
    });
  }, [dispatch, filter, search]);

  useEffect(() => {
    if (logs) {
      const rows: Row[] = logs?.map((item) => {
        let lastStudyDateTime: string = "";
        const lastStudy = item.last_study;
        if (lastStudy) {
          const studyDate = lastStudy.study_date;
          const studyTime = lastStudy.study_time;

          const date = Study.getStudyDateAndTime(studyDate, studyTime);

          lastStudyDateTime = dayjs(date).format("MMM DD, YYYY | hh:mm A");
        }
        return {
          site_alias: item.site_alias,
          site_name: item.site_name,
          last_study: lastStudyDateTime,
        };
      });
      if (rows) {
        setRows(rows);
      } else {
        setRows([]);
      }
    }
  }, [logs]);

  return (
    <>
      <DataTable
        nonce={nonce}
        onFilterDialog={() => {
          setDateFilterDialog(true);
        }}
        // titleBar={
        // <StyledTextField
        //   size={"small"}
        //   label="Search Site"
        //   value={search}
        //   onChange={(e) => {
        //     setSearch(e.target.value);
        //   }}></StyledTextField>
        // }
        searchPlaceholder="Search by Site"
        searchValue={search}
        onSearchChange={(value) => {
          setSearch(value ?? "");
        }}
        highlightFilter={filter?.dateRange ? true : false}
        allowSelect={false}
        columns={columns}
        loading={isLoading || isFetching}
        onNextPage={setPage}
        serverSidePagination={false}
        expandableColumns={[
          {
            name: "logs_date",
            label: "Logs Date",
          },
          {
            name: "logs_time",
            label: "Logs Time",
          },
        ]}
        expandableRows={(index) => {
          const item = logs[index];
          if (item) {
            return item.service_logs.map((log) => {
              const date = Date.parse(log.timestamp);
              return {
                logs_date: dayjs(date).format("MMM DD, YYYY"),
                logs_time: dayjs(date).format("hh:mm A"),
              };
            });
          }
          return [];
        }}
        haveExpandableRow={true}
        paginationModel={{
          data: rows,
          page: page,
          totalCount: rows?.length ?? 0,
        }}></DataTable>
      <DateTimeFilter
        nonce={nonce}
        defaultValue={siteMachineLogsDefaultFilter}
        dialogOpen={dateFilterDialog}
        onConfirm={(value) => {
          dispatch(
            setSiteMachineLogsFilter({
              ...filter,
              dateRange: value.dateRange,
              defaultDateRange: value.defaultDateRange,
            })
          );
        }}
        setDialogOpen={setDateFilterDialog}
        value={filter}></DateTimeFilter>
    </>
  );
}
