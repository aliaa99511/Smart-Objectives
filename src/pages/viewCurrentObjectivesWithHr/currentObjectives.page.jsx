import {
  Alert,
  Box,
  Breadcrumbs,
  MenuItem,
  Skeleton,
  Typography,
} from "@mui/material";
import Widget from "../../components/general/widget/widget.component";
import { Link, useLocation, useNavigate } from "react-router-dom";
import styles from "./currentObjectives.module.css";
import { useEffect, useState } from "react";
import { getYearAndQuarter } from "../../helpers/utilities/getYearAndQuarter";
import { useGetTeamMemberSoQuery } from "../../appState/apis/managerApprovalsSoApiSlice";
import AutoCompleteSelector from "../../components/general/autoCompleteSelector/autoCompleteSelector.component";
import QuarterHeader from "../../components/general/quarterHeader/quarterHeader.component";
import UserInfo from "../../components/general/userInfo/userInfo.component";
import StatusLabel from "../../components/general/statusLabel/statusLabel.component";
import {
  SO_ATCHIVEMENT_STATUS,
  SO_STATUS,
} from "../../settings/constants/status/smartObjective.status";
import { GridActionsCellItem, GridMoreVertIcon } from "@mui/x-data-grid";
import Table from "../../components/general/table/table.component";
import TableOptionsList from "../../components/general/tableOptionsList/tableOptionsList.component";
import ProgressBarNumInside from "../../components/general/progressBarNumInside/progressBarNumInside.component";
import { useDispatch } from "react-redux";
import { showDrawer } from "../../appState/slices/drawerSlice";
import { useGetMyCompanyEmployeesQuery } from "../../appState/apis/hrSoApiSlice";
import TryAgain from "../../components/general/tryAgain/tryAgain.component";
import achiveIcon from "../../assets/achiveIcon.svg";
import { quarterOptions } from "../../settings/constants/options/quarterOptions";

const CurrentObjectives = () => {
  const [selectedQuarter, setSelectedQuarter] = useState("");
  const location = useLocation();
  const navigate = useNavigate();
  const [employeeId, setEmployeeId] = useState(null);
  const searchParams = new URLSearchParams(location.search);
  const yearParam = searchParams.get("year");
  const quarterParam = searchParams.get("quarter");
  const { year, quarter, quarterMonths } = getYearAndQuarter(
    undefined,
    quarterParam,
    yearParam
  );
  const [anchorEl, setAnchorEl] = useState(null);
  const dispatch = useDispatch();
  const [selectedRow, setSelectedRow] = useState(null);

  // Get URL parameters
  const departmentId = searchParams.get("departmentId") || null;
  const departmentTitle = searchParams.get("departmentTitle") || null;

  useEffect(() => {
    if (quarter) {
      setSelectedQuarter(Number(quarter));
    } else {
      // Set current quarter as default in URL if not already there
      updateQuarterInUrl(selectedQuarter);
    }
  }, [location.search]);

  const updateQuarterInUrl = (quarter) => {
    searchParams.set("quarter", quarter);

    navigate(
      {
        pathname: location.pathname,
        search: searchParams.toString(),
      },
      { replace: true }
    );
  };

  // Change this function
  const handleQuarterChange = (quarterId) => {
    // Now directly receiving the ID instead of an event
    setSelectedQuarter(quarterId);
    updateQuarterInUrl(quarterId);
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

  const handleViewDetails = () => {
    dispatch(
      showDrawer({
        drawerType: "detailsSO",
        drawerData: { id: selectedRow.id },
      })
    );
    handleMenuClose();
  };

  const {
    data: companyEmployees,
    isLoading: isEmployeesLoading,
    isError: isEmployeesError,
    isFetching: isEmployeesFeatching,
  } = useGetMyCompanyEmployeesQuery(
    {
      departmentId: departmentId,
      year,
      quarter,
    },
    { skip: !departmentId }
  );

  // Fetch team member's smart objectives
  const {
    data: teamMemberObjectives,
    isLoading: isObjectivesLoading,
    isError: isObjectivesError,
    isFetching: isTeamMemberObjectivesFetching,
    refetch,
  } = useGetTeamMemberSoQuery(
    {
      employeeId,
      year,
      quarter,
    },
    {
      skip: !employeeId,
    }
  );

  const employeeOptions = companyEmployees?.map((member) => {
    return {
      Id: member.id,
      Title: member.name,
    };
  });

  // Get employeeId from location state or session storage for page refreshes
  useEffect(() => {
    // First try to get from location state
    if (location.state?.employeeId) {
      setEmployeeId(location.state.employeeId);
      // Store in session storage for page refreshes
      sessionStorage.setItem("currentEmployeeId", location.state.employeeId);

      // Clear the location state after using it
      window.history.replaceState({}, document.title);
    } else {
      // If not in state (e.g., after page refresh), try session storage
      const storedEmployeeId = sessionStorage.getItem("currentEmployeeId");
      if (storedEmployeeId) {
        setEmployeeId(storedEmployeeId);
      } else {
        // If not found anywhere, redirect to myCompany
        navigate("/myCompany");
      }
    }
  }, [location, navigate]);

  // Handle employee selection from dropdown
  const handleEmployeeChange = (newEmployeeId) => {
    // If the user clears the selection (makes it empty)
    if (!newEmployeeId) {
      // Clear session storage
      sessionStorage.removeItem("currentEmployeeId");
      // Redirect to myCompany page
      navigate("/myCompany");
      return;
    }

    setEmployeeId(newEmployeeId);
    sessionStorage.setItem("currentEmployeeId", newEmployeeId);
    // Ensure location state is cleared when manually selecting a new employee
    if (location.state?.employeeId) {
      window.history.replaceState({}, document.title);
    }
  };

  // If no employeeId, don't render the component content
  if (!employeeId) return null;

  const handleCertficatesLog = (selectedRow) => {
    dispatch(
      showDrawer({
        drawerType: "certficatesLog",
        drawerData: { id: selectedRow.id },
      })
    );
    handleMenuClose();
  };

  const columns = [
    {
      field: "title",
      headerName: "objective",
      flex: 1.5,
      minWidth: 200,
    },
    {
      field: "status",
      headerName: "status",
      flex: 1.5,
      minWidth: 150,
      renderCell: (params) => (
        <StatusLabel
          lable={params.value}
          color={
            SO_STATUS[params.value]?.txtColor ||
            SO_STATUS["defaultStatus"]?.txtColor
          }
          BGColor={
            SO_STATUS[params.value]?.BGColor ||
            SO_STATUS["defaultStatus"]?.BGColor
          }
        />
      ),
    },
    {
      field: "submissionDate",
      headerName: "submitted on",
      flex: 1.5,
      minWidth: 120,
    },
    {
      field: "achivementStatus",
      headerName: "achievement",
      flex: 1.5,
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
      flex: 1.5,
      minWidth: 120,
      renderCell: (params) => (
        <span className={styles.progressNumber}>{`${params.value}%`}</span>
      ),
      // renderCell: (params) => <ProgressBarNumInside progress={params.value} />,
    },
    {
      field: "finalDiscission",
      headerName: "final decision",
      flex: 1.5,
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
      field: "isHasAttachments",
      headerName: "",
      flex: 0.5,
      minWidth: 50,
      renderCell: (params) =>
        params.value ? (
          <div
            className={styles.icon}
            onClick={() => handleCertficatesLog(params.row)}
          >
            <img src={achiveIcon} alt="" />
          </div>
        ) : null,
    },
    {
      field: "actions",
      type: "actions",
      headerName: "",
      width: 50,
      getActions: (params) => [
        <GridActionsCellItem
          icon={<GridMoreVertIcon />}
          label="Actions"
          onClick={(event) => handleMenuOpen(event, params)}
        />,
      ],
    },
  ];
  const handleViewActivitiesLog = () => {
    dispatch(
      showDrawer({
        drawerType: "activeties",
        drawerData: { id: selectedRow.id },
      })
    );
    handleMenuClose();
  };

  return (
    <Widget>
      <Breadcrumbs className={styles.breadcrumbs} aria-label="breadcrumb">
        <Link to="/myCompany">Company</Link>
        <Link to={`/myCompany?selectedDepartmentId=${departmentId}`}>
          {departmentTitle}
        </Link>
        <div className={styles.pageName}>
          <span>{"current Objectives"}</span>
        </div>
      </Breadcrumbs>
      <div className={styles.header}>
        <Typography className={styles.title} variant="h6" fontWeight="bold">
          current objectives
        </Typography>
        <div className={styles.filters}>
          <div className={styles.filter}>
            <AutoCompleteSelector
              allSearchItems={quarterOptions}
              typeOfSelectedItem={"quarter"}
              placeholder={"Select Quarter"}
              name={"quarter"}
              onSelectionChange={handleQuarterChange}
              initialValue={quarter}
              disableClearable={true} // Prevent clearing the selection
            />
          </div>
          <div className={styles.filter}>
            {!isEmployeesLoading ? (
              <AutoCompleteSelector
                allSearchItems={employeeOptions}
                typeOfSelectedItem={"currentEmployeeId"}
                placeholder={"Select employee"}
                name={"employeeId"}
                disabled={isEmployeesLoading || isEmployeesError}
                useSessionStorage={true}
                onSelectionChange={handleEmployeeChange}
                initialValue={employeeId}
                disableClearable={true} // Prevent clearing the selection
              />
            ) : (
              <Skeleton variant="rectangular" fullwidth="true" height={48} />
            )}
          </div>
        </div>
      </div>
      {isObjectivesError ? (
        <TryAgain
          minHeight="calc(100vh - 165px)"
          message="An error occurred while loading data"
          handleTryAgain={refetch}
        />
      ) : (
        <>
          <Widget>
            <div className={styles.details}>
              <div className="user">
                <UserInfo
                  userData={{
                    name: teamMemberObjectives?.name || "",
                    img: teamMemberObjectives?.img || "",
                    jobTitle: teamMemberObjectives?.jobTitle || "",
                    badge: teamMemberObjectives?.badge || "",
                    notificationCount:
                      teamMemberObjectives?.pendingRequests || null,
                  }}
                  imgSize="imgLG"
                  nameSize="nameSM"
                  isLoading={
                    isObjectivesLoading || isTeamMemberObjectivesFetching
                  }
                  fullRadius={false}
                  withNotfication={true}
                />
              </div>
              <div className="quarter">
                <QuarterHeader
                  year={year}
                  quarter={quarter}
                  quarterMonths={quarterMonths}
                  direction="column"
                />
              </div>
            </div>
          </Widget>
          <Box sx={{ mt: "10px", minHeight: "calc(100vh - 290px)" }}>
            <Table
              rows={teamMemberObjectives?.smartObjectives || []}
              columns={columns}
              getRowId={(row) => row?.id || row?.ID}
              loading={isObjectivesLoading || isTeamMemberObjectivesFetching}
              error={
                isObjectivesError
                  ? {
                      message: "Error loading objectives. Please try again.",
                    }
                  : null
              }
            />

            <TableOptionsList anchorEl={anchorEl} setAnchorEl={setAnchorEl}>
              <MenuItem onClick={handleViewDetails}>Details</MenuItem>
              <MenuItem onClick={handleViewActivitiesLog}>
                activities log
              </MenuItem>
            </TableOptionsList>
          </Box>
        </>
      )}
    </Widget>
  );
};

export default CurrentObjectives;
