import { DataGrid } from "@mui/x-data-grid";
import { Alert } from "@mui/material";
import { useState } from "react";
import styles from "./table.module.css";

const Table = ({
  rows,
  columns,
  getRowId,
  getRowHeight,
  rowsPerPage = 10,
  page = 0,
  onPageChange = null,
  loading = false,
  error = null,
  messages = {
    noRowsLabel: "No data available",
    loadingLabel: "Loading...",
  },
}) => {
  const [paginationModel, setPaginationModel] = useState({
    page,
    pageSize: rowsPerPage,
  });

  if (error) {
    return <Alert severity="error">{error.message}</Alert>;
  }

  const handlePaginationModelChange = (model) => {
    onPageChange ? onPageChange(model.page) : setPaginationModel(model);
  };

  return (
    <div className={styles.tableContainer}>
      <DataGrid
        rows={loading ? [] : rows}
        columns={columns}
        getRowId={getRowId}
        getRowHeight={getRowHeight}
        loading={loading}
        paginationModel={paginationModel}
        onPaginationModelChange={handlePaginationModelChange}
        pageSizeOptions={[rowsPerPage]}
        disableColumnMenu
        localeText={{
          noRowsLabel: loading ? messages.loadingLabel : messages.noRowsLabel,
        }}
        sx={{
          "& .MuiDataGrid-row": {
            minHeight: "65px !important",
            maxHeight: "65px !important",
          },
          "& .MuiDataGrid-cell": {
            minHeight: "65px !important",
            maxHeight: "65px !important",
            display: "flex",
            alignItems: "center",
          },
          "& .MuiDataGrid-columnHeaders": {
            backgroundColor: "#F7F7F9",
            borderBottom: "1px solid #E0E0E0",
          },
        }}
      />
    </div>
  );
};

export default Table;
