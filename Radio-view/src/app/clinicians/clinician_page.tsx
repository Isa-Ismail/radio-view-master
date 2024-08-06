"use client";
import DataTable from "@/app/components/DataTable";
import LoadingIconButton from "@/app/components/LoadingIconButton";
import SitePicker from "@/app/components/SitePicker";
import SystemPicker from "@/app/components/SystemPicker";
import { Site } from "@/models/site";
import { HsaiSystem } from "@/models/system";
import { selectAuth } from "@/store/auth/authSlice";
import { useDeleteClinicianMutation, useGetDataQuery } from "@/store/clinician/clinicianApi";
import {
  ClinicianFilterProps,
  selectClinician,
  setClinicianFilter,
} from "@/store/clinician/clinicianSlice";
import { useAppDispatch, useAppSelector } from "@/store/hooks";

import { useClientAxiosClient } from "@/hooks/axios";
import useConfirm from "@/hooks/confirm";
import useDebouncer from "@/hooks/debounce";
import { useAppSnackbar } from "@/hooks/snackbar";
import { getValidAuthTokens } from "@/utils/cookie";
import { DeleteForever, Edit } from "@mui/icons-material";
import { IconButton } from "@mui/material";
import { MUIDataTableColumnDef } from "mui-datatables";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

export type Row = {
  id: string;
  first_name?: string;
  last_name?: string;
  phone?: string;
  email?: string;
  hsai_guid: string;
  systems: HsaiSystem[];
  sites: Site[];
  selected?: boolean;
};

const columns: MUIDataTableColumnDef[] = [
  {
    name: "first_name",
    label: "First Name",
  },
  {
    name: "last_name",
    label: "Last Name",
  },
  {
    name: "phone",
    label: "Phone",
  },
  {
    name: "email",
    label: "Email",
  },
];

export default function ClinicianPage({ nonce }: { nonce: string }) {
  const router = useRouter();
  const { token } = getValidAuthTokens();
  const { user } = useAppSelector(selectAuth);
  const [dataTablePage, setDataTablePage] = useState(0);
  const [page, setPage] = useState(0);
  const [count, setCount] = useState<number>(0);
  const [rows, setRows] = useState<Row[]>([]);
  const { filter } = useAppSelector(selectClinician);
  useEffect(() => {
    setDataTablePage(0);
  }, [filter]);
  const axios = useClientAxiosClient();
  const { isLoading, isFetching, error } = useGetDataQuery(
    {
      limit: 10,
      offset: page,
      token: token ?? "",
      siteId: user?.siteId,
      systemId: user?.systemId,
      filter: filter,
      axios,
    },
    {
      refetchOnMountOrArgChange: true,
      refetchOnFocus: false,
    }
  );
  const { data, total } = useAppSelector(selectClinician);

  const confirm = useConfirm();
  const { enqueueSnackbar } = useAppSnackbar();
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (data) {
      const _rows: Row[] = [];
      data.forEach((row) => {
        _rows.push({
          id: row.id,
          hsai_guid: row.hsaiGuid,
          email: row.email,
          first_name: row.firstName,
          last_name: row.lastName,
          phone: row.phoneNumber,
          systems: row.systemIds,
          sites: row.sites,
        });
      });
      setRows(_rows);
      setCount(total!);
    } else {
      setRows([]);
      setCount(0);
    }
  }, [data, total]);
  const [searchText, setSearchText] = useState<string | null>(null);
  const debouncer = useRef(useDebouncer(500));

  useEffect(() => {
    debouncer.current(() => {
      dispatch(
        setClinicianFilter({
          ...filter,
          email: searchText ?? "",
          name: searchText ?? "",
        })
      );
    });
  }, [dispatch, filter, searchText]);

  useEffect(() => {
    debouncer.current(() => {
      if (page !== dataTablePage) {
        setPage(dataTablePage);
      }
    });
  }, [dataTablePage, page]);

  const [deleteClinician] = useDeleteClinicianMutation();

  const [selectedRows, setSelectedRows] = useState<
    {
      page: number;
      data: Row[];
    }[]
  >([]);

  return (
    <>
      <DataTable
        nonce={nonce}
        onSearchChange={setSearchText}
        searchKey={searchText}
        searchValue={searchText}
        searchPlaceholder="Search by name or email"
        titleBar={
          <div className="flex gap-4">
            <SystemPicker
              nonce={nonce}
              onChanged={(system) => {
                dispatch(
                  setClinicianFilter({
                    ...filter,
                    systemId: system,
                    siteId: undefined,
                  } as ClinicianFilterProps)
                );
              }}
              value={filter?.systemId}></SystemPicker>
            <SitePicker
              nonce={nonce}
              systemId={filter?.systemId?.id}
              onChanged={(site) => {
                dispatch(
                  setClinicianFilter({
                    ...filter,
                    siteId: site,
                  } as ClinicianFilterProps)
                );
              }}
              key={filter?.siteId?.id}
              value={filter?.siteId}></SitePicker>
          </div>
        }
        onRowsDelete={async (rowsDeleted, setLoading) => {
          const confirmDelete = await confirm({
            title: "Delete Clinicians",
            message: "Are you sure you want to delete the selected clinicians?",
            allowCancel: true,
          });
          if (!confirmDelete) {
            return false;
          }
          setLoading(true);
          const clinicians = rowsDeleted
            .map((row) => {
              return row.data.map((clinician) => {
                return {
                  hsai_guid: clinician.hsai_guid,
                  profile_id: clinician.id,
                  email: clinician.email!,
                };
              });
            })
            .flat();
          const res = await deleteClinician({
            data: clinicians,
            axios,
          });
          setLoading(false);
          if ("error" in res) {
            let message = "Error deleting clinicians";
            const error = res.error as any;
            if ("data" in error) {
              message = error.data;
            }
            enqueueSnackbar(message, "error");
            return false;
          } else {
            enqueueSnackbar("Clinicians deleted", "success");
            return true;
          }
        }}
        error={error}
        columns={columns}
        loading={isLoading || isFetching}
        onNextPage={setDataTablePage}
        paginationModel={{
          data: rows,
          page: dataTablePage,
          totalCount: count,
        }}
        haveExpandableRow={true}
        expandableColumns={[
          {
            name: "site_name",
            label: "Site Name",
          },
          {
            name: "site_alias",
            label: "Site Alias",
          },
          {
            name: "system",
            label: "System",
          },
        ]}
        expandableRows={(index) => {
          return data![index]?.sites?.map((site) => {
            return {
              id: site.id,
              site_name: site.name,
              site_alias: site.alias,
              system: site.system,
            };
          });
        }}
        // onFilterDialog={() => setFilterDialogOpen(true)}

        actions={(params) => (
          <div>
            <IconButton
              id={`edit-${params.rowIndex}`}
              onClick={() => {
                const data = params.tableData[params.rowIndex] as Row;
                router.push(`/clinicians/edit/${data.hsai_guid}`);
              }}>
              <Edit></Edit>
            </IconButton>
            <LoadingIconButton
              id={`delete-${params.rowIndex}`}
              onClick={async (setLoading) => {
                const clinician = params.tableData![params.rowIndex];

                const confirmDelete = await confirm({
                  title: "Delete Clinician",
                  message: "Are you sure you want to delete this clinician?",
                  allowCancel: true,
                });
                if (confirmDelete) {
                  setLoading(true);
                  const res = await deleteClinician({
                    data: [
                      {
                        hsai_guid: clinician.hsai_guid,
                        profile_id: clinician.id,
                        email: clinician.email!,
                      },
                    ],

                    axios,
                  });
                  if ("error" in res) {
                    let message = "Error deleting clinician";
                    const error = res.error as any;
                    console.log("Error", error);
                    if ("data" in error) {
                      console.log("Error.data", error.data);
                      message = error.data;
                    }
                    enqueueSnackbar(message, "error");
                  } else {
                    // const index = rows.findIndex((row) => row.id === clinician.id);
                    // if (index !== -1) {
                    //   rows.splice(index, 1);
                    //   setRows([...rows]);
                    //   setCount(count - 1);
                    // }
                    // dispatch(deleteClinicianById(clinician.id));

                    enqueueSnackbar("Clinician deleted", "success");
                  }
                  setLoading(false);
                }
              }}>
              <DeleteForever></DeleteForever>
            </LoadingIconButton>
          </div>
        )}></DataTable>
    </>
  );
}
