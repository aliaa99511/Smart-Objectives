import {
  Typography,
  Box,
  Skeleton,
  FormControl,
  Select,
  MenuItem,
  Tooltip,
  IconButton,
  Button,
} from "@mui/material";
import Widget from "../../components/general/widget/widget.component";
import styles from "./myCompany.module.css";
import Grid from "@mui/material/Grid2";
import { getYearAndQuarter } from "../../helpers/utilities/getYearAndQuarter";
import { useGetDepartmentsQuery } from "../../appState/apis/hrSoApiSlice";
import AutoCompleteSelector from "../../components/general/autoCompleteSelector/autoCompleteSelector.component";
import { useLocation, useNavigate } from "react-router-dom";
import SelectDepartmentPlaceholder from "../../components/myCompany/selectDepartmentPlaceholder/selectDepartmentPlaceholder.component";
import { useGetMyCompanyEmployeesQuery } from "../../appState/apis/hrSoApiSlice";
import CompanyMemberCard from "../../components/myCompany/companyMemberCard/companyMemberCard.component";
import TryAgain from "../../components/general/tryAgain/tryAgain.component";
import MainLoader from "../../components/general/mainLoader/mainLoader.component";
import { MdOutlineCalendarToday } from "react-icons/md";
import { quarterOptions } from "../../settings/constants/options/quarterOptions";
import { useEffect, useState, useMemo } from "react";
import { getYearsArray } from "../../helpers/utilities/getYearsArray";
import { BsGrid3X3Gap } from "react-icons/bs";
import { FaList } from "react-icons/fa6";
import { FiDownload } from "react-icons/fi";
import { useDispatch } from "react-redux";
import { showDrawer } from "../../appState/slices/drawerSlice";
import Table from "../../components/general/table/table.component";
import UserImg from "../../components/general/userImg/userImg.component";
import { GridActionsCellItem, GridMoreVertIcon } from "@mui/x-data-grid";
import TableOptionsList from "../../components/general/tableOptionsList/tableOptionsList.component";
import useScrollRestoration from "../../hooks/useScrollRestoration";
import { savePositionAndNavigate } from "../../hooks/navigationHelper";

const MyCompany = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  // Get URL parameters
  const searchParams = new URLSearchParams(location.search);
  const selectedDepartmentId = searchParams.get("selectedDepartmentId") || null;

  const { year: defaultYear, quarter: defaultQuarter } = getYearAndQuarter();

  const [years, setYears] = useState([]);
  const [selectedYear, setSelectedYear] = useState(defaultYear);
  const [selectedQuarter, setSelectedQuarter] = useState(defaultQuarter);
  const [viewMode, setViewMode] = useState(
    sessionStorage.getItem("myCompanyViewMode") || "grid"
  );
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedRow, setSelectedRow] = useState(null);
  const [isExporting, setIsExporting] = useState(false);

  // Get employees for selected department
  const {
    data: departments,
    isLoading: isDepartmentsLoading,
    isError: isDepartmentsError,
  } = useGetDepartmentsQuery();
  const {
    data: companyEmployees,
    isLoading: isEmployeesLoading,
    isError: isEmployeesError,
    isFetching: isEmployeesFeatching,
    refetch,
  } = useGetMyCompanyEmployeesQuery(
    {
      departmentId: selectedDepartmentId,
      year: selectedYear,
      quarter: selectedQuarter,
    },
    { skip: !selectedDepartmentId },
  );

  // Use scroll restoration hook - restore when data is loaded
  const shouldRestore = !isEmployeesLoading && !isEmployeesFeatching && companyEmployees;
  const { saveScrollPosition } = useScrollRestoration('myCompany', shouldRestore);

  // Update filters in URL
  const updateFiltersInUrl = (year, quarter) => {
    const params = new URLSearchParams(location.search);
    params.set("year", year);
    params.set("quarter", quarter);

    navigate(
      {
        pathname: location.pathname,
        search: params.toString(),
      },
      { replace: true },
    );
  };

  // Initialize years array and sync with URL
  useEffect(() => {
    const yearsArray = getYearsArray(2015);
    setYears(yearsArray);

    const yearParam = searchParams.get("year");
    const quarterParam = searchParams.get("quarter");

    if (yearParam) {
      setSelectedYear(Number(yearParam));
    }
    if (quarterParam) {
      setSelectedQuarter(Number(quarterParam));
    }

    if (!yearParam || !quarterParam) {
      const params = new URLSearchParams(location.search);
      params.set("year", yearParam || defaultYear);
      params.set("quarter", quarterParam || defaultQuarter);

      navigate(
        {
          pathname: location.pathname,
          search: params.toString(),
        },
        { replace: true },
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.search]);

  const handleYearChange = (event) => {
    const newYear = event.target.value;
    setSelectedYear(newYear);
    updateFiltersInUrl(newYear, selectedQuarter);
  };

  const handleQuarterChange = (quarter) => {
    setSelectedQuarter(quarter);
    updateFiltersInUrl(selectedYear, quarter);
  };

  // Sort employees by highest objectives (descending) - Used for Card View
  const getSortedEmployees = useMemo(() => {
    if (!companyEmployees || companyEmployees.length === 0) return [];

    return [...companyEmployees].sort((a, b) => {
      const objectivesA = a.approveRequests || 0;
      const objectivesB = b.approveRequests || 0;

      // If objectives are equal, sort by completion rate
      if (objectivesB === objectivesA) {
        const completionA = a.completionRate || 0;
        const completionB = b.completionRate || 0;
        return completionB - completionA;
      }

      return objectivesB - objectivesA; // Descending order by objectives
    });
  }, [companyEmployees]);

  // Sort table rows by objectives - Used for Table/List View
  const getSortedTableRows = useMemo(() => {
    if (!companyEmployees || companyEmployees.length === 0) return [];

    return [...companyEmployees]
      .sort((a, b) => {
        const objectivesA = a.approveRequests || 0;
        const objectivesB = b.approveRequests || 0;

        if (objectivesB === objectivesA) {
          const completionA = a.completionRate || 0;
          const completionB = b.completionRate || 0;

          return completionB - completionA;
        }

        return objectivesB - objectivesA;
      })
      .map((obj, index) => ({
        elementId: `employee-${obj.id}`,
        id: obj.id,
        sortOrder: index + 1,
        employee: {
          name: obj?.name || "team member",
          img: obj?.img || null,
        },
        approveRequests: obj?.approveRequests || 0,
        achievedObjectives: obj?.achievedObjectives || 0,
        notAchievedObjectives: obj?.notAchievedObjectives || 0,
        underReviewObjectives: obj?.underReviewObjectives || 0,
        completionRate: obj?.completionRate || 0,
      }));
  }, [companyEmployees]);

  const handleViewDetails = (selectedRow) => {
    saveScrollPosition();
    dispatch(
      showDrawer({
        drawerType: "detailsSO",
        drawerData: { id: selectedRow.id, hideActions: true },
      }),
    );
  };

  // Export functionality
  const handleExport = () => {
    if (!companyEmployees || companyEmployees.length === 0) return;

    setIsExporting(true);

    try {
      // Define CSV headers without "Pending Requests"
      const csvHeaders = [
        "Employee Name",
        "Job Title",
        "Objectives",
        "Achieved",
        "Not Achieved",
        "Under Review",
        "Completion Rate",
      ];

      // Map sorted employees to CSV rows without pending requests
      const csvRows = getSortedEmployees.map((employee) => [
        employee.name || "Team Member",
        employee.jobTitle || "",
        employee.approveRequests || 0,
        employee.achievedObjectives || 0,
        employee.notAchievedObjectives || 0,
        employee.underReviewObjectives || 0,
        `${employee.completionRate || 0}%`,
      ]);

      // Combine headers and rows
      const csvContent = [
        csvHeaders.join(","),
        ...csvRows.map((row) => row.join(",")),
      ].join("\n");

      // Create and download file
      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
      const link = document.createElement("a");
      const url = URL.createObjectURL(blob);

      // Generate filename with department and quarter info
      const selectedDepartmentTitle =
        departments?.find((d) => d.Id == selectedDepartmentId)?.Title ||
        "All-Departments";
      const quarterLabel =
        quarterOptions.find((q) => q.value === selectedQuarter)?.label ||
        `Q${selectedQuarter}`;
      const filename = `${selectedDepartmentTitle}_${selectedYear}_${quarterLabel}_Company_Report.csv`;

      link.setAttribute("href", url);
      link.setAttribute("download", filename);
      link.style.visibility = "hidden";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error("Export failed:", error);
    } finally {
      setIsExporting(false);
    }
  };
  const handleViewModeChange = (mode) => {
    setViewMode(mode);
    sessionStorage.setItem("myCompanyViewMode", mode);
  };
  const getTableColumns = () => [
    {
      field: "employee",
      headerName: "Employee",
      flex: 2,
      minWidth: 200,
      renderCell: (params) => (
        <Box sx={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <UserImg
            img={params.row.employee.img}
            userName={params.row.employee.name}
            imgSize="imgSM"
            isLoading={false}
          />
          <span>{`${params.row.employee.name}`}</span>
        </Box>
      ),
    },
    {
      field: "approveRequests",
      headerName: "Objectives",
      flex: 1,
      minWidth: 140,
      renderCell: (params) => <span>{`${params.value}`}</span>,
    },
    {
      field: "achievedObjectives",
      headerName: "Achieved",
      flex: 1,
      minWidth: 140,
      renderCell: (params) => (
        <span style={{ color: "#37A52D" }}>{`${params.value}`}</span>
      ),
    },
    {
      field: "notAchievedObjectives",
      headerName: "Not Achieved",
      flex: 1,
      minWidth: 140,
      renderCell: (params) => (
        <span style={{ color: "#EF3535" }}>{`${params.value}`}</span>
      ),
    },
    {
      field: "underReviewObjectives",
      headerName: "Under Review",
      flex: 1,
      minWidth: 140,
      renderCell: (params) => (
        <span style={{ color: "#E36F27" }}>{`${params.value}`}</span>
      ),
    },
    {
      field: "completionRate",
      headerName: "Completion Rate",
      flex: 1,
      minWidth: 140,
      renderCell: (params) => (
        <span
          style={{ color: "#0F0038", fontWeight: "700" }}
        >{`${params.value}%`}</span>
      ),
    },
    {
      field: "actions",
      type: "actions",
      headerName: "",
      width: 50,
      cellClassName: "actionsCell",
      getActions: (params) => [
        <GridActionsCellItem
          icon={<GridMoreVertIcon />}
          label="Actions"
          onClick={(event) => handleMenuOpen(event, params)}
        />,
      ],
    },
  ];

  const selectedDepartmentTitle = departments?.find(
    (d) => d.Id == selectedDepartmentId,
  )?.Title;

  const handleMenuOpen = (event, params) => {
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
    setSelectedRow(params.row);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedRow(null);
  };

  const handleCurrentObjectives = (row, selectedQuarter) => {
    savePositionAndNavigate('myCompany', navigate,
      `/myCompany/currentObjectives?departmentId=${selectedDepartmentId}&departmentTitle=${encodeURIComponent(selectedDepartmentTitle)}${selectedQuarter ? `&quarter=${selectedQuarter}` : ''}`,
      {
        state: {
          employeeId: selectedRow?.id || row?.id,
        },
      }
    );
    handleMenuClose();
  };

  const handleQuarterLog = () => {
    savePositionAndNavigate('myCompany', navigate,
      `/myCompany/quarterLog?departmentId=${selectedDepartmentId}&departmentTitle=${encodeURIComponent(selectedDepartmentTitle)}`,
      {
        state: { employeeId: selectedRow.id },
      }
    );
    handleMenuClose();
  };

  const handleCertificate = () => {
    savePositionAndNavigate('myCompany', navigate,
      `/myCompany/certificateWithHr?departmentId=${selectedDepartmentId}&departmentTitle=${encodeURIComponent(selectedDepartmentTitle)}`,
      {
        state: { employeeId: selectedRow.id },
      }
    );
    handleMenuClose();
  };

  const handleAchievements = () => {
    savePositionAndNavigate('myCompany', navigate,
      `/myCompany/achievementsWithHr?departmentId=${selectedDepartmentId}&departmentTitle=${encodeURIComponent(selectedDepartmentTitle)}`,
      {
        state: { employeeId: selectedRow.id },
      }
    );
    handleMenuClose();
  };

  useEffect(() => {
    const selectedEmployeeId = sessionStorage.getItem(
      "selectedEmployee_myCompany"
    );

    if (
      selectedEmployeeId &&
      !isEmployeesLoading &&
      !isEmployeesFeatching &&
      companyEmployees?.length
    ) {
      const timeout = setTimeout(() => {
        const element = document.getElementById(
          `employee-${selectedEmployeeId}`
        );

        if (element) {
          element.scrollIntoView({
            behavior: "smooth",
            block: "center",
          });
        }
      }, 300);

      return () => clearTimeout(timeout);
    }
  }, [
    companyEmployees,
    isEmployeesLoading,
    isEmployeesFeatching,
  ]);

  return (
    <Widget minHeight="calc(100vh - 20px)">
      <div className={styles.header}>
        <Typography className={styles.title} variant="h6" fontWeight="bold">
          Company
        </Typography>
        <div className={styles.filters}>
          <div className={styles.filter}>
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
                    paddingBlock: "11px",
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
          </div>
          <div className={styles.filter}>
            <AutoCompleteSelector
              allSearchItems={quarterOptions}
              typeOfSelectedItem={"quarter"}
              placeholder={"Select Quarter"}
              name={"quarter"}
              onSelectionChange={handleQuarterChange}
              initialValue={selectedQuarter}
              disableClearable={true}
            />
          </div>
          <div className={styles.filter}>
            {!isDepartmentsLoading ? (
              <AutoCompleteSelector
                allSearchItems={departments}
                typeOfSelectedItem={"selectedDepartmentId"}
                placeholder={"Select department"}
                name={"departmentId"}
                disabled={isDepartmentsLoading || isDepartmentsError}
              />
            ) : (
              <Skeleton variant="rectangular" fullwidth="true" height={48} />
            )}
          </div>
          <div className={styles.viewToggle}>
            <Tooltip title="Grid View">
              <IconButton
                onClick={() => handleViewModeChange("grid")}
                className={viewMode === "grid" ? styles.activeView : ""}
                size="small"
              >
                <BsGrid3X3Gap />
              </IconButton>
            </Tooltip>
            <Tooltip title="List View">
              <IconButton
                onClick={() => handleViewModeChange("list")}
                className={viewMode === "list" ? styles.activeView : ""}
                size="small"
              >
                <FaList />
              </IconButton>
            </Tooltip>
          </div>
          <div className={styles.exportButton}>
            <Tooltip title="Export to CSV">
              <span>
                <Button
                  variant="outlined"
                  size="small"
                  startIcon={<FiDownload />}
                  onClick={handleExport}
                  disabled={
                    isExporting ||
                    !selectedDepartmentId ||
                    !companyEmployees ||
                    companyEmployees.length === 0
                  }
                  sx={{
                    minWidth: "90px",
                    height: "45px",
                    textTransform: "none",
                    borderColor: "divider",
                    color: "text.primary",
                    "&:hover": {
                      borderColor: "primary.main",
                      backgroundColor: "action.hover",
                    },
                  }}
                >
                  {isExporting ? "Exporting..." : "Export"}
                </Button>
              </span>
            </Tooltip>
          </div>
        </div>
      </div>

      {!selectedDepartmentId && <SelectDepartmentPlaceholder />}

      {(isEmployeesLoading || isEmployeesFeatching) && (
        <MainLoader height={"calc(100vh - 120px)"} />
      )}

      {isEmployeesError && (
        <TryAgain
          minHeight="calc(100vh - 120px)"
          message="An error occurred while loading data"
          handleTryAgain={refetch}
        />
      )}

      {viewMode === "grid" ? (
        <>
          {selectedDepartmentId &&
            !isEmployeesLoading &&
            !isEmployeesError &&
            getSortedEmployees.length > 0 ? (
            <Grid container spacing={2}>
              {getSortedEmployees.map((member) => (
                <Grid
                  size={{ xs: 12, md: 6, lg: 4 }}
                  key={member.id}
                  id={`employee-${member.id}`}
                >
                  <CompanyMemberCard
                    member={member}
                    department={{
                      id: selectedDepartmentId,
                      title: selectedDepartmentTitle,
                    }}
                  />
                </Grid>
              ))}
            </Grid>
          ) : (
            selectedDepartmentId &&
            !isEmployeesLoading &&
            !isEmployeesError && (
              <Box
                display="flex"
                justifyContent="center"
                alignItems="center"
                height="50vh"
              >
                <Typography>No team members found.</Typography>
              </Box>
            )
          )}
        </>
      ) : (
        <>
          <Table
            onRowClick={(row) => {
              savePositionAndNavigate(
                "myCompany",
                navigate,
                `/myCompany/currentObjectives?departmentId=${selectedDepartmentId}&departmentTitle=${encodeURIComponent(
                  selectedDepartmentTitle
                )}&quarter=${selectedQuarter}`,
                {
                  state: {
                    employeeId: row.id,
                  },
                },
                row.id
              );
            }}
            rows={getSortedTableRows}
            columns={getTableColumns()}
            getRowId={(row) => row.id}
            getRowClassName={(params) => `employee-${params.row.id}`}
          />
          <TableOptionsList anchorEl={anchorEl} setAnchorEl={setAnchorEl}>
            <MenuItem
              className={styles.menuItem}
              onClick={handleCurrentObjectives}
            >
              Current Objectives
            </MenuItem>
            <MenuItem className={styles.menuItem} onClick={handleQuarterLog}>
              Quarters Log
            </MenuItem>
            <MenuItem className={styles.menuItem} onClick={handleCertificate}>
              Certificate
            </MenuItem>
            <MenuItem className={styles.menuItem} onClick={handleAchievements}>
              Achievements
            </MenuItem>
          </TableOptionsList>
        </>
      )}
    </Widget>
  );
};

export default MyCompany;