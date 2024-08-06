"use client";

import useUserStore from "@/store/zustand/context";
import {
  ArrowBack,
  ArrowUpward,
  Circle,
  CopyAll,
  Delete,
  Edit,
  FiberManualRecord,
  Logout,
  Mic,
  Save,
  Send,
} from "@mui/icons-material";
import {
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  Divider,
  Drawer,
  FormControl,
  IconButton,
  Input,
  InputAdornment,
  LinearProgress,
  Skeleton,
  Typography,
} from "@mui/material";
import { GridSearchIcon } from "@mui/x-data-grid";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import FileIcon from "../../../../icons/studies/File.jpg";
import Image from "next/image";
import { QueryClient, useMutation, useQuery } from "react-query";
import axios, { AxiosError } from "axios";
import { xapiKey } from "@/utils/constants";
import Markdown from "react-markdown";
import Audio from "../../../../icons/source.gif";
import {
  BoldItalicUnderlineToggles,
  CodeToggle,
  headingsPlugin,
  InsertThematicBreak,
  listsPlugin,
  markdownShortcutPlugin,
  MDXEditor,
  quotePlugin,
  Separator,
  thematicBreakPlugin,
  toolbarPlugin,
  UndoRedo,
} from "@mdxeditor/editor";
import "@mdxeditor/editor/style.css";
import { AxiosResponse } from "@/hooks/axios";
import getAccessToken from "@/utils/get_acess_token";
import dayjs from "dayjs";
import DeleteIcon from "./icons/DeleteIcon";
import File2Icon from "./icons/File2Icon";
import AppButton from "../components/Button";
import { useAppSnackbar } from "@/hooks/snackbar";

const constUID = "1.2.276.0.7230010.3.1.2.811938916.1.1719000807.352293";

const SAMPLE_RATE = 44100;

const SidePanel = () => {
  const queryClient = new QueryClient();
  const router = useRouter();
  const [view, setViews] = useState("All Templates");
  const {
    token,
    study,
    userData,
    studyId,
    setRefreshToken,
    setToken,
    setUid,
    rrg,
    reportData,
    setReportData,
    reportContent,
    setReportContent,
    uid,
  } = useUserStore();
  const [templateId, setTemplateId] = useState("");
  const [RRGSearch, setRRGSearch] = useState(rrg);
  const [templateSelected, setTemplateSelected] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [formData, setFormData] = useState<FormData | null>(null);
  const recorder = useRef<MediaRecorder | null>(null);
  const [transcription, setTranscription] = useState("");
  const [rrgOpen, setRRGOpen] = useState(false);
  const [editing, setIsEditing] = useState(false);
  const [improvedNoteText, setImprovedNoteText] = useState(transcription);
  const [rrgData, setRRGData] = useState<any>();
  const [reportsDataTable, setReportsDataTable] = useState<any>([]);
  const [detailsScreen, setDetailsScreen] = useState(false);
  const { infoSnackbar } = useAppSnackbar();
  const [steps, setSteps] = useState<
    "Template Selection" | "Transcribed" | "Saved" | "viewing"
  >("Template Selection");
  const [showDialog, setShowDialog] = useState(false);
  const [deleteId, setDeleteId] = useState("");
  const [reportTitle, setReportTitle] = useState<string>("");

  const bars = Array.from({ length: 20 }, (_, index) => index);

  const [form, setForm] = useState<any>({
    reportTitle: "",
    reportContent: "",
    reportStatus: "",
    studyId: "",
    userId: "",
  });

  const insertMutation = useMutation(
    async () => {
      const res = await fetch(`/api/data/create-report`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          reportContent: transcription,
          reportStatus: "pending",
          userId: userData.hsai_guid,
          studyId: studyId,
          reportTitle: reportTitle,
        }),
      });
      if (!res.ok) {
        throw new Error("Error inserting report");
      }
      return res.json();
    },
    {
      onSuccess: () => {
        infoSnackbar("Report created successfully");
        setSteps("Template Selection");
        setTemplateSelected(false);
        queryClient.invalidateQueries("reports");
      },
    }
  );

  const handleInsert = () => {
    if (transcription && userData.userid && studyId && rrgData)
      insertMutation.mutate();
  };

  const { mutate: onTranscribe, isLoading: transcribing } = useMutation(
    async () => {
      const { data } = await axios.post(
        `https://dev-aizamd-route.neurocare.ai/api/v1/rrg-service/`,
        formData,
        {
          params: {
            template_id: templateId,
            platform: 1,
            user_id: 0,
          },
          headers: {
            "Content-Type": "multipart/form-data",
            "x-api-key": xapiKey,
          },
        }
      );
      return data;
    },
    {
      onSuccess: (data) => {
        setSteps("Transcribed");
        setTranscription(data.radiology_report);
        setRRGData(data);
        setIsRecording(false);
        setReportTitle(data.report_title);
        setForm({
          reportContent: data.radiology_report,
          reportStatus: "pending",
          userId: userData.hsai_guid,
          studyId: studyId,
          reportTitle: data.report_title,
        });
      },
      onError: (err: AxiosError) => {
        console.error("Error transcribing:", err);
      },
    }
  );

  const queryParams = new URLSearchParams({
    user_id: userData.hsai_guid,
    ...(RRGSearch && { name: RRGSearch }),
  }).toString();

  const {
    data: reportsData,
    isLoading: reportsLoading,
    isFetching: reportsRefetching,
    refetch: refetchReports,
    isError: reportsError,
  } = useQuery(
    ["reports"],
    async () => {
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
    },
    {
      refetchOnWindowFocus: false,
      refetchOnMount: false,
      refetchOnReconnect: false,
      retry: false,
    }
  );

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
        refetchReports();
        setDetailsScreen(false);
      },
    }
  );

  const { mutate: update, isLoading: updating } = useMutation(
    async (id: string) => {
      const res = await fetch(`/api/data/update-report`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          id: id,
          reportContent: reportContent,
        }),
      });
      if (!res.ok) {
        throw new Error("Error updating report");
      }
      return res.json();
    },
    {
      onSuccess: () => {
        refetchReports();
        setDetailsScreen(false);
        infoSnackbar("Report updated successfully");
      },
    }
  );

  const handleDelete = (id: string) => {
    deleteMutation.mutate(id);
  };

  const onStartRecording = useCallback(async () => {
    setIsRecording(true);
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        audio: { sampleRate: SAMPLE_RATE, channelCount: 1, sampleSize: 16 },
      });
      const mediaRecorder = new MediaRecorder(mediaStream, {
        mimeType: "audio/webm",
        audioBitsPerSecond: 128000,
      });
      console.log(mediaStream, mediaRecorder);
      mediaRecorder.ondataavailable = async (blobEvent: BlobEvent) => {
        const blob = blobEvent.data;
        const file = new File([blob], "recording.webm");
        const form = new FormData();
        form.append("audio", file);
        console.log(formData);
        setFormData(form);
      };
      mediaRecorder.start();
      recorder.current = mediaRecorder;
    } catch (error) {
      console.error("Error starting recording:", error);
    }
  }, [formData, recorder]);

  const onStopRecording = useCallback(() => {
    recorder.current?.stop();
  }, [onTranscribe]);

  useEffect(() => {
    if (formData) {
      onTranscribe();
    }
  }, [formData]);

  const handlePause = () => {
    recorder.current?.pause();
    setIsRecording(false);
    setIsPaused(true);
  };

  const handlePlay = () => {
    if (recorder.current?.state === "paused") {
      recorder.current?.resume();
    }
    setIsRecording(true);
    setIsPaused(false);
  };

  const { isError, isLoading, data, refetch, isFetching } = useQuery(
    "templates",
    async () => {
      const response = await axios.get(
        "https://dev-aizamd-route.neurocare.ai/api/v1/rrg-service/template/search/0",
        {
          headers: {
            "Content-Type": "application/json",
            "x-api-key": xapiKey,
          },
          params: {
            page_number: 1,
            page_size: 25,
            search_query: RRGSearch,
            search_result_count: 25,
          },
        }
      );

      return response.data;
    }
  );

  const {
    isError: templateError,
    isLoading: TemplateLoading,
    data: templateData,
    refetch: refetchTemplate,
    isFetching: fetchingTemplate,
  } = useQuery(
    "templateData",
    async () => {
      const response = await axios.get(
        `https://dev-aizamd-route.neurocare.ai/api/v1/rrg-service/template/${templateId}`,
        {
          headers: {
            "Content-Type": "application/json",
            "x-api-key": xapiKey,
          },
        }
      );
      return response.data;
    },
    {
      refetchOnWindowFocus: false,
      refetchOnMount: false,
      refetchOnReconnect: false,
      retry: false,
    }
  );

  useEffect(() => {
    refetchReports();
  }, [RRGSearch, refetchReports, view, token]);

  useEffect(() => {
    refetchTemplate();
  }, [templateData, templateId, refetchTemplate]);

  useEffect(() => {
    refetch();
  }, [RRGSearch, refetch]);

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

  return (
    <>
      <div className="flex">
        <div className="flex">
          <div>
            {/* <div
              onClick={() => {
                // router.push("/studies");
              }}
              className={`cursor-pointer absolute top-[5px] left-10 opacity-0`}
            >
              <Typography variant="h3">RadioView.AI</Typography>
            </div> */}
            <div
              className={`absolute top-[5px] ${
                rrgOpen ? "right-20" : "right-20"
              }`}
            >
              {isRecording ? (
                <div className="rounded-[30px] h-[42px] p-2 flex gap-2 bg-[#525252]">
                  {/* <File2Icon /> */}
                  <Delete
                    className="text-[#8E8E93] cursor-pointer"
                    onClick={() => setIsRecording(false)}
                  />
                  <Mic className="text-red-500" />
                  <div>
                    {transcribing ? (
                      <div
                        style={{
                          marginTop: ".5rem",
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                          gap: "3px",
                        }}
                      >
                        {bars.map((bar) => (
                          <div
                            className="bg-blue-400"
                            key={bar}
                            style={{
                              marginTop: ".25rem",
                              width: "2px",
                              height: "5px",
                            }}
                          />
                        ))}
                      </div>
                    ) : (
                      <Image
                        className="mt-[-.5rem]"
                        src={Audio}
                        alt="alt"
                        height={35}
                        width={150}
                      />
                    )}
                  </div>
                  {transcribing ? (
                    <div className="">
                      <CircularProgress size={"0.8rem"} />
                    </div>
                  ) : (
                    <ArrowUpward
                      onClick={() => {
                        onStopRecording();
                      }}
                      className="bg-blue-600 rounded-full cursor-pointer"
                    />
                  )}
                </div>
              ) : (
                <div
                  onClick={() => {
                    setRRGOpen(!rrgOpen);
                  }}
                  className="p-2 cursor-pointer rounded-full bg-gradient-to-r from-[#89B0E7] to-[#0E60C5]"
                >
                  <Mic />
                </div>
              )}
            </div>
            {/* <div
              className={`absolute cursor-pointer top-[10px] ${
                rrgOpen ? "right-5" : "right-5"
              }`}
              onClick={() => {
                router.push(`/clinician-login`);
              }}
            >
              <Logout />
            </div> */}
            <iframe
              style={{
                height: "100vh",
                width: `${rrgOpen ? "80vw" : "100vw"}`,
              }}
              src={`https://radiologist.netlify.app`}
            />
          </div>
          <div className="flex flex-col gap-4">
            <nav className="h-[3.25rem] w-[20vw] bg-[#1C1D1F]"></nav>
            {detailsScreen ? (
              <>
                <div className="p-5 flex flex-col gap-10 h-[90vh] overflow-y-auto overflow-x-hidden">
                  <div
                    onClick={() => {
                      setTemplateSelected(false);
                      setDetailsScreen(false);
                      setSteps("Template Selection");
                    }}
                  >
                    <ArrowBack className="cursor-pointer" />
                  </div>
                  <div className="space-y-10">
                    <StudyInfo study={study} />
                    <Modality modality={rrg} />
                    <div>
                      <h3>{reportData.report_title}</h3>
                    </div>
                  </div>
                  {!editing ? (
                    <div className="rounded-lg flex flex-col gap-6">
                      <MDXEditor
                        markdown={reportContent}
                        readOnly
                        plugins={[
                          // Example Plugin Usage
                          headingsPlugin(),
                          listsPlugin(),
                          quotePlugin(),
                          thematicBreakPlugin(),
                          markdownShortcutPlugin(),
                        ]}
                      />
                    </div>
                  ) : (
                    <div className="border-solid border-2 border-blue-500 rounded-lg ">
                      <MDXEditor
                        markdown={reportContent}
                        onChange={(e) => setReportContent(e)}
                        plugins={[
                          // Example Plugin Usage
                          headingsPlugin(),
                          listsPlugin(),
                          quotePlugin(),
                          thematicBreakPlugin(),
                          markdownShortcutPlugin(),
                          toolbarPlugin({
                            toolbarContents: () => (
                              <>
                                <UndoRedo />
                                <Separator />
                                <CodeToggle />
                                <InsertThematicBreak />
                                <BoldItalicUnderlineToggles />
                              </>
                            ),
                          }),
                        ]}
                      />
                    </div>
                  )}
                  {editing ? (
                    <div className="pt-5 flex justify-end gap-3">
                      <Button
                        onClick={() => {
                          setIsEditing(false);
                        }}
                        variant="outlined"
                        style={{
                          borderRadius: "30px",
                          color: "#FFFFFF",
                          fontSize: "15px",
                        }}
                      >
                        Cancel
                      </Button>
                      <Button
                        onClick={() => {
                          setIsEditing(false);
                        }}
                        variant="contained"
                        style={{
                          borderRadius: "30px",
                          backgroundColor: "#007AFF",
                          color: "#FFFFFF",
                          fontSize: "15px",
                        }}
                      >
                        Save
                      </Button>
                    </div>
                  ) : (
                    <>
                      <div className="flex justify-end gap-3">
                        <button
                          style={{
                            borderRadius: "9px",
                            border: "solid",
                            borderWidth: "1px",
                            padding: "5px",
                            borderColor: "white",
                          }}
                          onClick={() => {
                            setShowDialog(true);
                            setDeleteId(reportData.id);
                          }}
                        >
                          <Delete />
                        </button>
                        <button
                          style={{
                            borderRadius: "9px",
                            border: "solid",
                            borderWidth: "1px",
                            padding: "5px",
                            borderColor: "white",
                          }}
                          onClick={() => {
                            update(reportData.id);
                            queryClient.invalidateQueries("reports");
                          }}
                        >
                          {updating ? (
                            <CircularProgress size={"1.5rem"} />
                          ) : (
                            <Send className="cursor-pointer" />
                          )}
                        </button>
                        <button
                          onClick={() => {
                            // copy to clipboard
                            navigator.clipboard.writeText(reportContent);
                          }}
                          style={{
                            borderRadius: "9px",
                            border: "solid",
                            borderWidth: "1px",
                            padding: "5px",
                            borderColor: "white",
                          }}
                        >
                          <CopyAll className="cursor-pointer" />
                        </button>
                        <button
                          onClick={() => {
                            setIsEditing(true);
                          }}
                          style={{
                            borderRadius: "9px",
                            border: "solid",
                            borderWidth: "1px",
                            backgroundColor: "#539DF3",
                            padding: "5px",
                            borderColor: "white",
                          }}
                        >
                          <Edit className="cursor-pointer" />
                        </button>
                      </div>
                    </>
                  )}
                </div>
              </>
            ) : (
              <>
                {!templateSelected ? (
                  <div className="flex flex-col gap-4 pt-4 items-start h-[90vh] overflow-y-scroll overflow-x-hidden">
                    <FormControl
                      sx={{
                        width: "90%",
                        background: "#1C1D1F",
                        borderRadius: "8px",
                        marginX: "20px",
                      }}
                      variant="standard"
                      id="search-box-rrg"
                    >
                      <Input
                        sx={{
                          p: "4",
                          py: "0.25rem",
                          "&::before": {
                            borderBottom: "none",
                          },
                          "&:hover:not(.Mui-disabled, .Mui-error):before": {
                            borderBottom: "none",
                          },
                          "&::after": {
                            borderBottom: "none",
                          },
                        }}
                        placeholder={
                          view === "All Templates"
                            ? "Search RRG Templates"
                            : "Search Prior Reports"
                        }
                        type="search"
                        value={RRGSearch}
                        onChange={(e) => {
                          setRRGSearch(e.target.value);
                        }}
                        startAdornment={
                          <InputAdornment
                            position="start"
                            sx={{ marginLeft: 0 }}
                          >
                            <IconButton aria-label="toggle password visibility">
                              <GridSearchIcon />
                            </IconButton>
                          </InputAdornment>
                        }
                      />
                    </FormControl>
                    <Box sx={{ display: "flex", gap: 2, mb: 2.5 }}>
                      <Box
                        onClick={() => setViews("All Templates")}
                        sx={{ pl: "1.5rem", py: "1rem", cursor: "pointer" }}
                      >
                        <Typography
                          sx={{
                            borderBottom:
                              view === "All Templates"
                                ? "2px #007AFF solid"
                                : "",
                            color:
                              view === "All Templates" ? "#007AFF" : "#C7C7CC",
                            fontSize: "15",
                            fontWeight: "400",
                          }}
                        >
                          All Templates
                        </Typography>
                      </Box>
                      <Box
                        onClick={() => {
                          setViews("Prior Reports");
                          setRRGSearch("");
                        }}
                        sx={{ py: "1rem", cursor: "pointer" }}
                      >
                        <Typography
                          sx={{
                            borderBottom:
                              view === "Prior Reports"
                                ? "2px #007AFF solid"
                                : "",
                            color:
                              view === "Prior Reports" ? "#007AFF" : "#C7C7CC",
                            fontSize: "15",
                            fontWeight: "400",
                          }}
                        >
                          Prior Reports
                        </Typography>
                      </Box>
                    </Box>
                    <>
                      {view === "All Templates" ? (
                        <div className="flex w-full flex-col gap-2">
                          {isLoading && (
                            <div className="flex ml-3 space-y-[.5rem] flex-col w-full justify-center items-center">
                              Loading Templates ...
                              <Skeleton height={50} width={300} />
                              <Skeleton height={50} width={300} />
                              <Skeleton height={50} width={300} />
                              <Skeleton height={50} width={300} />
                            </div>
                          )}
                          {data?.items?.length === 0 && (
                            <div className="flex justify-center items-center">
                              No Templates Found
                            </div>
                          )}
                          {data?.items?.map((template: any) => (
                            <div
                              key={template.id}
                              onClick={() => {
                                setTemplateSelected(true);
                                setTemplateId(template.template_id);
                              }}
                              className="flex justify-start items-center gap-3 rounded-lg bg-[#1C1D1F] py-2 px-3 mx-[1.5rem] cursor-pointer hover:bg-[#222325]"
                            >
                              <div>
                                <Image
                                  width={15}
                                  height={15}
                                  src={FileIcon}
                                  alt="file"
                                />
                              </div>
                              <p>{template.long_description}</p>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <>
                          {reportsLoading || reportsRefetching ? (
                            <div className="flex space-y-[-.5rem] flex-col w-full justify-center items-center">
                              Loading Reports ...
                              <Skeleton height={100} width={300} />
                              <Skeleton height={100} width={300} />
                              <Skeleton height={100} width={300} />
                              <Skeleton height={100} width={300} />
                            </div>
                          ) : (
                            <div className="flex justify-center pr-4 w-full">
                              <div className="bg-[#1C1D1F] w-full rounded-lg ml-4 py-4 px-1 space-y-5">
                                {reportsDataTable?.length === 0 && (
                                  <div className="w-full flex justify-center items-center">
                                    No Reports Found
                                  </div>
                                )}
                                {reportsDataTable.map((data: any, id: any) => (
                                  <div
                                    style={{
                                      borderBottom: "1px",
                                      borderColor: "white",
                                      borderStyle: "solid",
                                      borderWidth: "130%",
                                      cursor: "pointer",
                                    }}
                                    className="flex flex-col gap-2 p-4 hover:bg-[#222325]"
                                    key={id}
                                    onClick={() => {
                                      setReportData(data);
                                      setDetailsScreen(true);
                                      setReportContent(data.report_content);
                                    }}
                                  >
                                    <div className="flex justify-between gap-2 items-center">
                                      <p className="text-sm text-[#C7C7CC]">
                                        {dayjs(data.created_at).format(
                                          "MMM DD, YYYY"
                                        )}
                                      </p>
                                      <div className="flex gap-1 justify-center items-center">
                                        <FiberManualRecord
                                          className={
                                            data.report_status === "pending"
                                              ? "text-yellow-300"
                                              : data.report_status ===
                                                "completed"
                                              ? "text-green-500"
                                              : "text-red-500"
                                          }
                                        />
                                        <p className="text-sm text-[#C7C7CC]">
                                          {data.report_status}
                                        </p>
                                      </div>
                                      <p className="text-sm text-[#C7C7CC]">
                                        {dayjs(data.created_at).format(
                                          "h:mm A"
                                        )}
                                      </p>
                                    </div>
                                    <div className="flex justify-between gap-3">
                                      <div className="flex gap-2 items-center">
                                        <File2Icon />
                                        <p>
                                          {data.report_title.slice(0, 25) +
                                            "..."}
                                        </p>
                                      </div>
                                      <button
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          setShowDialog(true);
                                          setDeleteId(data.id);
                                        }}
                                      >
                                        <DeleteIcon />
                                      </button>
                                    </div>
                                    {/* <Divider className="text-white h-2" /> */}
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </>
                      )}
                    </>
                  </div>
                ) : (
                  //after template selected logic here
                  <>
                    {steps === "Template Selection" && (
                      <>
                        {fetchingTemplate ? (
                          <div className="flex justify-center items-center pt-[1rem]">
                            <div className="flex space-y-[.5rem] flex-col w-full justify-center items-center">
                              <p>Loading Template</p>
                              <Skeleton width={300} />
                              <Skeleton width={300} />
                              <Skeleton width={300} />
                              <Skeleton width={300} />
                              <Skeleton width={300} />
                              <Skeleton width={300} />
                            </div>
                          </div>
                        ) : (
                          <>
                            {transcribing ? (
                              <>
                                <div className="flex justify-center items-center pt-[1rem]">
                                  <div className="flex bg-[#1C1D1F] py-4 rounded-lg m-5 space-y-[.5rem] flex-col w-full justify-center items-center">
                                    <p>Processing your audio</p>
                                    <Skeleton width={300} />
                                    <Skeleton width={300} />
                                    <Skeleton width={300} />
                                    <Skeleton width={300} />
                                  </div>
                                </div>
                              </>
                            ) : (
                              <div className="h-[90vh] flex flex-col gap-6 p-5 overflow-x-hidden overflow-y-auto">
                                <StudyInfo study={study} />
                                <Modality modality={rrg} />
                                <Markdown>
                                  {templateData?.normal_report}
                                </Markdown>
                                {!isRecording && (
                                  <div className="pt-5 flex justify-end gap-3">
                                    <Button
                                      onClick={() => {
                                        setIsRecording(false);
                                        setTemplateSelected(false);
                                      }}
                                      variant="outlined"
                                      style={{
                                        borderRadius: "30px",
                                        color: "#FFFFFF",
                                        fontSize: "15px",
                                      }}
                                    >
                                      Change
                                    </Button>
                                    <Button
                                      onClick={() => {
                                        onStartRecording();
                                      }}
                                      variant="contained"
                                      style={{
                                        borderRadius: "30px",
                                        backgroundColor: "#007AFF",
                                        color: "#FFFFFF",
                                        fontSize: "15px",
                                      }}
                                    >
                                      Use
                                    </Button>
                                  </div>
                                )}
                              </div>
                            )}
                          </>
                        )}
                      </>
                    )}

                    {steps === "Transcribed" && (
                      <div className="p-5 flex flex-col gap-10 h-[90vh] overflow-y-auto overflow-x-hidden">
                        <div
                          onClick={() => {
                            setTemplateSelected(false);
                            setSteps("Template Selection");
                          }}
                        >
                          <ArrowBack className="cursor-pointer" />
                        </div>
                        <div className="space-y-10">
                          <StudyInfo study={study} />
                          <Modality modality={rrg} />
                          <div>
                            <h3>{rrgData.report_title}</h3>
                          </div>
                        </div>
                        {!editing ? (
                          <div className="rounded-lg flex flex-col gap-6">
                            <MDXEditor
                              markdown={transcription}
                              readOnly
                              plugins={[
                                // Example Plugin Usage
                                headingsPlugin(),
                                listsPlugin(),
                                quotePlugin(),
                                thematicBreakPlugin(),
                                markdownShortcutPlugin(),
                              ]}
                            />
                          </div>
                        ) : (
                          <div className="border-solid border-2 border-blue-500 rounded-lg ">
                            <MDXEditor
                              markdown={transcription}
                              onChange={(e) => setTranscription(e)}
                              plugins={[
                                // Example Plugin Usage
                                headingsPlugin(),
                                listsPlugin(),
                                quotePlugin(),
                                thematicBreakPlugin(),
                                markdownShortcutPlugin(),
                                toolbarPlugin({
                                  toolbarContents: () => (
                                    <>
                                      <UndoRedo />
                                      <Separator />
                                      <CodeToggle />
                                      <InsertThematicBreak />
                                      <BoldItalicUnderlineToggles />
                                    </>
                                  ),
                                }),
                              ]}
                            />
                          </div>
                        )}
                        {editing ? (
                          <div className="pt-5 flex justify-end gap-3">
                            <Button
                              onClick={() => {
                                setIsEditing(false);
                              }}
                              variant="outlined"
                              style={{
                                borderRadius: "30px",
                                color: "#FFFFFF",
                                fontSize: "15px",
                              }}
                            >
                              Cancel
                            </Button>
                            <Button
                              onClick={() => {
                                setIsEditing(false);
                              }}
                              variant="contained"
                              style={{
                                borderRadius: "30px",
                                backgroundColor: "#007AFF",
                                color: "#FFFFFF",
                                fontSize: "15px",
                              }}
                            >
                              Save
                            </Button>
                          </div>
                        ) : (
                          <>
                            {rrgData.is_invalid === false && (
                              <div className="flex justify-end gap-3">
                                <button
                                  style={{
                                    borderRadius: "9px",
                                    border: "solid",
                                    borderWidth: "1px",
                                    padding: "5px",
                                    borderColor: "white",
                                  }}
                                  onClick={() => handleInsert()}
                                >
                                  {insertMutation.isLoading ? (
                                    <CircularProgress size={"1.5rem"} />
                                  ) : (
                                    <Send className="cursor-pointer" />
                                  )}
                                </button>
                                <button
                                  onClick={() => {
                                    // copy to clipboard
                                    navigator.clipboard.writeText(
                                      transcription
                                    );
                                  }}
                                  style={{
                                    borderRadius: "9px",
                                    border: "solid",
                                    borderWidth: "1px",
                                    padding: "5px",
                                    borderColor: "white",
                                  }}
                                >
                                  <CopyAll className="cursor-pointer" />
                                </button>
                                <button
                                  onClick={() => {
                                    setIsEditing(true);
                                  }}
                                  style={{
                                    borderRadius: "9px",
                                    border: "solid",
                                    borderWidth: "1px",
                                    backgroundColor: "#539DF3",
                                    padding: "5px",
                                    borderColor: "white",
                                  }}
                                >
                                  <Edit className="cursor-pointer" />
                                </button>
                              </div>
                            )}
                          </>
                        )}
                      </div>
                    )}
                  </>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      <Dialog
        maxWidth="md"
        open={showDialog}
        onClose={() => {
          setShowDialog(false);
        }}
      >
        <DialogContent className="py-5">
          Are you sure you want to delete this prior report?
        </DialogContent>
        <DialogActions>
          <AppButton
            variant="outlined"
            onClick={() => {
              setShowDialog(false);
            }}
            nonce={"delete"}
          >
            Cancel
          </AppButton>
          <AppButton
            onClick={() => {
              handleDelete(deleteId);
              setShowDialog(false);
            }}
            nonce={"delete"}
          >
            Delete
          </AppButton>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default SidePanel;

const Modality = ({ modality }: { modality: string }) => (
  <div className="flex items-center rounded-lg bg-[#1C1D1F] w-full justify-center py-2 px-3 mr-[1.5rem]">
    {modality}
  </div>
);

const StudyInfo = ({ study }: { study: any }) => (
  <div className="flex gap-4">
    <div className="flex flex-col gap-1">
      {dayjs(study?.studyDate).format("h:mm A")}
      <p className="text-sm text-[#727477]">
        {dayjs(study?.studyDate).format("MMM DD, YYYY")}
      </p>
    </div>
    <div className="flex flex-col gap-1">
      {study?.patient?.patientName}
      <p className="text-sm text-[#727477]">{study?.patient?.patientSex}</p>
    </div>
    <div className="flex items-end">
      <p className="text-sm text-[#727477]">{study?.patient?.site?.name}</p>
    </div>
  </div>
);
