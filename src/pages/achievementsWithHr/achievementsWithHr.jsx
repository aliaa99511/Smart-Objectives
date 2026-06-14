import { useEffect, useState, useMemo, useCallback } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import TryAgain from "../../components/general/tryAgain/tryAgain.component";
import {
  FormControl,
  Select,
  MenuItem,
  Box,
  Grid2,
  Breadcrumbs,
} from "@mui/material";
import { MdOutlineCalendarToday } from "react-icons/md";
import SkeletonLoader from "../../components/general/skeletonLoader/skeletonLoader";
import Widget from "../../components/general/widget/widget.component";
import styles from "./achievementsWithHr.module.css";
import { useGetAchievementsLogByEmployeeIDQuery } from "../../appState/apis/smartObjectiveApiSlice";
import AchievementsCard from "../../components/general/myAchievements/achievementsCard.component";
import { getYearsArray } from "../../helpers/utilities/getYearsArray";
import UserInfo from "../../components/general/userInfo/userInfo.component";
import { useGetMyCompanyEmployeesQuery } from "../../appState/apis/hrSoApiSlice";
import useScrollRestoration from "../../hooks/useScrollRestoration";

const AchievementsWithHr = () => {
  const [years, setYears] = useState([]);
  const [employeeId, setEmployeeId] = useState(null);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const navigate = useNavigate();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const departmentId = searchParams.get("departmentId") || null;
  const departmentTitle = searchParams.get("departmentTitle") || null;

  // Memoize updateYearInUrl to prevent unnecessary recreations
  const updateYearInUrl = useCallback(
    (year) => {
      const searchParams = new URLSearchParams(location.search);
      searchParams.set("year", year);

      navigate(
        {
          pathname: location.pathname,
          search: searchParams.toString(),
        },
        { replace: true },
      );
    },
    [location.pathname, location.search, navigate],
  );

  // Get employeeId from location state or session storage for page refreshes
  useEffect(() => {
    if (location.state?.employeeId) {
      setEmployeeId(location.state.employeeId);
      sessionStorage.setItem("currentEmployeeId", location.state.employeeId);
      window.history.replaceState({}, document.title);
    } else {
      const storedEmployeeId = sessionStorage.getItem("currentEmployeeId");
      if (storedEmployeeId) {
        setEmployeeId(storedEmployeeId);
      } else {
        savePositionAndNavigate('achievements', navigate, "/myCompany");
      }
    }
  }, [location, navigate]);

  // Fetch achievements data filtered by employeeId
  const {
    data: achievementsData = [],
    isLoading,
    isFetching,
    isError,
    error,
    refetch,
  } = useGetAchievementsLogByEmployeeIDQuery(
    {
      employeeId: employeeId,
    },
    {
      skip: !employeeId,
    },
  );

  // Use scroll restoration hook
  const shouldRestore = !isLoading && !isFetching && achievementsData;
  const { saveScrollPosition } = useScrollRestoration('achievements', shouldRestore);

  const handleYearChange = (event) => {
    saveScrollPosition();
    const newYear = event.target.value;
    setSelectedYear(newYear);
    updateYearInUrl(newYear);
  };

  // Get all available years from achievements for the dropdown
  const allYearsFromData = useMemo(() => {
    const yearsSet = new Set();

    achievementsData.forEach((item) => {
      if (item.Date) {
        try {
          const date = new Date(item.Date);
          const year = date.getFullYear();
          if (!isNaN(year)) {
            yearsSet.add(year);
          }
        } catch (e) {
          console.warn("Invalid date format:", item.Date);
        }
      }
    });

    const yearsArray = Array.from(yearsSet);
    if (yearsArray.length === 0) {
      yearsArray.push(new Date().getFullYear());
    }

    return yearsArray.sort((a, b) => b - a);
  }, [achievementsData]);

  // Filter achievements by selected year
  const filteredAchievements = useMemo(() => {
    return achievementsData.filter((achievement) => {
      if (achievement.Date) {
        try {
          const date = new Date(achievement.Date);
          const year = date.getFullYear();
          return year === selectedYear;
        } catch (e) {
          return false;
        }
      }
      return false;
    });
  }, [achievementsData, selectedYear]);

  // Initialize years and selectedYear from URL or data
  useEffect(() => {
    const yearsArray = getYearsArray(2015);
    setYears(yearsArray);

    const searchParams = new URLSearchParams(location.search);
    const yearParam = searchParams.get("year");

    if (yearParam) {
      const yearNum = Number(yearParam);
      if (yearNum !== selectedYear) {
        setSelectedYear(yearNum);
      }
    } else if (allYearsFromData.length > 0) {
      const mostRecentYear = Math.max(...allYearsFromData);
      if (mostRecentYear !== selectedYear) {
        setSelectedYear(mostRecentYear);
        updateYearInUrl(mostRecentYear);
      }
    }
  }, [allYearsFromData]);

  // Handle URL changes separately
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const yearParam = searchParams.get("year");

    if (yearParam) {
      const yearNum = Number(yearParam);
      if (yearNum !== selectedYear) {
        setSelectedYear(yearNum);
      }
    }
  }, [location.search]);

  const selectedDepartmentId = searchParams.get("departmentId") || null;

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

  const employeeOptions = companyEmployees?.map((member) => {
    return {
      Id: member.id,
      Title: member.name,
      img: member.img,
      jobTitle: member.jobTitle,
    };
  });

  const selectedEmployee = employeeOptions?.find(
    (member) => member.Id == employeeId,
  );

  return (
    <>
      <Widget>
        <Breadcrumbs className={styles.breadcrumbs} aria-label="breadcrumb">
          <Link to="/myCompany">Company</Link>
          <Link to={`/myCompany?selectedDepartmentId=${departmentId}`}>
            {departmentTitle}
          </Link>
          <div className={styles.pageName}>
            <span>{"Achievements Log"}</span>
          </div>
        </Breadcrumbs>
        <div className={styles.header}>
          <h1 className={styles.title}>Achievements</h1>
          <div>
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
      </Widget>
      <Widget>
        <div className={styles.details}>
          <div className="user">
            <UserInfo
              userData={{
                name: selectedEmployee?.Title || "",
                img: selectedEmployee?.img || "",
                jobTitle: selectedEmployee?.jobTitle || "",
                badge: selectedEmployee?.badge || "",
              }}
              imgSize="imgLG"
              nameSize="nameSM"
              isLoading={isEmployeesLoading}
              fullRadius={false}
              withNotfication={true}
            />
          </div>
        </div>
      </Widget>

      <div>
        {isLoading || isFetching ? (
          <SkeletonLoader count={6} />
        ) : isError ? (
          <TryAgain
            minHeight="calc(100vh - 175px)"
            message="An error occurred while loading achievements"
            handleTryAgain={refetch}
          />
        ) : filteredAchievements?.length === 0 ? (
          <Box sx={{ textAlign: "center", py: 8, color: "text.secondary" }}>
            No achievements found for {selectedYear}
          </Box>
        ) : (
          <Grid2 container spacing={2} alignItems="stretch">
            {filteredAchievements.map((achievement) => (
              <Grid2
                size={{ xs: 12, md: 6 }}
                key={achievement.Id}
                sx={{ display: "flex" }}
              >
                <AchievementsCard
                  achievement={achievement}
                  style={{ flex: 1 }}
                />
              </Grid2>
            ))}
          </Grid2>
        )}
      </div>
    </>
  );
};

export default AchievementsWithHr;