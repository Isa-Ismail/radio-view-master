"use client";
import {
  Autocomplete,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
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
  Delete,
  Star,
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
import { useGetAllSitesQuery } from "@/store/site/siteApi";
import { useGetSystemsForSiteQuery } from "@/store/system/systemApi";
import { isError, useMutation, useQuery, useQueryClient } from "react-query";
import getAccessToken from "@/utils/get_acess_token";
import { bodyParts, modalities, sites } from "@/utils/info";
import AppButton from "../components/Button";

type Row = {
  patient_name: string;
  study_date: Date;
  description: string;
  studySeries: any[];
  modality: string;
  instance_count?: number;
  system: string;
  site: string;
};

export default function PriorReportsPage({ nonce }: { nonce: string }) {
  const { user } = useAppSelector(selectAuth);

  const {
    token,
    userData,
    refreshToken,
    setRefreshToken,
    setUid,
    setRRG,
    setStudy,
    setStudyId,
    setToken,
  } = useUserStore();
  const { token: cookieToken, refreshToken: cookieRefreshToken } =
    getValidAuthTokens();
  const queryClient = useQueryClient();

  const [page, setPage] = useState(0);
  const [name, setName] = useState<string>("");
  const router = useRouter();
  const [datatablePage, setDatatablePage] = useState(0);
  const axios = useClientAxiosClient();
  const [views, setViews] = useState<string>("studies");
  const [rows, setRows] = useState<Row[]>([]);
  const { data, total, filterProps } = useAppSelector(selectstudy);
  const [expandedRows, setExpandedRows] = useState<number[]>([]); // State for expanded rows
  const [siteFilter, setSiteFilter] = useState<string>("");
  const [systemFilter, setSystemFilter] = useState<string>("");
  const [bodyPartFilter, setBodyPartFilter] = useState<string>("");
  const [modalityFilter, setModalityFilter] = useState<string>("");
  const [reportStatusFilter, setReportStatusFilter] = useState<string>("");
  const [reportsDataTable, setReportsDataTable] = useState<any>();
  const [preprocessedData, setPreprocessedData] = useState<any>();
  const [searchText, setSearchText] = useState<string>("");
  const [modifiedDate, setModifiedDate] = useState<string>("");
  const [dialogOpen, setDialogOpen] = useState<boolean>(false);
  const [deleteRowId, setDeleteRowId] = useState<string>("");
  useEffect(() => {
    setPage(0);
  }, [filterProps]);

  useEffect(() => {
    setRefreshToken(cookieRefreshToken);
    setToken(cookieToken);
  }, [cookieToken, cookieRefreshToken, setRefreshToken, setToken]);

  const { isLoading, isFetching, error, refetch } = useGetStudiesQuery(
    {
      limit: 10,
      offset: page,
      token: token || "",
      modality: modalityFilter,
      bodyPart: bodyPartFilter,
      user: AppUser.fromJson(userData),
      name: filterProps?.name,
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
    setModifiedDate(
      filterProps?.dateRange
        ?.map((date) => date.format("YYYY-MM-DD"))
        .join(",") || ""
    );
  }, [filterProps]);

  const queryParams = new URLSearchParams({
    user_id: userData.hsai_guid,
    ...(modalityFilter && { modality: modalityFilter }),
    ...(bodyPartFilter && { body_part_examined: bodyPartFilter }),
    ...(name && { name: searchText }),
    ...(reportStatusFilter && { report_status: reportStatusFilter }),
    ...(filterProps?.dateRange && {
      dateRange: modifiedDate,
    }),
    ...(siteFilter && { site_id: siteFilter }),
  }).toString();

  const {
    data: reportsData,
    isLoading: reportsLoading,
    isFetching: reportsRefetching,
    refetch: refetchReports,
    isError: reportsError,
  } = useQuery(["reports"], async () => {
    const res = await fetch(`/api/data/prior-reports?${queryParams}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    const data = await res.json();

    if (res.status !== 200) {
      throw new Error(data.message);
    }
    setReportsDataTable(data.radiology_reports);
    return data;
  });

  const deleteMutation = useMutation(
    async (id: string) => {
      const res = await fetch(`/api/data/delete-report?id=${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      if (!res.ok) {
        throw new Error("Error deleting report");
      }
      return res.json();
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries("reports");
      },
    }
  );

  const handleDelete = (id: string) => {
    deleteMutation.mutate(id);
  };

  useEffect(() => {
    refetchReports();
  }, [
    modifiedDate,
    token,
    refetchReports,
    modalityFilter,
    bodyPartFilter,
    searchText,
    reportStatusFilter,
    siteFilter,
  ]);

  useEffect(() => {
    if (reportsError) {
      getAccessToken({ forceRotate: true })
        .then(({ data, error }) => {
          console.log("Successfully refreshed token");
          if (data) {
            const { token } = data;
            setToken(token);
          }
        })
        .catch((error) => {
          console.error("Error refreshing token:", error);
          router.push("/clinician-login");
        });
    }
  }, [reportsError, router, setToken]);

  useEffect(() => {
    let _rows: Row[] = [];
    const _total = total ?? 0;
    if (data && total) {
      data.forEach((study) => {
        _rows.push({
          patient_name: study.patient.patientName,
          study_date: study.studyDate!,
          studySeries: study.series,
          description: study.series[0].seriesDescription,
          modality: study.series[0].modality,
          site: study.patient.site.name,
          system: study.patient.site.system,
        });
      });
    } else {
      _rows = [];
    }
    setRows(_rows);

    setCount(_total);
  }, [data, total]);

  useEffect(() => {
    if (reportsData) {
      let rows: any = [];
      reportsData.radiology_reports.forEach((report: any) => {
        rows.push({
          report_title: report.report_title,
          study_instance_uid: report.study.study_instance_uid,
          report_status: report.report_status,
          date: report.updated_at,
          id: report.id,
          user_id: report.user_id,
          body_part: report.study.series[0].body_part_examined,
          modalities: report.study.series[0].modality,
          site_name:
            report.study.patient.hsai_site_to_patient_mappings[0].site
              .site_name,
          site_id:
            report.study.patient.hsai_site_to_patient_mappings[0].site.site_id,
          studyId: report.study.study_orthanc_id_2,
          study: report.study,
        });
      });

      setPreprocessedData(rows);
    }
  }, [reportsDataTable, reportsData, setPreprocessedData]);

  // write an useEffect to filter the data based on the filters

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

  return (
    <div>
      {reportsLoading && page === 0 ? (
        <div className="flex justify-center items-center h-[25rem]">
          <div className="flex justify-center items-center flex-col gap-2">
            <Image alt="logo" src={"/logo.png"} width={70} height={70} />
            <Skeleton width={200} height={30} />
            <Typography variant="h6">Loading... </Typography>
            You’re almost done! Sometimes it will take time, so be patient...
          </div>
        </div>
      ) : (
        <>
          <div className="bg-[#1C1D1F] flex justify-between gap-6 p-6">
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

            <FormControl sx={{ minWidth: 180 }}>
              <Autocomplete
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: 8,
                  },
                }}
                id="site-filter"
                options={sites}
                getOptionLabel={(option) => option.site_name}
                renderInput={(params) => <TextField {...params} label="Site" />}
                onChange={(event, newValue) => {
                  setSiteFilter(newValue ? newValue.site_id : "");
                }}
              />
            </FormControl>
            <FormControl sx={{ minWidth: 180 }}>
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
            <FormControl sx={{ minWidth: 180 }}>
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
            <FormControl sx={{ minWidth: 180 }}>
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
            </FormControl>
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
              }}
              variant="outlined"
            >
              <p>Reset</p>
            </Button>

            <div className="bg-[#1C1D1F] flex items-center rounded-[30px] p-2 border-solid border-2 border-white">
              <input
                onChange={(e) => setSearchText(e.target.value)}
                placeholder="Search by patient name"
              />
              <Search />
            </div>
          </div>
          {reportsRefetching && <LinearProgress />}
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
                  <Typography variant="h6">Modality | Body Area </Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="h6">Viewer</Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="h6">Report Status</Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="h6">Actions</Typography>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody className="bg-[#1C1D1F]">
              {preprocessedData?.map((row: any, id: any) => (
                <>
                  <TableRow key={id}>
                    <TableCell>{row.report_title}</TableCell>
                    <TableCell>
                      {dayjs(row.date.toString()).format(
                        "MMM DD, YYYY | hh:mm A"
                      )}
                    </TableCell>
                    <TableCell>{row.site_name}</TableCell>
                    <TableCell>
                      {row.modalities} | {row.body_part}
                    </TableCell>
                    <TableCell>
                      <button
                        onClick={() => {
                          setStudy(row.study);
                          setRRG(row.modalities + "-" + row.body_part);
                          setUid(row.study_instance_uid);
                          setStudyId(row.studyId);
                          router.push(`/clinician-view`);
                        }}
                        className="bg-white flex space-x-2 text-black px-4 py-2 rounded-full"
                      >
                        <Visibility />
                        <p>Viewer</p>
                      </button>
                    </TableCell>
                    <TableCell className="flex">
                      <FiberManualRecord
                        className={
                          row.report_status === "pending"
                            ? "text-yellow-300"
                            : row.report_status === "completed"
                            ? "text-green-500"
                            : "text-red-500"
                        }
                      />{" "}
                      {row.report_status}
                    </TableCell>
                    <TableCell
                      onClick={() => {
                        setDialogOpen(true);
                        setDeleteRowId(row.id);
                      }}
                      className="cursor-pointer"
                    >
                      <Delete />
                    </TableCell>
                  </TableRow>
                </>
              ))}
            </TableBody>
          </Table>
          <div className={`bg-[#1C1D1F] p-4 flex items-center justify-center}`}>
            {preprocessedData?.length > 0 ? (
              <></>
            ) : (
              <p>Sorry, there is no matching data to display</p>
            )}
          </div>
        </>
      )}

      <Dialog
        maxWidth="md"
        open={dialogOpen}
        onClose={() => {
          setDialogOpen(false);
        }}
      >
        <DialogContent className="py-5">
          Are you sure you want to delete this prior report?
        </DialogContent>
        <DialogActions>
          <AppButton
            variant="outlined"
            onClick={() => {
              setDialogOpen(false);
            }}
            nonce={nonce}
          >
            Cancel
          </AppButton>
          <AppButton
            onClick={() => {
              handleDelete(deleteRowId);
              setDialogOpen(false);
            }}
            nonce={nonce}
          >
            Delete
          </AppButton>
        </DialogActions>
      </Dialog>
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
    </div>
  );
}
