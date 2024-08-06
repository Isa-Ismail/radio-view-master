"use client";
import DataTable from "@/app/components/DataTable";
import LoadingIconButton from "@/app/components/LoadingIconButton";
import { SiteAdmin } from "@/models/site";
import { selectAuth } from "@/store/auth/authSlice";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { useDeleteSiteMutation, useGetSiteDataQuery } from "@/store/site/siteApi";
import { SitesFilterProps, selectSite, setSiteFilter } from "@/store/site/siteSlice";

import SystemPicker from "@/app/components/SystemPicker";
import { useClientAxiosClient } from "@/hooks/axios";
import useConfirm from "@/hooks/confirm";
import useDebouncer from "@/hooks/debounce";
import { useAppSnackbar } from "@/hooks/snackbar";
import { HsaiUser } from "@/models/hsai_user";
import { getValidAuthTokens } from "@/utils/cookie";
import { DeleteForever, Edit } from "@mui/icons-material";
import { IconButton } from "@mui/material";
import { MUIDataTableColumnDef } from "mui-datatables";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

const columns: MUIDataTableColumnDef[] = [
  {
    name: "full_name",
    label: "Site Name",
  },
  {
    name: "alias",
    label: "Site Alias",
  },
  {
    name: "site_country",
    label: "Site Country",
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

type Row = {
  id: string;
  hsaiguid?: string;
  alias?: string;
  system?: string;
  full_name?: string;
  contact_name?: string;
  contact_phone?: string;
  contact_email?: string;
  hsai_user?: HsaiUser;
  systems?: string[];
  site_country?: string;
};

export default function SitesPage({ nonce }: { nonce: string }) {
  const router = useRouter();
  const { user } = useAppSelector(selectAuth);
  const { token } = getValidAuthTokens();
  const [dataTablePage, setDataTablePage] = useState(0);
  const [page, setPage] = useState(0);

  const { filter } = useAppSelector(selectSite);
  useEffect(() => {
    setDataTablePage(0);
  }, [filter]);
  const axios = useClientAxiosClient();
  const { data, total } = useAppSelector((state) => state.site);

  const { isLoading, isFetching, error } = useGetSiteDataQuery(
    {
      token: token ?? "",
      limit: 10,
      offset: page,
      systemId: user?.systemId,
      filter: filter,
      axios,
    },
    {
      refetchOnMountOrArgChange: true,
      refetchOnFocus: false,
    }
  );
  // const { data, total } = siteData ?? { data: [], total: 0 };

  const [rows, setRows] = useState<Row[]>([]);
  const [count, setCount] = useState<number>(0);
  const [filterDialogOpen, setFilterDialogOpen] = useState<boolean>(false);

  useEffect(() => {
    if (data && total) {
      const _rows: Row[] = [];
      data.forEach((site: SiteAdmin) => {
        let systemText = "";
        let systems = site.systems!.map((system) => system.systemAlias);
        if (systems.length > 3) {
          systems = systems.slice(0, 3);
          systemText = systems.join(", ") + `+${site.systems!.length - 3}`;
        } else {
          systemText = systems.join(", ");
        }
        _rows.push({
          id: site.siteId!,
          hsaiguid: site.hsaiGuid,
          alias: site.siteAlias,
          contact_email: site.hsaiUser?.email,
          contact_name: site.hsaiUser?.firstName + " " + site.hsaiUser?.lastName,
          contact_phone: site.hsaiUser?.phone,
          system: systemText,
          full_name: site.siteName,
          hsai_user: site.hsaiUser,
          systems: site.systems!.map((system) => system.systemGuid!),
          site_country: site.country,
        });
      });
      setRows(_rows);
      setCount(total);
    } else {
      setRows([]);
      setCount(0);
    }
  }, [data, total]);
  const confirm = useConfirm();
  const { enqueueSnackbar } = useAppSnackbar();
  const [searchText, setSearchText] = useState<string | null>(null);
  const debouncer = useRef(useDebouncer(500));
  const dispatch = useAppDispatch();

  useEffect(() => {
    debouncer.current(() => {
      dispatch(
        setSiteFilter({
          // email: filter?.email ?? "",
          email: searchText ?? "",
          name: searchText ?? "",
          alias: filter?.alias ?? "",
          system: filter?.system ?? undefined,
        })
      );
    });
  }, [dispatch, filter, searchText]);

  useEffect(() => {
    if (filter?.name !== searchText) {
      setSearchText(filter?.name ?? null);
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

  const [filterHighlighted, setFilterHighlighted] = useState(false);

  useEffect(() => {
    const emailChanged =
      filter?.email !== "" && filter?.email !== null && filter?.email !== undefined;
    const systemChanged = filter?.system !== undefined;

    setFilterHighlighted(emailChanged || systemChanged);
  }, [filter]);

  const [deleteSite] = useDeleteSiteMutation();

  return (
    <>
      <DataTable
        nonce={nonce}
        highlightFilter={filterHighlighted}
        titleBar={
          <SystemPicker
            nonce={nonce}
            value={filter?.system}
            onChanged={(system) => {
              dispatch(
                setSiteFilter({
                  ...filter,
                  system: system,
                } as SitesFilterProps)
              );
            }}></SystemPicker>
        }
        onSearchChange={setSearchText}
        searchValue={searchText}
        searchPlaceholder="Search by name or email"
        onRowsDelete={async (rowsDeleted, setLoading) => {
          const confirmDelete = await confirm({
            title: "Delete Sites",
            message: "Are you sure you want to delete the selected sites?",
            allowCancel: true,
          });
          if (!confirmDelete) {
            return false;
          }
          setLoading(true);
          const sites = rowsDeleted
            .map((row) => {
              return row.data.map((site) => {
                return {
                  email: site.contact_email!,
                  hsaiGuid: site.hsaiguid!,
                  profile_id: site.hsai_user!.profileId!,
                  siteId: site.id,
                  systems: site.systems!,
                };
              });
            })
            .flat();
          const res = await deleteSite({
            data: sites,
            axios,
          });
          setLoading(false);
          if ("error" in res) {
            let message = "Error deleting Sites";
            const error = res.error as any;
            if ("data" in error) {
              message = error.data;
            }
            enqueueSnackbar(message, "error");
            return false;
          } else {
            enqueueSnackbar("Sites deleted", "success");
            return true;
          }
        }}
        error={error}
        columns={columns}
        onNextPage={setDataTablePage}
        loading={isLoading || isFetching}
        paginationModel={{
          totalCount: count,
          data: rows,
          page: dataTablePage,
        }}
        haveExpandableRow={true}
        expandableColumns={[
          {
            name: "system_name",
            label: "System Name",
          },
          {
            name: "system_alias",
            label: "System Alias",
          },
        ]}
        expandableRows={(index) => {
          return data![index]?.systems!.map?.((system) => {
            return {
              id: system.systemGuid,
              system_name: system.sytemFullName,
              system_alias: system.systemAlias,
            };
          });
        }}
        // onFilterDialog={() => setFilterDialogOpen(true)}
        actions={(params) => (
          <div>
            <IconButton
              id={`edit-${params.rowIndex}`}
              onClick={() => {
                const data = params.tableData[params.rowIndex];

                router.push(`/sites/edit/${data.hsaiguid}`);
              }}>
              <Edit></Edit>
            </IconButton>
            <LoadingIconButton
              id={`delete-${params.rowIndex}`}
              onClick={async (setLoading) => {
                const site = params.tableData![params.rowIndex] as Row;

                const confirmDelete = await confirm({
                  title: "Delete Site",
                  message: "Are you sure you want to delete this site?",
                  allowCancel: true,
                });
                if (confirmDelete) {
                  setLoading(true);
                  const res = await deleteSite({
                    data: [
                      {
                        email: site.contact_email!,
                        hsaiGuid: site.hsaiguid!,
                        profile_id: site.hsai_user!.profileId!,
                        siteId: site.id,
                        systems: site.systems!,
                      },
                    ],

                    axios,
                  });
                  if ("error" in res) {
                    let message = "Error deleting site";
                    const error = res.error as any;
                    console.log("Error", error);
                    if ("data" in error) {
                      console.log("Error.data", error.data);
                      message = error.data;
                    }
                    enqueueSnackbar(message, "error");
                  } else {
                    enqueueSnackbar("Site deleted", "success");
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
