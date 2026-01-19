
import { useEffect, useState, useMemo, useCallback } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import TryAgain from "../../components/general/tryAgain/tryAgain.component";
import { FormControl, Select, MenuItem, Box, Grid2 } from "@mui/material";
import { MdOutlineCalendarToday } from "react-icons/md";
import SkeletonLoader from "../../components/general/skeletonLoader/skeletonLoader";
import Widget from "../../components/general/widget/widget.component";
import AchievementsCard from "../../components/general/myAchievements/achievementsCard.component";
import styles from "./achievementsWithManager.module.css"
import { useGetAchievementsLogByEmployeeIDQuery } from "../../appState/apis/smartObjectiveApiSlice";

const AchievementsWithManager = () => {
    const [years, setYears] = useState([]);
    const [employeeId, setEmployeeId] = useState(null);
    const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
    const navigate = useNavigate();
    const location = useLocation();

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
};

export default AchievementsWithManager;














// import { useEffect, useState, useMemo, useCallback, useRef } from "react";
// import { useNavigate, useLocation } from "react-router-dom";
// import TryAgain from "../../components/general/tryAgain/tryAgain.component";
// import { FormControl, Select, MenuItem, Box, Grid2 } from "@mui/material";
// import { MdOutlineCalendarToday } from "react-icons/md";
// import SkeletonLoader from "../../components/general/skeletonLoader/skeletonLoader";
// import Widget from "../../components/general/widget/widget.component";
// import AchievementsCard from "../../components/general/myAchievements/achievementsCard.component";
// import styles from "./achievementsWithManager.module.css"
// import { useGetAchievementsLogByEmployeeIDQuery } from "../../appState/apis/smartObjectiveApiSlice";

// // Helper function outside component to avoid recreation
// const getYearsArray = (startYear) => {
//     const currentYear = new Date().getFullYear();
//     const years = [];
//     for (let year = startYear; year <= currentYear; year++) {
//         years.push(year);
//     }
//     return years.reverse();
// };

// const AchievementsWithManager = () => {
//     const [years, setYears] = useState([]);
//     const [employeeId, setEmployeeId] = useState(null);
//     const [selectedYear, setSelectedYear] = useState(() => {
//         // Initialize from URL if available
//         const searchParams = new URLSearchParams(window.location.search);
//         const yearParam = searchParams.get("year");
//         return yearParam ? Number(yearParam) : new Date().getFullYear();
//     });

//     const navigate = useNavigate();
//     const location = useLocation();
//     const initialLoadComplete = useRef(false);

//     // Memoize updateYearInUrl
//     const updateYearInUrl = useCallback((year) => {
//         const searchParams = new URLSearchParams(location.search);
//         if (searchParams.get("year") !== String(year)) {
//             searchParams.set("year", year);
//             navigate(
//                 {
//                     pathname: location.pathname,
//                     search: searchParams.toString(),
//                 },
//                 { replace: true }
//             );
//         }
//     }, [location.pathname, location.search, navigate]);

//     // Handle employee ID initialization - only once on mount
//     useEffect(() => {
//         if (initialLoadComplete.current) return;

//         let idToSet = null;

//         if (location.state?.employeeId) {
//             idToSet = location.state.employeeId;
//             sessionStorage.setItem("currentEmployeeId", idToSet);
//             window.history.replaceState({}, document.title);
//         } else {
//             const storedEmployeeId = sessionStorage.getItem("currentEmployeeId");
//             if (storedEmployeeId) {
//                 idToSet = storedEmployeeId;
//             }
//         }

//         if (idToSet) {
//             setEmployeeId(idToSet);
//         } else {
//             navigate("/myTeam");
//         }

//         initialLoadComplete.current = true;
//     }, [location, navigate]);

//     // Fetch achievements data
//     const {
//         data: achievementsData = [],
//         isLoading,
//         isFetching,
//         isError,
//         error,
//         refetch,
//     } = useGetAchievementsLogByEmployeeIDQuery({
//         employeeId: employeeId,
//     }, {
//         skip: !employeeId,
//         refetchOnMountOrArgChange: true,
//         // Consider adding polling or cache configuration if needed
//     });

//     const handleYearChange = useCallback((event) => {
//         const newYear = event.target.value;
//         setSelectedYear(newYear);
//         updateYearInUrl(newYear);
//     }, [updateYearInUrl]);

//     // Get all available years from achievements
//     const allYearsFromData = useMemo(() => {
//         const yearsSet = new Set();

//         achievementsData.forEach(item => {
//             if (item.Date) {
//                 try {
//                     const date = new Date(item.Date);
//                     const year = date.getFullYear();
//                     if (!isNaN(year)) {
//                         yearsSet.add(year);
//                     }
//                 } catch (e) {
//                     // Silently handle invalid dates
//                 }
//             }
//         });

//         const yearsArray = Array.from(yearsSet);
//         if (yearsArray.length === 0) {
//             yearsArray.push(new Date().getFullYear());
//         }

//         return yearsArray.sort((a, b) => b - a);
//     }, [achievementsData]);

//     // Filter achievements by selected year
//     const filteredAchievements = useMemo(() => {
//         return achievementsData.filter(achievement => {
//             if (achievement.Date) {
//                 try {
//                     const date = new Date(achievement.Date);
//                     return date.getFullYear() === selectedYear;
//                 } catch (e) {
//                     return false;
//                 }
//             }
//             return false;
//         });
//     }, [achievementsData, selectedYear]);

//     // Initialize years when data changes
//     useEffect(() => {
//         let yearsArray;

//         if (allYearsFromData.length > 0) {
//             yearsArray = allYearsFromData;
//         } else {
//             yearsArray = getYearsArray(2015);
//         }

//         setYears(yearsArray);

//         // Only set default year on initial data load when no URL param exists
//         const searchParams = new URLSearchParams(location.search);
//         const hasYearParam = searchParams.has("year");

//         if (!hasYearParam && allYearsFromData.length > 0) {
//             const mostRecentYear = Math.max(...allYearsFromData);
//             if (mostRecentYear !== selectedYear) {
//                 setSelectedYear(mostRecentYear);
//                 // Don't update URL here to avoid navigation loop
//                 // URL will be updated when user interacts or via separate effect
//             }
//         }
//     }, [allYearsFromData]); // Don't add location.search or selectedYear as dependencies

//     // Sync URL when selectedYear changes (except on initial load)
//     useEffect(() => {
//         if (initialLoadComplete.current) {
//             updateYearInUrl(selectedYear);
//         }
//     }, [selectedYear, updateYearInUrl]);

//     // Handle external URL changes (browser back/forward)
//     useEffect(() => {
//         const searchParams = new URLSearchParams(location.search);
//         const yearParam = searchParams.get("year");

//         if (yearParam) {
//             const yearNum = Number(yearParam);
//             if (yearNum !== selectedYear) {
//                 setSelectedYear(yearNum);
//             }
//         }
//     }, [location.search]); // Only runs when URL changes externally

//     // Memoize the loading state to prevent unnecessary re-renders
//     const isLoadingState = useMemo(() =>
//         isLoading || isFetching,
//         [isLoading, isFetching]
//     );

//     // Show loading state if no employeeId yet
//     if (!employeeId) {
//         return <SkeletonLoader count={3} />;
//     }

//     return (
//         <>
//             <Widget>
//                 <div className={styles.header}>
//                     <h1 className={styles.title}>Achievements</h1>
//                     <div>
//                         <FormControl variant="outlined" size="small">
//                             <Select
//                                 labelId="year-select-label"
//                                 id="year-select"
//                                 value={selectedYear}
//                                 onChange={handleYearChange}
//                                 startAdornment={
//                                     <Box sx={{ mr: 1, display: "flex", alignItems: "center" }}>
//                                         <MdOutlineCalendarToday />
//                                     </Box>
//                                 }
//                                 sx={{
//                                     minWidth: "120px",
//                                     "& .MuiSelect-select": {
//                                         display: "flex",
//                                         alignItems: "center",
//                                         paddingLeft: "8px",
//                                     },
//                                 }}
//                             >
//                                 {years.map((year) => (
//                                     <MenuItem key={year} value={year}>
//                                         {year}
//                                     </MenuItem>
//                                 ))}
//                             </Select>
//                         </FormControl>
//                     </div>
//                 </div>
//             </Widget>

//             <div>
//                 {isLoadingState ? (
//                     <SkeletonLoader count={6} />
//                 ) : isError ? (
//                     <TryAgain
//                         minHeight="calc(100vh - 175px)"
//                         message="An error occurred while loading achievements"
//                         handleTryAgain={refetch}
//                     />
//                 ) : filteredAchievements.length === 0 ? (
//                     <Box sx={{ textAlign: "center", py: 8, color: "text.secondary" }}>
//                         No achievements found for {selectedYear}
//                     </Box>
//                 ) : (
//                     <Grid2 container spacing={2} alignItems="stretch">
//                         {filteredAchievements.map((achievement) => (
//                             <Grid2 size={{ xs: 12, md: 6 }} key={achievement.Id} sx={{ display: 'flex' }}>
//                                 <AchievementsCard achievement={achievement} style={{ flex: 1 }} />
//                             </Grid2>
//                         ))}
//                     </Grid2>
//                 )}
//             </div>
//         </>
//     );
// };

// export default AchievementsWithManager;












