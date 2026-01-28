
import { useEffect, useState, useMemo, useCallback } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import TryAgain from "../../components/general/tryAgain/tryAgain.component";
import { FormControl, Select, MenuItem, Box, Grid2, Breadcrumbs } from "@mui/material";
import { MdOutlineCalendarToday } from "react-icons/md";
import SkeletonLoader from "../../components/general/skeletonLoader/skeletonLoader";
import Widget from "../../components/general/widget/widget.component";
import styles from "./achievementsWithHr.module.css"
import { useGetAchievementsLogByEmployeeIDQuery } from "../../appState/apis/smartObjectiveApiSlice";
import AchievementsCard from "../../components/general/myAchievements/achievementsCard.component";

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
    const updateYearInUrl = useCallback((year) => {
        const searchParams = new URLSearchParams(location.search);
        searchParams.set("year", year);

        navigate(
            {
                pathname: location.pathname,
                search: searchParams.toString(),
            },
            { replace: true }
        );
    }, [location.pathname, location.search, navigate]);

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
                // If not found anywhere, redirect to myTeam
                navigate("/myTeam");
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
    } = useGetAchievementsLogByEmployeeIDQuery({
        employeeId: employeeId,
    }, {
        skip: !employeeId, // Skip the query if employeeId is not available
    });

    const handleYearChange = (event) => {
        const newYear = event.target.value;
        setSelectedYear(newYear);
        updateYearInUrl(newYear);
    };

    // Get all available years from achievements for the dropdown
    const allYearsFromData = useMemo(() => {
        const yearsSet = new Set();

        achievementsData.forEach(item => {
            if (item.Date) {
                try {
                    const date = new Date(item.Date);
                    const year = date.getFullYear();
                    if (!isNaN(year)) {
                        yearsSet.add(year);
                    }
                } catch (e) {
                    console.warn('Invalid date format:', item.Date);
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
        return achievementsData.filter(achievement => {
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
        // Get years from data or create default array
        let yearsArray;
        if (allYearsFromData.length > 0) {
            yearsArray = allYearsFromData;
        } else {
            // Helper function to create years array
            const getYearsArray = (startYear) => {
                const currentYear = new Date().getFullYear();
                const years = [];
                for (let year = startYear; year <= currentYear; year++) {
                    years.push(year);
                }
                return years.reverse();
            };
            yearsArray = getYearsArray(2015);
        }

        setYears(yearsArray);

        // Parse year from URL
        const searchParams = new URLSearchParams(location.search);
        const yearParam = searchParams.get("year");

        if (yearParam) {
            const yearNum = Number(yearParam);
            // Only update if different from current selectedYear
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
        // Don't update URL if selectedYear is already set and no URL param exists
        // This prevents infinite loops
    }, [allYearsFromData]); // Removed location.search from dependencies

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
    }, [location.search]); // This only runs when URL changes externally

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
                            <Grid2 size={{ xs: 12, md: 6 }} key={achievement.Id} sx={{ display: 'flex' }}>
                                <AchievementsCard achievement={achievement} style={{ flex: 1 }} />
                            </Grid2>
                        ))}
                    </Grid2>
                )}
            </div>
        </>
    );
}

export default AchievementsWithHr