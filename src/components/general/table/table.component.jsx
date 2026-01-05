import styles from "./table.module.css";
import { DataGrid } from "@mui/x-data-grid";
import { Alert } from "@mui/material";
import { useState } from "react";

const Table = ({
  rows,
  columns,
  onRowClick = null,
  getRowId,
  rowsPerPage = 10,
  totalRows = 0,
  page = 0,
  onPageChange = null,
  loading = false,
  error = null,
  messages = {
    noRowsLabel: "no objectives were submitted",
    loadingLabel: "Loading...",
  },
}) => {
  // Local state for client-side pagination
  const [paginationModel, setPaginationModel] = useState({
    page: page,
    pageSize: rowsPerPage,
  });

  // If there's an error, display an alert
  if (error) {
    return (
      <Alert severity="error" className={styles.errorAlert}>
        {error.message || "An error occurred while loading data"}
      </Alert>
    );
  }

  // When loading, provide a stable empty dataset to prevent reflows
  const tableRows = loading ? [] : rows || [];

  // Handle pagination model change
  const handlePaginationModelChange = (newModel) => {
    if (onPageChange) {
      // Server-side pagination
      onPageChange(newModel.page);
    } else {
      // Client-side pagination
      setPaginationModel(newModel);
    }
  };

  return (
    <div className={styles.tableContainer}>
      <DataGrid
        getRowId={getRowId}
        rows={tableRows}
        columns={columns}
        rowCount={loading ? 0 : totalRows || tableRows.length}
        paginationMode={onPageChange ? "server" : "client"}
        paginationModel={
          onPageChange ? { page, pageSize: rowsPerPage } : paginationModel
        }
        onPaginationModelChange={handlePaginationModelChange}
        pageSizeOptions={[rowsPerPage]}
        localeText={{
          noRowsLabel: loading ? messages.loadingLabel : messages.noRowsLabel,
        }}
        loading={loading}
        autoHeight
        disableColumnMenu
        slotProps={{
          loadingOverlay: {
            variant: "skeleton",
            noRowsVariant: "skeleton",
          },
        }}
        onRowClick={onRowClick}
        disableSelectionOnClick={!onRowClick} // Disable row selection if onRowClick is not provided
        isRowSelectable={() => !!onRowClick} // Disable row selection if onRowClick is not provided
        getRowClassName={(params) => (onRowClick ? styles.clickableRow : "")} // Conditionally apply CSS class to rows
        sx={{
          "& .MuiDataGrid-row:hover": {
            cursor: onRowClick ? "pointer" : "default",
          },
          "& .MuiDataGrid-columnHeader": {
            cursor: "default",
          },
        }}
      />
    </div>
  );
};

export default Table;
