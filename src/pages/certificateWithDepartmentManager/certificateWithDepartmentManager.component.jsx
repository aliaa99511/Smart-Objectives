import {
  Box,
  Breadcrumbs,
  FormControl,
  MenuItem,
  Select,
  Typography,
} from "@mui/material";
import Widget from "../../components/general/widget/widget.component";
import { Link, useLocation, useNavigate } from "react-router-dom";
import UserInfo from "../../components/general/userInfo/userInfo.component";
import styles from "./certificateWithDepartmentManager.module.css";
import { MdOutlineCalendarToday } from "react-icons/md";
import { useEffect, useState } from "react";
import { getYearsArray } from "../../helpers/utilities/getYearsArray";
import { useGetCertificatesQuery } from "../../appState/apis/smartObjectiveApiSlice";
import CertificatesContainer from "../../components/certificates/certificatesContainer/certificatesContainer.component";
import MainLoader from "../../components/general/mainLoader/mainLoader.component";
import TryAgain from "../../components/general/tryAgain/tryAgain.component";

const CertificateWithDepartmentManager = () => {
  const [years, setYears] = useState([]);
  const [employeeId, setEmployeeId] = useState(null);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const navigate = useNavigate();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const departmentId = searchParams.get("departmentId") || null;

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
        // If not found anywhere, redirect to myDepartment
        navigate("/myDepartment");
      }
    }
  }, [location, navigate]);

  useEffect(() => {
    // Get years array starting from 2015 to current year
    const yearsArray = getYearsArray(2015);
    setYears(yearsArray);

    // Check if year is in URL params

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

  // Fetch quarters log data using RTK Query
  const {
    data: certificates,
    isLoading,
    isFetching,
    isError,
    error,
    refetch,
  } = useGetCertificatesQuery({
    year: selectedYear,
    employeeId: employeeId,
  });

  return (
    <>
      <Widget>
        <Breadcrumbs className={styles.breadcrumbs} aria-label="breadcrumb">
          <Link to="/myDepartment">my department</Link>
          <div className={styles.pageName}>
            <span>{"certificate"}</span>
          </div>
        </Breadcrumbs>
        <div className={styles.header}>
          <h1 className={styles.title}>certificate</h1>
          <div className={styles.yearSelector}>
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
          </div>
        </div>
        {!isError && (
          <Widget>
            <div className={styles.details}>
              <div className="user">
                <UserInfo
                  userData={{
                    name: certificates?.employeeDetails?.name || "",
                    img: certificates?.employeeDetails?.img || "",
                    jobTitle: certificates?.employeeDetails?.jobTitle || "",
                    badge: certificates?.employeeDetails?.badge || "",
                    notificationCount:
                      certificates?.employeeDetails?.pendingRequests || null,
                  }}
                  imgSize="imgLG"
                  nameSize="nameSM"
                  isLoading={isLoading}
                  fullRadius={false}
                  withNotfication={true}
                />
              </div>
            </div>
          </Widget>
        )}
      </Widget>
      <Widget minHeight="calc(100vh - 280px)">
        {isLoading || isFetching ? (
          <MainLoader height={"calc(100vh - 325px)"} />
        ) : isError ? (
          <TryAgain
            minHeight="calc(100vh - 210px)"
            message="An error occurred while loading data"
            handleTryAgain={refetch}
          />
        ) : certificates?.certificatesArray?.length > 0 ? (
          <CertificatesContainer
            certificates={certificates?.certificatesArray}
          />
        ) : (
          <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            height="100%"
          >
            <Typography variant="body1" color="textSecondary">
              No certificates found for {selectedYear}
            </Typography>
          </Box>
        )}
      </Widget>
    </>
  );
};

export default CertificateWithDepartmentManager;
