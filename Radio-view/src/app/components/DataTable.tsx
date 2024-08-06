"use client";
import {
  Alert,
  CircularProgress,
  LinearProgress,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Toolbar,
  Typography,
  styled,
} from "@mui/material";
import { GridRowParams } from "@mui/x-data-grid";
import MUIDataTable, {
  MUIDataTableColumnDef,
  MUIDataTableMeta,
  MUIDataTableOptions,
} from "mui-datatables";
import { useCallback, useEffect, useState } from "react";
import AppButton from "./Button";
import { StyledTextField } from "./Input";
type PaginationModel<T> = {
  totalCount: number;
  data: T[];
  page: number;
};

export const StyledTableHead = styled(TableCell)(({ theme }) => ({
  // backgroundColor: theme.palette.background.default,
  // color: theme.palette.common.white,
  // padding: 8,
  fontWeight: "bold",
  fontSize: "1rem",
}));

export default function DataTable<T extends {}>({
  columns,
  actions,
  pageSize = 10,
  onRowClick,
  loading = false,
  paginationModel,
  onNextPage,
  error,
  expandableRows,
  expandableColumns,
  haveExpandableRow,
  onFilterDialog,
  serverSidePagination = true,
  isRowExpandable,
  onSearchChange,
  searchPlaceholder,
  searchValue,
  highlightFilter,

  onRowsDelete,
  titleBar,
  allowSelect = true,
  nonce,
}: {
  columns: MUIDataTableColumnDef[];
  actions?: (params: MUIDataTableMeta) => React.ReactNode;
  pageSize?: number;
  onRowClick?: (params: GridRowParams<any>) => void;
  loading?: boolean;
  paginationModel?: PaginationModel<T>;
  onNextPage?: (page: number) => void;
  error?: any;
  expandableRows?: (index: number) => any[];
  expandableColumns?: MUIDataTableColumnDef[];
  haveExpandableRow?: boolean;
  onFilterDialog?: () => void;

  serverSidePagination?: boolean;
  isRowExpandable?: (dataIndex: number, expandedRows: any) => boolean;
  onSearchChange?: (searchText: string | null) => void;
  searchPlaceholder?: string;
  searchKey?: string | null;
  searchValue?: string | null;
  highlightFilter?: boolean;
  // rowsSelected?: { page: number; data: T[] }[];

  onRowsDelete?: (
    rowsDeleted: {
      page: number;
      data: T[];
    }[],
    setLoading: (loading: boolean) => void
  ) => Promise<boolean>;
  selectToolbar?: React.ReactNode;
  titleBar?: React.ReactNode;
  allowSelect?: boolean;
  nonce: string;
}) {
  let _columns = columns;
  const columnsContainsActions = columns.find((column) => {
    if (typeof column === "string") {
      return column === "actions";
    }
    return column.name === "actions";
  });
  if (actions && !columnsContainsActions) {
    columns.push({
      label: "Actions",
      name: "actions",
      options: {
        filter: false,
        sort: false,
        empty: true,
        setCellProps: () => ({
          style: {
            minWidth: "100px",
            maxWidth: "300px",
            justifyContent: "start",
          },
        }),
        customBodyRender: (value, tableMeta, updateValue) => {
          return actions(tableMeta);
        },
      },
    });
  }
  _columns = _columns.map((column) =>
    Object.assign({}, column, { resizable: true })
  );

  const [selectedRows, setSelectedRows] = useState<number[]>([]);
  const [rowsSelected, setRowsSelected] = useState<
    {
      page: number;
      data: T[];
    }[]
  >([]);

  const caclulateSelectedRows = useCallback(() => {
    if (loading) {
      return;
    }

    if (rowsSelected === undefined || rowsSelected.length === 0) {
      if (selectedRows.length > 0) {
        setSelectedRows([]);
      }
      return;
    }
    const selected = rowsSelected!.find(
      (row) => row.page === paginationModel?.page
    );
    if (selected) {
      const _rowsSelected: number[] = [];
      selected.data.forEach((data) => {
        const index = paginationModel?.data.findIndex((row) => {
          if ("id" in row && "id" in data) {
            return row.id === data.id;
          }
          return false;
        });
        if (index !== -1 && index !== undefined) {
          _rowsSelected.push(index);
        }
      });
      setSelectedRows(_rowsSelected);
    } else {
      if (selectedRows.length > 0) {
        setSelectedRows([]);
      }
    }
  }, [loading, paginationModel, rowsSelected, selectedRows]);
  useEffect(() => {
    if (loading) {
      return;
    }
    /// Delay to wait for the data to be rendered
    setTimeout(() => {
      caclulateSelectedRows();
    }, 500);
  }, [caclulateSelectedRows, loading]);
  const options: MUIDataTableOptions = {
    sort: false,
    count: paginationModel?.totalCount ?? 0,
    selectableRowsHeader: false,
    selectToolbarPlacement: "none",

    selectableRows: allowSelect === true ? "multiple" : "none",
    // selectableRows: "none",
    download: false,
    responsive: "standard",
    fixedHeader: false,
    page: paginationModel?.page ?? 0,
    print: false,
    rowsPerPage: pageSize,
    rowsPerPageOptions: [pageSize],
    filter: false,

    search: false,
    filterType: "textField",
    rowsSelected: selectedRows,

    onRowSelectionChange: (
      currentRowsSelected,
      allRowsSelected,
      selectedData
    ) => {
      const dataTablePage = paginationModel?.page ?? 0;
      const rows = paginationModel?.data ?? [];
      const selected = {
        page: dataTablePage,
        data: selectedData!.map((row) => rows![row]),
      };

      const prevSelected = rowsSelected;
      const page = dataTablePage;
      const index = prevSelected.findIndex((row) => row.page === page);
      if (index !== -1) {
        if (selected.data.length === 0) {
          prevSelected.splice(index, 1);
        } else {
          prevSelected[index] = selected;
        }
      } else {
        if (selected.data.length > 0) {
          prevSelected.push(selected);
        }
      }
      setRowsSelected(prevSelected);
      caclulateSelectedRows();
    },
    // search: false,
    viewColumns: false,

    onChangePage: (currentPage) => {
      if (onNextPage) {
        onNextPage(currentPage);
      }
    },
    isRowExpandable: isRowExpandable,

    serverSide: serverSidePagination,
    expandableRows: haveExpandableRow,
    expandableRowsHeader: false,

    renderExpandableRow: haveExpandableRow
      ? (rowData, rowMeta) => {
          const index = rowMeta.dataIndex;
          const rows = expandableRows!(index);
          return (
            <tr>
              <td colSpan={rowData.length + 1}>
                <TableContainer
                  component={Paper}
                  nonce={nonce}
                  className="pl-32 pr-32"
                >
                  <Table nonce={nonce}>
                    <TableHead nonce={nonce}>
                      <TableRow nonce={nonce}>
                        {rows?.length === 0 ? (
                          <TableRow nonce={nonce}>
                            <StyledTableHead
                              nonce={nonce}
                              colSpan={(expandableColumns?.length ?? 0) + 1}
                              className="text-center"
                            >
                              No data
                            </StyledTableHead>
                          </TableRow>
                        ) : (
                          expandableColumns?.map((column) => {
                            let id: string;
                            let label: string;
                            if (typeof column === "string") {
                              id = column;
                              label = column;
                            } else {
                              id = column.name;
                              label = column.label!;
                            }
                            return (
                              <StyledTableHead
                                key={id}
                                nonce={nonce}
                                sx={{
                                  maxWidth: "50px",
                                }}
                              >
                                {label}
                              </StyledTableHead>
                            );
                          })
                        )}
                      </TableRow>
                    </TableHead>
                    <TableBody nonce={nonce}>
                      {rows?.map((row) => (
                        <TableRow key={row.id} nonce={nonce}>
                          {/* <TableCell></TableCell> */}
                          {expandableColumns?.map((column) => {
                            let id: string;
                            let label: string;
                            if (typeof column === "string") {
                              id = column;
                              label = column;
                            } else {
                              id = column.name;
                              label = column.label!;
                            }
                            return (
                              <TableCell
                                align="left"
                                key={id}
                                nonce={nonce}
                                sx={{
                                  maxWidth: "50px",
                                }}
                              >
                                {row[id as keyof typeof row]}
                              </TableCell>
                            );
                          })}
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </td>
            </tr>
          );
        }
      : undefined,

    onCellClick: (colData, cellMeta) => {
      if (onRowClick) {
        // onRowClick(cellMeta);
      }
    },
    customFooter: paginationModel?.data.length === 0 ? () => <></> : undefined,

    textLabels: {
      body: {
        noMatch: loading ? (
          <CircularProgress nonce={nonce} />
        ) : (
          "Sorry, there is no matching data to display"
        ),
      },
    },
  };
  let _error = "";
  if (error) {
    if (error instanceof Error) {
      _error = error.toString();
    } else if (typeof error === "string") {
      _error = error;
    } else if (typeof error === "object") {
      const errorObject = error as any;
      const errorArray = errorObject.error as any[];
      if (errorArray && errorArray.length > 0) {
        _error = errorArray[0].message;
      } else {
        _error = "An error has occurred. Please try again later.";
      }
    } else {
      _error = "An error has occurred. Please try again later.";
    }
  }

  const [deleteButtonLoading, setDeleteButtonLoading] = useState(false);

  return (
    <>
      <div className="p-4 flex items-center align-middle justify-between bg-[#1C1D1F]">
        {/* {onFilterDialog ? (
          

        ) : !titleBar ? (
          <div></div>
        ) : null} */}
        {onFilterDialog || titleBar ? (
          <div className="flex gap-2">
            {onFilterDialog && (
              <AppButton
                nonce={nonce}
                variant={highlightFilter ? "contained" : "outlined"}
                color="primary"
                onClick={
                  loading
                    ? undefined
                    : () => {
                        if (onFilterDialog) {
                          onFilterDialog();
                        }
                      }
                }
              >
                Filter
              </AppButton>
            )}
            {titleBar}
          </div>
        ) : null}

        {onSearchChange && (
          <StyledTextField
            label={searchPlaceholder}
            size="small"
            inputProps={{
              "aria-label": "controlled",
            }}
            nonce={nonce}
            sx={{ width: 300 }}
            value={searchValue}
            onChange={(e) => {
              onSearchChange(e.target.value);
            }}
          />
        )}
      </div>

      <TableContainer nonce={nonce} sx={{ width: "100%" }}>
        {error ? (
          <Alert
            nonce={nonce}
            severity="error"
            sx={{
              borderRadius: "8px",
            }}
          >
            {_error}
          </Alert>
        ) : (
          <>
            {rowsSelected?.length === 0 || rowsSelected === undefined ? (
              <></>
            ) : (
              <Toolbar className="bg-black" nonce={nonce}>
                <div className="flex items-center justify-between w-full">
                  <Typography variant="h6" nonce={nonce}>
                    {rowsSelected!.reduce(
                      (acc, row) => acc + row.data.length,
                      0
                    )}{" "}
                    row(s) selected
                  </Typography>

                  <AppButton
                    nonce={nonce}
                    loading={deleteButtonLoading}
                    variant="contained"
                    onClick={async (_) => {
                      const shouldDelete = await onRowsDelete!(
                        rowsSelected!,
                        setDeleteButtonLoading
                      );

                      if (shouldDelete) {
                        setSelectedRows([]);
                        setRowsSelected([]);
                      }
                    }}
                  >
                    Delete
                  </AppButton>
                </div>
              </Toolbar>
            )}
            {loading && (paginationModel?.data.length ?? 0) >= 1 && (
              <LinearProgress nonce={nonce} color="primary" />
            )}
            <MUIDataTable
              title={null}
              data={paginationModel?.data!}
              options={options}
              columns={columns}
            />
          </>
        )}
      </TableContainer>
    </>
  );
}
