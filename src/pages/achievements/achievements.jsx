import { FormControl, Select, MenuItem, Box, Grid, Grid2 } from "@mui/material";
import Widget from "../../components/general/widget/widget.component";
import { MdOutlineCalendarToday } from "react-icons/md";
import { useEffect, useState, useMemo } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { getYearsArray } from "../../helpers/utilities/getYearsArray";
import styles from "./achievements.module.css";
import { useGetAchievementsLogByEmployeeIDQuery } from "../../appState/apis/smartObjectiveApiSlice";
import { useFetchCurrentUserQuery } from "../../appState/apis/userApiSlice";
import TryAgain from "../../components/general/tryAgain/tryAgain.component";
import SkeletonLoader from "../../components/general/skeletonLoader/skeletonLoader";
import AchievementsCard from "../../components/general/myAchievements/achievementsCard.component";

const Achievements = () => {
    const [years, setYears] = useState([]);
    const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
    const navigate = useNavigate();
    const location = useLocation();

    const { data: userData } = useFetchCurrentUserQuery();

    // Fetch achievements data filtered by employeeId
    const {
        data: achievementsData = [],
        isLoading,
        isFetching,
        isError,
        error,
        refetch,
    } = useGetAchievementsLogByEmployeeIDQuery({
        employeeId: userData?.userId,
    });

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

    useEffect(() => {
        let yearsArray;

        if (allYearsFromData.length > 0) {
            yearsArray = allYearsFromData;
        } else {
            yearsArray = getYearsArray(2015);
        }

        setYears(yearsArray);

        const searchParams = new URLSearchParams(location.search);
        const yearParam = searchParams.get("year");

        if (yearParam) {
            setSelectedYear(Number(yearParam));
        } else if (allYearsFromData.length > 0) {
            const mostRecentYear = Math.max(...allYearsFromData);
            setSelectedYear(mostRecentYear);
            updateYearInUrl(mostRecentYear);
        } else {
            updateYearInUrl(selectedYear);
        }
    }, [location.search, allYearsFromData]);

    return (
        <>
            <Widget>
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
    )
}

export default Achievements;