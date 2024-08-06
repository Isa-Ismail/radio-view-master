"use client";
import {
  Autocomplete,
  Button,
  CircularProgress,
  FormControl,
  InputLabel,
  LinearProgress,
  MenuItem,
  Select,
  Skeleton,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import {
  ArrowBack,
  ArrowForward,
  ChevronLeft,
  ChevronRight,
  Search,
  ExpandMore,
  ExpandLess,
  Visibility,
  FiberManualRecord,
} from "@mui/icons-material";
import DashboardCards, {
  DashboardCardItem,
} from "@/app/components/DashboardCards";
import DataTable from "@/app/components/DataTable";
import DefaultViewLayout from "@/app/components/DataViewLayout";
import { useClientAxiosClient } from "@/hooks/axios";
import useDebouncer from "@/hooks/debounce";
import { selectAuth } from "@/store/auth/authSlice";
import { useGetDataQuery } from "@/store/dashboard/dashboardApi";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { useGetStudiesQuery } from "@/store/study/studyApi";
import {
  StudyFilterProps,
  selectstudy,
  setstudyFilter,
} from "@/store/study/studySlice";
import { getValidAuthTokens } from "@/utils/cookie";
import dayjs from "dayjs";
import { MUIDataTableColumnDef } from "mui-datatables";
import { useEffect, useRef, useState } from "react";
import DateTimeFilter from "../components/date-time-filter";
import useUserStore from "@/store/zustand/context";
import { AppUser } from "@/models/user";
import { useRouter } from "next/navigation";
import { setCookie, getCookie, deleteCookie } from "cookies-next";
import Image from "next/image";
import { useGetSystemsForSiteQuery } from "@/store/system/systemApi";
import { useGetAllSitesQuery } from "@/store/site/siteApi";
import PriorReportsPage from "./prior_reports";
import { QueryClient, QueryClientProvider } from "react-query";
import { bodyParts, modalities, sites } from "@/utils/info";

const queryClient = new QueryClient();

type Row = {
  patient_name: string;
  study_date: Date;
  study: {};
  description: string;
  studySeries: any[];
  studyInstanceUID?: string;
  modality: string;
  bodyPart?: string;
  studyId?: string;
  instance_count?: number;
  system: string;
  site: string;
};

export default function StudiesPage({ nonce }: { nonce: string }) {
  const { user } = useAppSelector(selectAuth);

  const {
    token,
    userData,
    setRefreshToken,
    setToken,
    setStudyId,
    setStudy,
    setUid,
    setRRG,
  } = useUserStore();
  const { token: cookieToken, refreshToken: cookieRefreshToken } =
    getValidAuthTokens();

  const [page, setPage] = useState(0);
  const [name, setName] = useState<string>("");
  const router = useRouter();
  const [datatablePage, setDatatablePage] = useState(0);
  const [unFilteredRows, setUnFilteredRows] = useState<Row[]>([]);
  const axios = useClientAxiosClient();
  const [views, setViews] = useState<string>("studies");
  const [rows, setRows] = useState<Row[]>([]);
  const { data, total, filterProps } = useAppSelector(selectstudy);
  const [expandedRows, setExpandedRows] = useState<number[]>([]);

  // Filters Select States
  const [siteFilter, setSiteFilter] = useState<string>("");
  const [systemFilter, setSystemFilter] = useState<string>("");
  const [bodyPartFilter, setBodyPartFilter] = useState<string>("");
  const [modalityFilter, setModalityFilter] = useState<string>("");
  const [reportStatusFilter, setReportStatusFilter] = useState<string>("");
  const [isFirstRender, setIsFirstRender] = useState(true);
  useEffect(() => {
    setPage(0);
    setIsFirstRender(false);
  }, [filterProps, isFirstRender]);

  useEffect(() => {
    setRefreshToken(cookieRefreshToken);
    setToken(cookieToken);
  }, [cookieToken, cookieRefreshToken, setRefreshToken, setToken]);

  const [rowsPerPage, setRowsPerPage] = useState(10);

  const { isLoading, isFetching, error, refetch } = useGetStudiesQuery(
    {
      limit: 10,
      offset: page,
      token: token || "",
      modality: modalityFilter,
      user: AppUser.fromJson(userData),
      bodyPart: bodyPartFilter,
      name: filterProps?.name,
      site: siteFilter,
      dateRange: filterProps?.dateRange,
      axios,
    },
    {
      skip: !token || !userData,
      refetchOnMountOrArgChange: true,
      refetchOnFocus: false,
    }
  );

  const [count, setCount] = useState<number>(0);

  const { data: siteData, isLoading: siteDataLoading } =
    useGetSystemsForSiteQuery({ token: token ?? "", axios }, { skip: !token });
  const [systems, setSystems] = useState<
    {
      id: string;
      name: string;
    }[]
  >([]);

  const {
    data: sitesData,
    isLoading: sitesLoading,
    isFetching: sitesRefetching,
  } = useGetAllSitesQuery(
    {
      token: token || "",
      systemIds: systems.map((item) => item.id) || [],
      axios,
    },
    {
      skip: !token,
    }
  );

  useEffect(() => {
    if (siteData) {
      setSystems(
        siteData.map((system) => {
          return {
            id: system.systemGuid!,
            name: system.sytemFullName!,
          };
        })
      );
    }
  }, [siteData]);

  useEffect(() => {
    let _rows: Row[] = [];
    const _total = total ?? 0;
    if (data && total) {
      data.forEach((study) => {
        _rows.push({
          patient_name: study.patient.patientName,
          studyInstanceUID: study.studyInstanceUid,
          study_date: study.studyDate!,
          studySeries: study.series,
          study: study,
          description: study.series[0].seriesDescription,
          modality: study.series[0].modality,
          bodyPart: study.series[0].bodyPart,
          site: study.patient.site.name,
          system: study.patient.site.system,
          studyId: study.studyUid,
        });
      });
    } else {
      _rows = [];
    }
    setRows(_rows);

    setUnFilteredRows(_rows);

    setCount(_total);
  }, [data, total, siteFilter]);

  const debounce = useRef(useDebouncer(500));

  useEffect(() => {
    debounce.current(() => {
      if (page !== datatablePage) {
        setPage(datatablePage);
      }
    });
  }, [datatablePage, debounce, page]);
  const [filterDialogOpen, setFilterDialogOpen] = useState(false);
  const dispatch = useAppDispatch();

  const [searchText, setSearchText] = useState<string | null>(null);
  const debouncer = useRef(useDebouncer(500));

  useEffect(() => {
    debouncer.current(() => {
      dispatch(
        setstudyFilter({
          name: searchText ?? "",
        } as StudyFilterProps)
      );
    });
  }, [dispatch, searchText]);

  const [filterHighlighted, setFilterHighlighted] = useState(false);

  useEffect(() => {
    const dateRangeChanged = filterProps?.dateRange !== undefined;

    setFilterHighlighted(dateRangeChanged);
  }, [filterProps]);

  const toggleExpandRow = (index: number) => {
    if (expandedRows.includes(index)) {
      setExpandedRows(expandedRows.filter((i) => i !== index));
    } else {
      setExpandedRows([...expandedRows, index]);
    }
  };

  const handleResetFilters = () => {
    setSiteFilter("");
    setSystemFilter("");
    setBodyPartFilter("");
    setModalityFilter("");
    setReportStatusFilter("");
    setSearchText("");
    dispatch(
      setstudyFilter({ name: "", dateRange: undefined } as StudyFilterProps)
    );
  };

  return (
    <QueryClientProvider client={queryClient}>
      <div>
        <div className="flex py-10 gap-4">
          <Typography
            className={`${
              views === "studies" ? "underline text-[#539DF3]" : ""
            } cursor-pointer`}
            onClick={() => setViews("studies")}
            variant="h5"
          >
            Studies
          </Typography>
          <Typography
            className={`${
              views === "reports" ? "underline text-[#539DF3]" : ""
            } cursor-pointer`}
            onClick={() => setViews("reports")}
            variant="h5"
          >
            Prior Reports
          </Typography>
        </div>
        {/* Expandable data table here */}
        {views === "studies" ? (
          <>
            {isLoading && page === 0 ? (
              <div className="flex justify-center items-center h-[25rem]">
                <div className="flex justify-center items-center flex-col gap-2">
                  <Image alt="logo" src={"/logo.png"} width={70} height={70} />
                  <Skeleton width={200} height={30} />
                  <Typography variant="h6">Loading... </Typography>
                  You’re almost done! Sometimes it will take time, so be
                  patient...
                </div>
              </div>
            ) : (
              <>
                <div className="bg-[#1C1D1F] md:flex justify-between gap-6 p-6">
                  <Button
                    sx={{
                      // make border rounded
                      borderRadius: "30px",
                    }}
                    onClick={() => setFilterDialogOpen(true)}
                    variant="outlined"
                  >
                    <p>Filter</p>
                  </Button>

                  <FormControl sx={{ width: 180 }}>
                    <Autocomplete
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          borderRadius: 8,
                        },
                      }}
                      id="site-filter"
                      options={sites}
                      getOptionLabel={(option) => option.site_name}
                      renderInput={(params) => (
                        <TextField {...params} label="Site" />
                      )}
                      onChange={(event, newValue) => {
                        setSiteFilter(newValue ? newValue.site_id : "");
                      }}
                    />
                  </FormControl>
                  <FormControl sx={{ width: 180 }}>
                    <Autocomplete
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          borderRadius: 8,
                        },
                      }}
                      id="modality-filter"
                      options={modalities}
                      value={modalityFilter}
                      renderInput={(params) => (
                        <TextField {...params} label="Modality" />
                      )}
                      onChange={(event, newValue) => {
                        setModalityFilter(newValue || "");
                      }}
                    />
                  </FormControl>
                  <FormControl sx={{ width: 180 }}>
                    <Autocomplete
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          borderRadius: 8,
                        },
                      }}
                      id="body-part-filter"
                      options={bodyParts.map((part) => part.toUpperCase())}
                      value={bodyPartFilter}
                      renderInput={(params) => (
                        <TextField {...params} label="Body Area" />
                      )}
                      onChange={(event, newValue) => {
                        setBodyPartFilter(newValue || "");
                      }}
                    />
                  </FormControl>
                  {/* <FormControl sx={{ minWidth: 180 }}>
                    <Autocomplete
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          borderRadius: 8,
                        },
                      }}
                      options={["Not Started", "In Progress", "completed"]}
                      value={reportStatusFilter}
                      onChange={(event, newValue) => {
                        setReportStatusFilter(newValue || "");
                      }}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label="Report Status"
                          variant="outlined"
                        />
                      )}
                    />
                  </FormControl> */}
                  <Button
                    sx={{
                      // make border rounded
                      borderRadius: "30px",
                    }}
                    onClick={() => {
                      setModalityFilter("");
                      setBodyPartFilter("");
                      setReportStatusFilter("");
                      setSiteFilter("");
                      setSearchText("");
                    }}
                    variant="outlined"
                  >
                    <p>Reset</p>
                  </Button>
                  <div className="bg-[#1C1D1F] flex items-center rounded-[30px] p-2 border-solid border-2 border-white">
                    <input
                      value={searchText as string}
                      onChange={(e) => setSearchText(e.target.value)}
                      placeholder="Search by patient name"
                    />
                    <Search />
                  </div>
                </div>
                {isFetching && <LinearProgress />}
                <Table className="rounded-lg">
                  <TableHead className="bg-[#1C1D1F]">
                    <TableRow>
                      <TableCell>
                        <Typography variant="h6">Patient Details</Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="h6">Study Date | Time</Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="h6">Site</Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="h6">
                          Modality | Body Area{" "}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="h6">Viewer</Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="h6">Report Status</Typography>
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody className="bg-[#1C1D1F]">
                    {rows.map((row, id) => (
                      <>
                        <TableRow onClick={() => toggleExpandRow(id)} key={id}>
                          <TableCell>
                            {/* {expandedRows.includes(id) ? (
                              <ExpandLess
                                className="cursor-pointer"
                                onClick={() => toggleExpandRow(id)}
                              />
                            ) : (
                              <ExpandMore
                                className="cursor-pointer"
                                onClick={() => toggleExpandRow(id)}
                              />
                            )} */}
                            {row.patient_name.includes("^")
                              ? row.patient_name.trim().substring(0, 5)
                              : row.patient_name}
                          </TableCell>
                          <TableCell>
                            {dayjs(row.study_date.toString()).format(
                              "MMM DD, YYYY | hh:mm A"
                            )}
                          </TableCell>
                          <TableCell>{row.site}</TableCell>
                          <TableCell>{row.modality}</TableCell>
                          <TableCell>
                            <button
                              onClick={() => {
                                setStudyId(row.studyId);
                                setStudy(row.study);
                                setUid(row.studyInstanceUID);
                                setRRG(row.modality + "-" + row.bodyPart);
                                router.push(`/clinician-view`);
                              }}
                              className="bg-white cursor-pointer flex space-x-2 text-black px-4 py-2 rounded-full"
                            >
                              <Visibility />
                              <p>Viewer</p>
                            </button>
                          </TableCell>
                          <TableCell>
                            <FiberManualRecord className="text-red-500" /> Not
                            Started
                          </TableCell>
                        </TableRow>
                        {expandedRows.includes(id) && (
                          <>
                            {/* <TableRow className="bg-black">
                              <div className="flex justify-between">
                                <div>
                                  <Typography variant="h6">
                                    Description
                                  </Typography>
                                  <Typography variant="body1">
                                    {row.description}
                                  </Typography>
                                </div>
                                <div>
                                  <Typography variant="h6">
                                    Instances
                                  </Typography>
                                  <Typography variant="body1">
                                    {row.instance_count}
                                  </Typography>
                                </div>
                              </div>
                            </TableRow> */}
                          </>
                        )}
                      </>
                    ))}
                  </TableBody>
                </Table>

                <div
                  className={`bg-[#1C1D1F] p-4 flex items-center ${
                    rows.length > 0 ? "justify-end" : "justify-center"
                  }`}
                >
                  {rows.length > 0 ? (
                    <>
                      <p>
                        {page * 10 + 1} - {page * 10 + 10} of {total}
                      </p>
                      <ChevronLeft
                        className={`${
                          page === 0
                            ? "opacity-50 cursor-not-allowed"
                            : "cursor-pointer"
                        }`}
                        onClick={() => {
                          if (page > 0) setDatatablePage((page) => page - 1);
                        }}
                      />
                      <ChevronRight
                        className="cursor-pointer"
                        onClick={() => {
                          setDatatablePage((page) => page + 1);
                        }}
                      />
                    </>
                  ) : (
                    <>
                      <p>Sorry, there is no matching data to display</p>
                    </>
                  )}
                </div>
              </>
            )}
            <DateTimeFilter
              nonce={nonce}
              dialogOpen={filterDialogOpen}
              setDialogOpen={setFilterDialogOpen}
              defaultValue={{
                dateRange: undefined,
                defaultDateRange: undefined,
                timeRange: undefined,
              }}
              value={filterProps}
              onConfirm={(value) => {
                dispatch(setstudyFilter(value));
              }}
            ></DateTimeFilter>
          </>
        ) : (
          <>
            <PriorReportsPage nonce={nonce} />
          </>
        )}
      </div>
    </QueryClientProvider>
  );
}
