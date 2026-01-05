import Widget from "../../components/general/widget/widget.component";
import styles from "./quartersLog.module.css";
import { getYearsArray } from "../../helpers/utilities/getYearsArray";
import { getQuarterMonths } from "../../helpers/utilities/getQuarterMonths";
import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  FormControl,
  Select,
  MenuItem,
  Box,
  IconButton,
  Tooltip,
} from "@mui/material";
import { MdOutlineCalendarToday } from "react-icons/md";
import { BsGrid3X3Gap } from "react-icons/bs";
import { FaList } from "react-icons/fa6";

import Grid from "@mui/material/Grid2";
import QuarterCard from "../../components/quarterLog/quarterCard/quarterCard.component";
import { useGetQuartersLogQuery } from "../../appState/apis/smartObjectiveApiSlice";
import MainLoader from "../../components/general/mainLoader/mainLoader.component";
import TryAgain from "../../components/general/tryAgain/tryAgain.component";
import Table from "../../components/general/table/table.component";
import StatusLabel from "../../components/general/statusLabel/statusLabel.component";
import {
  SO_STATUS,
  SO_ATCHIVEMENT_STATUS,
} from "../../settings/constants/status/smartObjective.status";
import { formatTextWithSpaces } from "../../helpers/utilities/formatTextWithSpaces";
import QuarterHeader from "../../components/general/quarterHeader/quarterHeader.component";
import { isQuarterAfterCurrent } from "../../helpers/utilities/isQuarterAfterCurrent";
import { useDispatch } from "react-redux";
import { showDrawer } from "../../appState/slices/drawerSlice";

const QuartersLog = () => {
  const [years, setYears] = useState([]);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [viewMode, setViewMode] = useState("grid"); // "grid" or "list"
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();

  // Fetch quarters log data using RTK Query
  const {
    data: quartersLogData,
    isLoading,
    isFetching,
    isError,
    error,
    refetch,
  } = useGetQuartersLogQuery({
    year: selectedYear,
    employeeId: null,
  });

  useEffect(() => {
    // Get years array starting from 2015 to current year
    const yearsArray = getYearsArray(2015);
    setYears(yearsArray);

    // Check if year is in URL params
    const searchParams = new URLSearchParams(location.search);
    const yearParam = searchParams.get("year");

    if (yearParam) {
      setSelectedYear(Number(yearParam));
    } else {
      // Set current year as default in URL if not already there
      updateYearInUrl(selectedYear);
    }
  }, [location.search]);

  const updateYearInUrl = (year) => {
    const searchParams = new URLSearchParams(location.search);
    searchParams.set("year", year);

    navigate(
      {
        pathname: location.pathname,
        search: searchParams.toString(),
      },
      { replace: true }
    );
  };

  const handleYearChange = (event) => {
    const newYear = event.target.value;
    setSelectedYear(newYear);
    updateYearInUrl(newYear);
  };

  // Helper function to get table columns
  const getTableColumns = () => [
    { field: "objective", headerName: "Objective", flex: 2, minWidth: 200 },
    {
      field: "status",
      headerName: "Status",
      flex: 1,
      minWidth: 140,
      renderCell: (params) => (
        <StatusLabel
          lable={formatTextWithSpaces(params.value)}
          color={
            SO_STATUS[params.value]?.txtColor ||
            SO_STATUS["defaultStatus"]?.txtColor
          }
          BGColor={
            SO_STATUS[params.value]?.BGColor ||
            SO_STATUS["defaultStatus"]?.BGColor
          }
          fixedSpace={true}
        />
      ),
    },
    {
      field: "submittedOn",
      headerName: "Submitted On",
      flex: 1,
      minWidth: 120,
    },
    {
      field: "achievementStatus",
      headerName: "Achievement",
      flex: 1,
      minWidth: 120,
      renderCell: (params) => (
        <StatusLabel
          lable={params.value}
          color={
            SO_ATCHIVEMENT_STATUS[params.value]?.txtColor ||
            SO_ATCHIVEMENT_STATUS["defaultStatus"]?.txtColor
          }
        />
      ),
    },
    {
      field: "progress",
      headerName: "Progress",
      flex: 1,
      minWidth: 150,
      renderCell: (params) => (
        <span className={styles.progressNumber}>{`${params.value}%`}</span>
      ),
    },
    {
      field: "finalDissension",
      headerName: "final decision",
      flex: 1,
      minWidth: 150,
      renderCell: (params) => (
        <StatusLabel
          lable={params.value}
          color={
            SO_ATCHIVEMENT_STATUS[params.value]?.txtColor ||
            SO_ATCHIVEMENT_STATUS["defaultStatus"]?.txtColor
          }
        />
      ),
    },
  ];

  // Helper function to format objectives for table rows
  const getTableRows = (objectives) => {
    if (!objectives || objectives.length === 0) return [];
    return objectives.map((obj) => ({
      id: obj.ID,
      objective: obj.Title || "--",
      status: obj.Status || "Pending",
      submittedOn: obj.SubmittedOn?.split(" ")[0] || "--",
      achievementStatus: obj.AchievementStatus || "--",
      progress: obj.Progress || 0,
      finalDissension: obj.FinalDiscission || "NotSubmitted",
    }));
  };

  const handleViewDetails = (selectedRow) => {
    dispatch(
      showDrawer({
        drawerType: "detailsSO",
        drawerData: { id: selectedRow.id },
      })
    );
  };

  return (
    <>
      <Widget>
        <div className={styles.header}>
          <h1 className={styles.title}>Quarters Log</h1>
          <div className={styles.controls}>
            <FormControl variant="outlined" size="small">
              <Select
                labelId="year-select-label"
                id="year-select"
                value={selectedYear}
                onChange={handleYearChange}
                startAdornment={
                  <Box sx={{ mr: 1, display: "flex", alignItems: "center" }}>
                    <MdOutlineCalendarToday />
                  </Box>
                }
                sx={{
                  minWidth: "120px",
                  "& .MuiSelect-select": {
                    display: "flex",
                    alignItems: "center",
                    paddingLeft: "8px",
                  },
                }}
              >
                {years.map((year) => (
                  <MenuItem key={year} value={year}>
                    {year}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <div className={styles.viewToggle}>
              <Tooltip title="Grid View">
                <IconButton
                  onClick={() => setViewMode("grid")}
                  className={viewMode === "grid" ? styles.activeView : ""}
                  size="small"
                >
                  <BsGrid3X3Gap />
                </IconButton>
              </Tooltip>
              <Tooltip title="List View">
                <IconButton
                  onClick={() => setViewMode("list")}
                  className={viewMode === "list" ? styles.activeView : ""}
                  size="small"
                >
                  <FaList />
                </IconButton>
              </Tooltip>
            </div>
          </div>
        </div>
      </Widget>

      {isLoading || isFetching ? (
        <MainLoader height={"calc(100vh - 160px)"} />
      ) : isError ? (
        <TryAgain
          minHeight="calc(100vh - 160px)"
          message="An error occurred while loading data"
          handleTryAgain={refetch}
        />
      ) : viewMode === "grid" ? (
        <>
          {[
            [1, 2], // first row → Q1 & Q2
            [3, 4], // second row → Q3 & Q4
          ].map((row, rowIndex) => (
            <Grid
              key={rowIndex}
              container
              spacing={2}
              sx={{ minHeight: "calc(50vh - 62px)", mb: 2 }}
            >
              {row.map((q) => (
                <Grid key={q} size={{ xs: 12, md: 6 }}>
                  <Widget
                    padding="10px"
                    minHeight="100%"
                    sx={{ cursor: "pointer" }}
                  >
                    <QuarterCard
                      isRedirectToQuarter
                      year={selectedYear}
                      quarter={q}
                      quarterData={quartersLogData?.[q]}
                    />
                  </Widget>
                </Grid>
              ))}
            </Grid>
          ))}
        </>
      ) : (
        <>
          {/* List View - Tables for each quarter */}
          {[1, 2, 3, 4].map((quarter) => (
            <Widget key={quarter} margin="0 0 10px 0">
              <Box sx={{ marginBottom: "10px" }}>
                <QuarterHeader
                  year={selectedYear}
                  quarter={quarter}
                  quarterMonths={getQuarterMonths(quarter)}
                />
              </Box>
              <Table
                onRowClick={(row) => handleViewDetails(row)}
                rows={getTableRows(quartersLogData?.[quarter]?.objectives)}
                columns={getTableColumns()}
                getRowId={(row) => row.id}
                messages={{
                  noRowsLabel: isQuarterAfterCurrent(quarter)
                    ? "Quarter Not Started"
                    : "No Objective Submitted in this quarter",
                }}
              />
            </Widget>
          ))}
        </>
      )}
    </>
  );
};

export default QuartersLog;
