"use client";

import DataTable from "@/app/components/DataTable";
import { StyledTextField } from "@/app/components/Input";
import DateTimeFilter from "@/app/components/date-time-filter";
import { useClientAxiosClient } from "@/hooks/axios";
import useDebouncer from "@/hooks/debounce";
import { useGetVersionsQuery } from "@/store/app-version/appVersionApi";
import {
  AppVersionFilter,
  selectAppVersion,
  setAppVersionFilter,
} from "@/store/app-version/appVersionSlice";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { getValidAuthTokens } from "@/utils/cookie";
import { Edit } from "@mui/icons-material";
import { IconButton } from "@mui/material";
import dayjs from "dayjs";
import { MUIDataTableColumnDef } from "mui-datatables";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

const columns: MUIDataTableColumnDef[] = [
  {
    name: "version",
    label: "Version",
  },

  {
    name: "force_update",
    label: "Force Update?",
    options: {
      customBodyRender: (value) => (value === true ? "Yes" : "No"),
    },
  },
  {
    name: "appstore_review",
    label: "Appstore Reviewed?",
    options: {
      customBodyRender: (value) => (value === true ? "Yes" : "No"),
    },
  },
  {
    name: "playstore_review",
    label: "Playstore Reviewed?",
    options: {
      customBodyRender: (value) => (value === true ? "Yes" : "No"),
    },
  },
  {
    name: "created_at",
    label: "Update Time",
    options: {
      customBodyRender: (params) => {
        const value = params as Date;

        return dayjs(value).format("MMM DD, YYYY | hh:mm A");
      },
    },
  },
];
export type Row = {
  id: string;
  version: string;
  force_update: boolean;
  appstore_review: boolean;
  playstore_review: boolean;
  created_at: Date;
  description: string;
};

export default function AppVersionPage({ nonce }: { nonce: string }) {
  const { token } = getValidAuthTokens();
  const [page, setPage] = useState(0);
  const [count, setCount] = useState<number>(0);
  const axios = useClientAxiosClient();

  const { data, total, filter } = useAppSelector(selectAppVersion);
  const { isLoading, error, isFetching } = useGetVersionsQuery(
    {
      token: token ?? "",
      offset: page,
      limit: 10,
      filter: filter,
      axios,
    },
    {
      refetchOnMountOrArgChange: true,
    }
  );

  const [rows, setRows] = useState<Row[]>([]);
  const debouncer = useRef(useDebouncer(500));
  const [versionSearch, setVersionSearch] = useState<string | null>(null);
  const [descriptionSearch, setDescriptionSearch] = useState<string | null>(null);
  const router = useRouter();
  const [dateFilterOpen, setDateFilterOpen] = useState<boolean>(false);
  const dispatch = useAppDispatch();
  useEffect(() => {
    if (data) {
      const _rows: Row[] = [];
      data.forEach((row) => {
        _rows.push({
          id: row.id,
          version: row.version,
          force_update: row.force_update,
          appstore_review: row.appstore_review,
          playstore_review: row.playstore_review,
          created_at: row.created_at,
          description: row.description,
        });
      });
      setRows(_rows);
      setCount(total!);
    } else {
      setRows([]);
      setCount(0);
    }
  }, [data, total]);

  useEffect(() => {
    debouncer.current(() => {
      const _filter = {
        ...filter,
        version: versionSearch,
        description: descriptionSearch,
      };
      dispatch(setAppVersionFilter(_filter as AppVersionFilter));
    });
  }, [versionSearch, descriptionSearch, filter, dispatch]);
  return (
    <>
      <DataTable
        nonce={nonce}
        highlightFilter={filter?.dateRange ? true : false}
        onFilterDialog={() => {
          setDateFilterOpen(true);
        }}
        titleBar={
          <div className="flex gap-2">
            <StyledTextField
              size="small"
              value={versionSearch ?? ""}
              onChange={(e) => {
                setVersionSearch(e.target.value);
              }}
              label="Version"
              placeholder="Version"
              variant="outlined"></StyledTextField>
            <StyledTextField
              size="small"
              value={descriptionSearch ?? ""}
              onChange={(e) => {
                setDescriptionSearch(e.target.value);
              }}
              label="Description"
              placeholder="Description"
              variant="outlined"></StyledTextField>
          </div>
        }
        allowSelect={false}
        columns={columns}
        loading={isLoading || isFetching}
        haveExpandableRow={true}
        actions={(params) => (
          <div>
            <IconButton
              onClick={() => {
                const version = params.rowData[0];

                router.push(`/app-version/edit/${version}`);
              }}>
              <Edit></Edit>
            </IconButton>
          </div>
        )}
        expandableColumns={[
          {
            name: "description",
            label: "Description",
          },
        ]}
        expandableRows={(index) => {
          const description = data?.[index]?.description;
          const descriptionArray = description?.split("\n") ?? [];
          return descriptionArray.map((item, index) => {
            return {
              id: index,
              description: item,
            };
          });
        }}
        error={error}
        onNextPage={setPage}
        paginationModel={{
          data: rows,
          page: page,
          totalCount: count,
        }}></DataTable>
      <DateTimeFilter
        nonce={nonce}
        defaultValue={{
          dateRange: undefined,
          timeRange: undefined,
          defaultDateRange: undefined,
        }}
        onConfirm={(value) => {
          const _filter = {
            ...value,
          };
          dispatch(setAppVersionFilter(_filter as AppVersionFilter));
        }}
        dialogOpen={dateFilterOpen}
        value={{
          dateRange: filter?.dateRange,
          timeRange: filter?.timeRange,
          defaultDateRange: filter?.defaultDateRange,
        }}
        setDialogOpen={setDateFilterOpen}></DateTimeFilter>
    </>
  );
}
