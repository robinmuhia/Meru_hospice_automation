import React, { useState } from "react";
import { useGetDashboardQuery } from "state/api";
import { useSelector } from "react-redux";
import { Box, useTheme } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import DataGridCustomToolbar from "components/DataGridCustomToolbar";
import Header from "components/Header";

const Dashboard = () => {
  const theme = useTheme();
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(20);
  const [search, setSearch] = useState("");

  const [searchInput, setSearchInput] = useState("");
  const userId = useSelector((state) => state.global.user.id);
  const { data, isLoading } = useGetDashboardQuery({
    id: userId,
    page,
    pageSize,
    search,
  });

  const columns = [
    {
      field: "id",
      headerName: "Patient ID",
      sortable: false,
      filterable: false,
      flex: 0.5,
    },
    {
      field: "name",
      headerName: "Patient name",
      sortable: false,
      filterable: false,
      flex: 0.5,
    },
    {
      field: "phone_number",
      headerName: "Phone Number",
      sortable: false,
      filterable: false,
      flex: 0.5,
      renderCell: (params) => `0${Number(params.value)}`,
    },
    {
      field: "age",
      headerName: "Age in years",
      flex: 0.6,
      filterable: false,
      sortable: false,
      renderCell: (params) =>
        `${Number(Math.floor(params.value / 12))} years ${Number(
          params.value % 12
        )} months`,
    },
    {
      field: "created_at",
      headerName: "Last Visit",
      flex: 0.5,
      filterable: false,
      renderCell: (params) => params.value.slice(0, 10),
    },
    {
      field: "num_images",
      headerName: "Number of cards in system",
      sortable: false,
      filterable: false,
      flex: 0.5,
    },
  ];

  return (
    <Box m="1.5rem 2.5rem">
      <Header
        title="All Patients"
        subtitle="List of all Current Patients in the System"
      />
      <Box
        height="80vh"
        marginTop="10px"
        sx={{
          "& .MuiDataGrid-root": {
            border: "none",
          },
          "& .MuiDataGrid-cell": {
            borderBottom: "none",
          },
          "& .MuiDataGrid-columnHeaders": {
            backgroundColor: theme.palette.background.alt,
            color: theme.palette.secondary[100],
            borderBottom: "none",
          },
          "& .MuiDataGrid-virtualScroller": {
            backgroundColor: theme.palette.neutral.main,
          },
          "& .MuiDataGrid-footerContainer": {
            backgroundColor: theme.palette.neutral.main,
            color: theme.palette.secondary.main,
            borderTop: "none",
          },
          "& .MuiDataGrid-toolbarContainer .MuiButton-text": {
            color: `${theme.palette.secondary[100]} !important`,
          },
          "& .MuiDataGrid-panelFooter .css-4rdffl-MuiDataGrid-panelFooter": {
            backgroundColor: theme.palette.background.default,
            color: theme.palette.secondary[100],
          },
        }}
      >
        <DataGrid
          loading={isLoading || !data}
          getRowId={(row) => row.id}
          rows={(data && data.patients) || []}
          columns={columns}
          rowCount={(data && data.total) || 0}
          rowsPerPageOptions={[10, 20, 30]}
          pagination
          page={page}
          pageSize={pageSize}
          paginationMode="server"
          onPageChange={(newPage) => setPage(newPage)}
          onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}
          components={{ Toolbar: DataGridCustomToolbar }}
          componentsProps={{
            toolbar: { searchInput, setSearchInput, setSearch },
          }}
        />
      </Box>
    </Box>
  );
};

export default Dashboard;
