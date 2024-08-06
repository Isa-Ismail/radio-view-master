"use client";
import DataTable from "@/app/components/DataTable";
import LoadingIconButton from "@/app/components/LoadingIconButton";
import { useClientAxiosClient } from "@/hooks/axios";
import useConfirm from "@/hooks/confirm";
import useDebouncer from "@/hooks/debounce";
import { useAppSnackbar } from "@/hooks/snackbar";
import { HsaiUser } from "@/models/hsai_user";
import { HsaiSystem, SystemAdmin } from "@/models/system";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { useDeleteSystemMutation, useGetSystemDataQuery } from "@/store/system/systemApi";
import { selectsystem, setSystemFilter } from "@/store/system/systemSlice";
import { getValidAuthTokens } from "@/utils/cookie";
import { DeleteForever, Edit } from "@mui/icons-material";
import { IconButton } from "@mui/material";
import { MUIDataTableColumnDef } from "mui-datatables";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
type Row = {
  id?: string;
  alias?: string;
  system_name?: string;
  sites?: string;
  contact_name?: string;
  contact_phone?: string;
  contact_email?: string;
  hsai_system?: HsaiSystem;
  hsaiUser?: HsaiUser;
};
const columns: MUIDataTableColumnDef[] = [
  {
    name: "system_name",
    label: "System Name",
  },
  {
    name: "alias",
    label: "System Alias",
  },

  {
    name: "contact_name",
    label: "Name",
  },
  {
    name: "contact_phone",
    label: "Phone",
  },
  {
    name: "contact_email",
    label: "Email",
  },
];

export default function SystemsPage({ nonce }: { nonce: string }) {
  const router = useRouter();
  const { token } = getValidAuthTokens();

  const { data, total } = useAppSelector(selectsystem);

  const [dataTablePage, setDataTablePage] = useState(0);
  const [page, setPage] = useState(0);
  const { filter } = useAppSelector(selectsystem);
  const axios = useClientAxiosClient();

  const { isLoading, isFetching, error } = useGetSystemDataQuery(
    {
      token: token || "",
      limit: 10,
      offset: page,
      filter: filter,
      axios,
    },
    {
      refetchOnMountOrArgChange: true,
    }
  );
  const [filterDialogOpen, setFilterDialogOpen] = useState(false);

  const [rows, setRows] = useState<Row[]>([]);
  const [count, setCount] = useState<number>(0);
  const confirm = useConfirm();
  const { enqueueSnackbar } = useAppSnackbar();

  useEffect(() => {
    if (data) {
      const _rows: Row[] = [];
      data.forEach((system: SystemAdmin) => {
        _rows.push({
          id: system.hsaiGuid,
          alias: system.hsaiSystem?.systemAlias,
          system_name: system.hsaiSystem?.sytemFullName,
          contact_email: system.hsaiUser?.email,
          contact_name: system.hsaiUser?.practiceName,
          contact_phone: system.hsaiUser?.phone,
          hsai_system: system.hsaiSystem,
          hsaiUser: system.hsaiUser,
        });
      });
      setRows(_rows);
      setCount(total!);
    }
  }, [data, dataTablePage, total]);
  const [nameText, setNameText] = useState<string | null>(null);
  // const [emailText, setEmailText] = useState<string | null>(null);
  const debouncer = useRef(useDebouncer(500));
  const dispatch = useAppDispatch();

  useEffect(() => {
    debouncer.current(() => {
      dispatch(
        setSystemFilter({
          email: nameText ?? "",
          name: nameText ?? "",
          alias: filter?.alias ?? "",
        })
      );
    });
  }, [dispatch, filter, nameText]);
  // useEffect(() => {
  //   debouncer.current(() => {
  //     if (filter?.email !== emailText) {
  //       setEmailText(filter?.email ?? null);
  //     }
  //   });
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [filter]);
  useEffect(() => {
    if (filter?.name !== nameText) {
      setNameText(filter?.name ?? null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filter]);

  useEffect(() => {
    debouncer.current(() => {
      if (dataTablePage !== page) {
        setPage(dataTablePage);
      }
    });
  }, [dataTablePage, page]);

  const [deleteSystem] = useDeleteSystemMutation();

  return (
    <>
      <DataTable
        nonce={nonce}
        searchValue={nameText}
        onSearchChange={setNameText}
        searchPlaceholder="Search by name or email"
        titleBar={<div></div>}
        onRowsDelete={async (rowsDeleted, setLoading) => {
          const confirmDelete = await confirm({
            title: "Delete Systems",
            message: "Are you sure you want to delete the selected systems?",
            allowCancel: true,
          });
          if (!confirmDelete) {
            return false;
          }
          setLoading(true);
          const systems = rowsDeleted
            .map((row) => {
              return row.data.map((system) => {
                return {
                  hsaiGuid: system.id!,
                  hsaiSystem: system.hsai_system!,
                  hsaiUser: system.hsaiUser!,
                  user: system.hsaiUser?.email!,
                };
              });
            })
            .flat();
          const res = await deleteSystem({
            data: systems,
            axios,
          });
          setLoading(false);
          if ("error" in res) {
            let message = "Error deleting Systems";
            const error = res.error as any;
            if ("data" in error) {
              message = error.data;
            }
            enqueueSnackbar(message, "error");
            return false;
          } else {
            enqueueSnackbar("Systems deleted", "success");
            return true;
          }
        }}
        error={error}
        columns={columns}
        loading={isLoading || isFetching}
        onNextPage={(page) => {
          setDataTablePage(page);
        }}
        // searchKey={searchText}
        // searchValue={searchText}
        paginationModel={{
          page: dataTablePage,
          totalCount: count,
          data: rows,
        }}
        // onFilterDialog={() => setFilterDialogOpen(true)}
        actions={(params) => {
          return (
            <div>
              <IconButton
                id={`edit-${params.rowIndex}`}
                onClick={() => {
                  const data = params.tableData[params.rowIndex];
                  const route = `/systems/edit/${data.id}/`;
                  router.push(route);
                }}>
                <Edit></Edit>
              </IconButton>
              <LoadingIconButton
                id={`delete-${params.rowIndex}`}
                onClick={async (setLoading) => {
                  const data = params.tableData![params.rowIndex] as Row;

                  const confirmDelete = await confirm({
                    title: "Delete System",
                    message: "Are you sure you want to delete this system?",
                    allowCancel: true,
                  });
                  if (confirmDelete) {
                    setLoading(true);
                    const res = await deleteSystem({
                      data: [
                        {
                          hsaiGuid: data.id!,
                          hsaiSystem: data.hsai_system!,
                          hsaiUser: data.hsaiUser!,
                          user: data.hsaiUser?.email!,
                        },
                      ],

                      axios,
                    });
                    if ("error" in res) {
                      let message = "Error deleting system";
                      const error = res.error as any;
                      console.log("Error", error);
                      if ("data" in error) {
                        console.log("Error.data", error.data);
                        message = error.data;
                      }
                      enqueueSnackbar(message, "error");
                    } else {
                      enqueueSnackbar("System deleted", "success");
                    }
                    setLoading(false);
                  }
                }}>
                <DeleteForever></DeleteForever>
              </LoadingIconButton>
            </div>
          );
        }}></DataTable>
      {/* <SystemFilter
        dialogOpen={filterDialogOpen}
        setDialogOpen={setFilterDialogOpen}></SystemFilter> */}
    </>
  );
}
