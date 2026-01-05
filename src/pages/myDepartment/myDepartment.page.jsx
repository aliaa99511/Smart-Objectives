import {
  Typography,
  CircularProgress,
  Box,
  MenuItem,
  FormControl,
  Select,
} from "@mui/material";
import Widget from "../../components/general/widget/widget.component";
import styles from "./myDepartment.module.css";
import Grid from "@mui/material/Grid2";
import { getYearAndQuarter } from "../../helpers/utilities/getYearAndQuarter";
import { getYearsArray } from "../../helpers/utilities/getYearsArray";
import { useFetchCurrentUserQuery } from "../../appState/apis/userApiSlice";
import { useGetMyDepartmentMembersQuery } from "../../appState/apis/managerApprovalsSoApiSlice";
import DepartmentTeamMemberCard from "../../components/myDepartment/departmentTeamMemberCard/departmentTeamMemberCard.component";
import TryAgain from "../../components/general/tryAgain/tryAgain.component";
import MainLoader from "../../components/general/mainLoader/mainLoader.component";
import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import AutoCompleteSelector from "../../components/general/autoCompleteSelector/autoCompleteSelector.component";
import { quarterOptions } from "../../settings/constants/options/quarterOptions";
import Table from "../../components/general/table/table.component";
import { GridActionsCellItem, GridMoreVertIcon } from "@mui/x-data-grid";
import TableOptionsList from "../../components/general/tableOptionsList/tableOptionsList.component";
import UserInfo from "../../components/general/userInfo/userInfo.component";
import { MdOutlineCalendarToday } from "react-icons/md";
import { SO_ATCHIVEMENT_STATUS } from "../../settings/constants/status/smartObjective.status";

const MyDepartment = () => {
  const { data: userData } = useFetchCurrentUserQuery();
  const navigate = useNavigate();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);

  // Get year and quarter from URL or use defaults
  const { year: defaultYear, quarter: defaultQuarter } = getYearAndQuarter();

  const [years, setYears] = useState([]);
  const [selectedYear, setSelectedYear] = useState(defaultYear);
  const [selectedQuarter, setSelectedQuarter] = useState(defaultQuarter);
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedRow, setSelectedRow] = useState(null);

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
      { replace: true }
    );
  };

  // Initialize years array and sync with URL
  useEffect(() => {
    // Get years array starting from 2015 to current year
    const yearsArray = getYearsArray(2015);
    setYears(yearsArray);

    // Check if year and quarter are in URL params
    const yearParam = searchParams.get("year");
    const quarterParam = searchParams.get("quarter");

    if (yearParam) {
      setSelectedYear(Number(yearParam));
    }
    if (quarterParam) {
      setSelectedQuarter(Number(quarterParam));
    }

    // Set defaults in URL if not present
    if (!yearParam || !quarterParam) {
      const params = new URLSearchParams(location.search);
      params.set("year", yearParam || defaultYear);
      params.set("quarter", quarterParam || defaultQuarter);

      navigate(
        {
          pathname: location.pathname,
          search: params.toString(),
        },
        { replace: true }
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.search]);

  const {
    data: departmentMembers,
    isLoading: isEmployeesLoading,
    isError: isEmployeesError,
    isFetching: isEmployeesFeatching,
    refetch,
  } = useGetMyDepartmentMembersQuery(
    {
      departmentId: userData?.departmentId,
      year: selectedYear,
      quarter: selectedQuarter,
    },
    { skip: !userData?.departmentId }
  );

  const handleYearChange = (event) => {
    const newYear = event.target.value;
    setSelectedYear(newYear);
    updateFiltersInUrl(newYear, selectedQuarter);
  };

  const handleQuarterChange = (quarter) => {
    setSelectedQuarter(quarter);
    updateFiltersInUrl(selectedYear, quarter);
  };

  const handleMenuOpen = (event, params) => {
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
    setSelectedRow(params.row);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedRow(null);
  };

  const handleCurrentObjectives = () => {
    navigate(
      `/myDepartment/currentObjectives?departmentId=${userData?.departmentId}`,
      {
        state: {
          employeeId: selectedRow.id,
        },
      }
    );
    handleMenuClose();
  };

  const handleQuarterLog = () => {
    navigate(
      `/myDepartment/quarterLog?departmentId=${userData?.departmentId}&year=${selectedYear}`,
      {
        state: { employeeId: selectedRow.id },
      }
    );
    handleMenuClose();
  };

  const handleCertificate = () => {
    navigate(
      `/myDepartment/certificateWithDepartmentManager?departmentId=${userData?.departmentId}&year=${selectedYear}`,
      {
        state: { employeeId: selectedRow.id },
      }
    );
    handleMenuClose();
  };

  const columns = [
    {
      field: "name",
      headerName: "Employee Name",
      flex: 2,
      minWidth: 200,
      renderCell: (params) => (
        <UserInfo
          userData={{
            name: params.row.name,
            img: params.row.img,
            jobTitle: params.row.jobTitle,
          }}
          imgSize="imgSM"
          nameSize="nameSM"
          isLoading={false}
          fullRadius={true}
          withNotfication={false}
        />
      ),
    },
    {
      field: "objectives",
      headerName: "Objectives",
      flex: 1,
      minWidth: 100,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "underReview",
      headerName: "Under Review",
      flex: 1,
      minWidth: 120,
      align: "center",
      headerAlign: "center",
      renderCell: (params) => (
        <span
          style={{
            color: `${
              SO_ATCHIVEMENT_STATUS["UnderReview"]?.txtColor ||
              SO_ATCHIVEMENT_STATUS["defaultStatus"]?.txtColor
            }`,
          }}
        >
          {params.value}
        </span>
      ),
    },
    {
      field: "achieved",
      headerName: "Achieved",
      flex: 1,
      minWidth: 100,
      align: "center",
      headerAlign: "center",
      renderCell: (params) => (
        <span
          style={{
            color: `${
              SO_ATCHIVEMENT_STATUS["Achieved"]?.txtColor ||
              SO_ATCHIVEMENT_STATUS["defaultStatus"]?.txtColor
            }`,
          }}
        >
          {params.value}
        </span>
      ),
    },
    {
      field: "notAchieved",
      headerName: "Not Achieved",
      flex: 1,
      minWidth: 120,
      align: "center",
      headerAlign: "center",
      renderCell: (params) => (
        <span
          style={{
            color: `${
              SO_ATCHIVEMENT_STATUS["NotAchieved"]?.txtColor ||
              SO_ATCHIVEMENT_STATUS["defaultStatus"]?.txtColor
            }`,
          }}
        >
          {params.value}
        </span>
      ),
    },
    {
      field: "completionRate",
      headerName: "Completion Rate",
      flex: 1,
      minWidth: 150,
      align: "center",
      headerAlign: "center",
      renderCell: (params) => (
        <span style={{ fontWeight: 600 }}>{`${params.value}%`}</span>
      ),
    },
    {
      field: "actions",
      type: "actions",
      headerName: "",
      width: 50,
      getActions: (params) => [
        <GridActionsCellItem
          key={`actions-${params.id}`}
          icon={<GridMoreVertIcon />}
          label="Actions"
          onClick={(event) => handleMenuOpen(event, params)}
        />,
      ],
    },
  ];

  return (
    <Widget minHeight="calc(100vh - 20px)">
      <div className={styles.header}>
        <Typography className={styles.title} variant="h6" fontWeight="bold">
          My Department
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
        </div>
      </div>

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
      {/* {userData?.departmentId &&
      !isEmployeesLoading &&
      !isEmployeesError &&
      departmentMembers &&
      departmentMembers.length > 0 ? (
        <Grid container spacing={2}>
          {departmentMembers.map((member) => (
            <Grid size={{ xs: 12, md: 6, lg: 3 }} key={member.id}>
              <DepartmentTeamMemberCard
                member={member}
                department={{
                  id: userData?.departmentId,
                }}
              />
            </Grid>
          ))}
        </Grid>
      ) : (
        userData?.departmentId &&
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
        )} */}
      {!isEmployeesLoading && !isEmployeesError && departmentMembers && (
        <Box sx={{ mt: "10px", minHeight: "calc(100vh - 120px)" }}>
          <Table
            rows={departmentMembers || []}
            columns={columns}
            getRowId={(row) => row?.id}
            loading={isEmployeesLoading || isEmployeesFeatching}
            error={
              isEmployeesError
                ? {
                    message:
                      "Error loading department members. Please try again.",
                  }
                : null
            }
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
          </TableOptionsList>
        </Box>
      )}
    </Widget>
  );
};

export default MyDepartment;
