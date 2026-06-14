import {
  Box,
  FormControl,
  IconButton,
  MenuItem,
  Select,
  Skeleton,
  Typography,
  Tooltip,
} from "@mui/material";
import Grid from "@mui/material/Grid2";
import Widget from "../../components/general/widget/widget.component";
import { MdOutlineCalendarToday } from "react-icons/md";
import AutoCompleteSelector from "../../components/general/autoCompleteSelector/autoCompleteSelector.component";
import styles from "./achievementsLogForDepartment.module.css";
import { getYearAndQuarter } from "../../helpers/utilities/getYearAndQuarter";
import { useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { getYearsArray } from "../../helpers/utilities/getYearsArray";
import {
  hrSoApiSlice,
  useGetAllAchieversByDepartmentQuery,
  useGetDepartmentsQuery,
  useGetMyCompanyEmployeesQuery,
} from "../../appState/apis/hrSoApiSlice";
import MainLoader from "../../components/general/mainLoader/mainLoader.component";
import TryAgain from "../../components/general/tryAgain/tryAgain.component";
import UserImg from "../../components/general/userImg/userImg.component";
import { MdUploadFile } from "react-icons/md";
import { useDispatch } from "react-redux";
import UserInfo from "../../components/general/userInfo/userInfo.component";
import { useGetEmployeeDetailsQuery } from "../../appState/apis/managerApprovalsSoApiSlice";
import { PiProhibitBold } from "react-icons/pi";

function AchievementsLogForDepartment() {
  const {
    data: departments,
    isLoading: isDepartmentsLoading,
    isError: isDepartmentsError,
  } = useGetDepartmentsQuery();

  const [employeeId, setEmployeeId] = useState(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const selectedDepartmentId = searchParams.get("selectedDepartmentId") || null;

  const isFromNavigation = location.state?.fromNavigation;

  // Get year and quarter from URL or use defaults
  const { year: defaultYear, quarter: defaultQuarter } = getYearAndQuarter();

  const [years, setYears] = useState([]);
  const [selectedYear, setSelectedYear] = useState(defaultYear);
  // const [selectedQuarter, setSelectedQuarter] = useState(defaultQuarter);

  const {
    data: companyEmployees,
    isLoading: isEmployeesLoading,
    isError: isEmployeesError,
    isFetching: isEmployeesFeatching,
  } = useGetMyCompanyEmployeesQuery(
    {
      departmentId: selectedDepartmentId,
      year: selectedYear,
      quarter: "1",
    },
    { skip: !selectedDepartmentId },
  );

  useEffect(() => {
    if (isFromNavigation) {
      sessionStorage.removeItem("currentEmployeeId");
      setEmployeeId(null);
    } else {
      const storedEmployeeId = sessionStorage.getItem("currentEmployeeId");
      if (storedEmployeeId) {
        setEmployeeId(storedEmployeeId);
      }
    }

    window.history.replaceState({}, document.title);
  }, []);

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
      }
    }
  }, [location, navigate]);

  // Handle employee selection from dropdown
  const handleEmployeeChange = (newEmployeeId) => {
    // If the user clears the selection (makes it empty)
    if (!newEmployeeId) {
      // Clear session storage
      sessionStorage.removeItem("currentEmployeeId");
      setEmployeeId(null);
      //revalidate the achievments query to show all achievers in the department
      dispatch(hrSoApiSlice.util.invalidateTags(["Achievers"]));

      // Redirect to myCompany page
      // navigate("/myCompany");
      return;
    }

    setEmployeeId(newEmployeeId);
    sessionStorage.setItem("currentEmployeeId", newEmployeeId);
    // Ensure location state is cleared when manually selecting a new employee
    if (location.state?.employeeId) {
      window.history.replaceState({}, document.title);
    }
  };

  // Update filters in URL
  const updateFiltersInUrl = (year, quarter) => {
    const params = new URLSearchParams(location.search);
    params.set("year", year);
    // params.set("quarter", quarter);

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
    // Get years array starting from 2015 to current year
    const yearsArray = getYearsArray(2015);
    setYears(yearsArray);

    // Check if year and quarter are in URL params
    const yearParam = searchParams.get("year");
    // const quarterParam = searchParams.get("quarter");

    if (yearParam) {
      setSelectedYear(Number(yearParam));
    }
    /*  if (quarterParam) {
      setSelectedQuarter(Number(quarterParam));
    } */

    // Set defaults in URL if not present
    // if (!yearParam || !quarterParam) {
    if (!yearParam) {
      const params = new URLSearchParams(location.search);
      params.set("year", yearParam || defaultYear);
      // params.set("quarter", quarterParam || defaultQuarter);

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
    // updateFiltersInUrl(newYear, selectedQuarter);
    updateFiltersInUrl(newYear);
  };

  const {
    data: achievements,
    isLoading,
    isFetching,
    isError,
    refetch,
  } = useGetAllAchieversByDepartmentQuery({
    year: selectedYear,
    departmentId: selectedDepartmentId,
    userId: employeeId || 0,
  });

  const {
    data: employeeDetails,
    isLoading: isLoadingEmployee,
    isFetching: isFetchingEmployee,
    isError: isErrorEmployee,
  } = useGetEmployeeDetailsQuery(employeeId, {
    skip: !employeeId,
  });

  return (
    <Widget minHeight="calc(100vh - 20px)">
      <div className={styles.header}>
        <Typography className={styles.title} variant="h6" fontWeight="bold">
          Achievements
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
          <div className={`${styles.filter} ${styles.departmentFilter}`}>
            {!isDepartmentsLoading ? (
              <AutoCompleteSelector
                allSearchItems={departments}
                typeOfSelectedItem={"selectedDepartmentId"}
                placeholder={"Select department"}
                onSelectionChange={
                  //reset the employee filter
                  () => {
                    handleEmployeeChange("");
                  }
                }
                name={"departmentId"}
                disabled={isDepartmentsLoading || isDepartmentsError}
                disableClearable={true}
              />
            ) : (
              <Skeleton variant="rectangular" fullwidth="true" height={48} />
            )}
          </div>
          <div className={`${styles.filter} ${styles.employeeFilter}`}>
            {!isEmployeesLoading ? (
              <AutoCompleteSelector
                allSearchItems={employeeOptions}
                typeOfSelectedItem={"currentEmployeeId"}
                placeholder={"Select employee"}
                name={"employeeId"}
                disabled={isEmployeesLoading || isEmployeesError}
                useSessionStorage={isFromNavigation ? false : true}
                onSelectionChange={handleEmployeeChange}
                initialValue={""}
                disableClearable={true} // Prevent clearing the selection
              />
            ) : (
              <Skeleton variant="rectangular" fullwidth="true" height={48} />
            )}
          </div>
        </div>
      </div>
      {employeeId && (
        <Widget>
          <div className={styles.details}>
            <div className="user">
              <UserInfo
                userData={{
                  name: employeeDetails?.name || "",
                  img: employeeDetails?.img || "",
                  jobTitle: employeeDetails?.jobTitle || "",
                  badge: employeeDetails?.badge || "",
                }}
                imgSize="imgLG"
                nameSize="nameSM"
                isLoading={isLoadingEmployee || isFetchingEmployee}
                fullRadius={false}
                withNotfication={true}
              />
            </div>
          </div>
        </Widget>
      )}

      {isLoading || isFetching ? (
        <MainLoader height="calc(100vh - 175px)" />
      ) : isError ? (
        <TryAgain
          minHeight="calc(100vh - 175px)"
          message="An error occurred while loading achievements"
          handleTryAgain={refetch}
        />
      ) : achievements?.length === 0 ? (
        <Box
          sx={{
            p: "16px",
            borderRadius: "8px",
            marginTop: "10px",
            color: "text.secondary",
            background: "#EBEBEB",
            fontSize: "14px",
            display: "flex",
            gap: "10px",
          }}
        >
          <span className={styles.iconNot}>
            <PiProhibitBold />{" "}
          </span>
          No Achievements this Year
        </Box>
      ) : (
        <Grid
          container
          spacing={2}
          sx={{ width: "100%", marginTop: `${employeeId ? "10px" : "0px"}` }}
        >
          {achievements?.map((atch) => {
            return (
              <Grid
                size={{ xs: 12, md: 6 }}
                className={styles.gridItem}
                key={atch?.achivementTitle}
              >
                <div className={styles.card}>
                  {!employeeId && (
                    <div className={styles.userImgContainer}>
                      <UserImg
                        isLoading={false}
                        img={atch?.employeeImg}
                        userName={atch?.employeeName}
                        withBorder={true}
                      />
                      <div className={styles.userInfo}>
                        <Typography
                          variant="h6"
                          fontWeight="bold"
                          fontSize="14px"
                        >
                          {atch?.employeeName}
                        </Typography>
                        <Typography
                          variant="div"
                          color="#818181"
                          fontSize="12px"
                        >
                          {atch?.achivementDate}
                        </Typography>
                      </div>
                    </div>
                  )}
                  <Typography
                    variant="h3"
                    fontWeight="bold"
                    color="#362396"
                    fontSize="14px"
                  >
                    {atch?.achivementTitle}
                  </Typography>
                  {employeeId && (
                    <Typography variant="div" color="#818181" fontSize="12px">
                      {atch?.achivementDate}
                    </Typography>
                  )}

                  <Tooltip
                    title={atch?.achivementDes?.replace(/<[^>]*>?/gm, "") || ""}
                    arrow
                    placement="top"
                    componentsProps={{
                      tooltip: {
                        sx: {
                          fontSize: "13px",
                          maxWidth: 400,
                          lineHeight: 1.6,
                          p: 1.2,
                        },
                      },
                    }}
                  >
                    <Typography
                      sx={{
                        mt: 3,
                        fontSize: "15px",
                        fontWeight: 500,
                        color: "#272727",
                        lineHeight: 1.6,
                        display: "-webkit-box",
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: "vertical",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        wordWrap: "break-word",
                      }}
                    >
                      {atch?.achivementDes?.replace(/<[^>]*>?/gm, "") || ""}
                    </Typography>
                  </Tooltip>
                  {atch?.achivementAttachments?.map((attachment) => {
                    return (
                      <div
                        key={attachment?.name}
                        className={styles.referenceItem}
                      >
                        <IconButton size="small" className={styles.icon}>
                          <MdUploadFile />
                        </IconButton>
                        <a
                          href={attachment?.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={styles.referenceLink}
                        >
                          {attachment?.name}
                        </a>
                      </div>
                    );
                  })}
                </div>
              </Grid>
            );
          })}
        </Grid>
      )}
    </Widget>
  );
}

export default AchievementsLogForDepartment;
