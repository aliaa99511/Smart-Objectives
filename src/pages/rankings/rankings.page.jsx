import {
    Box,
    Typography,
    Avatar,
    Chip,
    MenuItem,
    Select,
    Stack,
    FormControl,
    Skeleton,
    IconButton,
} from "@mui/material";
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useGetDepartmentsQuery } from "../../appState/apis/hrSoApiSlice";
import { useGetAchieversRankingQuery } from "../../appState/apis/smartObjectiveApiSlice";
import AutoCompleteSelector from "../../components/general/autoCompleteSelector/autoCompleteSelector.component";
import Widget from "../../components/general/widget/widget.component";
import Table from "../../components/general/table/table.component";
import TryAgain from "../../components/general/tryAgain/tryAgain.component";
import { MdOutlineCalendarToday } from "react-icons/md";
import { IoIosArrowBack } from "react-icons/io";
import { getYearsArray } from "../../helpers/utilities/getYearsArray";

const RankingsPage = () => {
    const [years, setYears] = useState([]);
    const location = useNavigate();
    const navigate = useNavigate();

    const searchParams = new URLSearchParams(location.search);

    const yearParam = searchParams.get("year");
    const departmentParam = searchParams.get("departmentId");

    // Get current year for default
    const currentYear = new Date().getFullYear();

    const [selectedYear, setSelectedYear] = useState(
        yearParam ? Number(yearParam) : currentYear
    );

    const [selectedDepartmentId, setSelectedDepartmentId] = useState(
        departmentParam ? Number(departmentParam) : 0
    );

    // Initialize years array
    useEffect(() => {
        const yearsArray = getYearsArray(2015);
        setYears(yearsArray);

        if (!yearParam) {
            updateYearInUrl(selectedYear);
        }
    }, []);

    /* ================= Update Year in URL ================= */
    const updateYearInUrl = (year) => {
        const searchParams = new URLSearchParams(location.search);
        searchParams.set("year", year);
        searchParams.set("departmentId", selectedDepartmentId.toString());

        navigate(
            {
                pathname: location.pathname,
                search: searchParams.toString(),
            },
            { replace: true }
        );
    };

    /* ================= Departments ================= */
    const { data: departments = [], isLoading: isDepartmentsLoading } = useGetDepartmentsQuery();

    const departmentOptions = useMemo(
        () => [
            { Id: 0, Title: "All Departments" },
            ...departments.map((d) => ({
                Id: d.Id,
                Title: d.Title,
            })),
        ],
        [departments]
    );

    /* ================= Rankings ================= */
    const {
        data: achievers = [],
        isLoading: isLoadingRankings,
        isFetching: isFetchingRankings,
        isError,
        refetch,
    } = useGetAchieversRankingQuery({
        year: selectedYear,
        departmentId: selectedDepartmentId,
        achieversCount: 0,
    });

    /* ================= Handle Filter Changes ================= */
    const handleYearChange = (event) => {
        const newYear = event.target.value;
        setSelectedYear(newYear);
    };

    const handleDepartmentChange = (id) => {
        setSelectedDepartmentId(id ?? 0);
    };

    /* ================= URL Sync ================= */
    useEffect(() => {
        const params = new URLSearchParams();
        params.set("year", selectedYear.toString());
        params.set("departmentId", selectedDepartmentId.toString());

        navigate(
            { pathname: location.pathname, search: params.toString() },
            { replace: true }
        );
    }, [selectedYear, selectedDepartmentId]);

    /* ================= Table Data ================= */
    const rows = useMemo(() =>
        achievers.map((item, index) => ({
            id: item.Employee.Id,
            rank: index + 1,
            name: item.Employee.Name,
            jobTitle: item.Employee.JobTitle,
            image: item.Employee.Image?.URL,
            department: item.Employee.DepartmentName || "—",
            achievementCount: item.AchievementCount,
            totalWeight: item.TotalWeight,
        })),
        [achievers]
    );

    /* ================= Table Columns ================= */
    const columns = [
        {
            field: "rank",
            headerName: "Rank",
            flex: 0.5,
            minWidth: 80,
            renderCell: (params) => (
                <Typography
                    fontWeight={600}
                    sx={{
                        color: params.value === 1
                            ? "#FF9800"
                            : params.value === 2
                                ? "#9E9E9E"
                                : params.value === 3
                                    ? "#CD7F32"
                                    : "#6E56CF",
                    }}
                >
                    #{params.value}
                </Typography>
            ),
        },
        {
            field: "employee",
            headerName: "Employee",
            flex: 2,
            minWidth: 250,
            renderCell: (params) => {
                let borderColor = "transparent";
                if (params.row.rank === 1) borderColor = "#FF9800";
                else if (params.row.rank === 2) borderColor = "#9E9E9E";
                else if (params.row.rank === 3) borderColor = "#CD7F32";

                return (
                    <Stack direction="row" spacing={1.5} alignItems="center">
                        <Avatar
                            src={params.row.image}
                            sx={{
                                width: 40,
                                height: 40,
                                border: `2px solid ${borderColor}`,
                            }}
                        >
                            {params.row.name?.[0]}
                        </Avatar>

                        <Box
                            sx={{
                                display: "flex",
                                flexDirection: "column",
                                lineHeight: 1,
                            }}
                        >
                            <Typography fontSize={14} fontWeight={500}>
                                {params.row.name}
                            </Typography>
                            <Typography fontSize={12} color="text.secondary">
                                {params.row.jobTitle}
                            </Typography>
                        </Box>
                    </Stack>
                );
            },
        },
        {
            field: "achievementCount",
            headerName: "Total Achievements",
            flex: 1,
            minWidth: 150,
            renderCell: (params) => (
                <Chip
                    label={`${params.value} Achievements`}
                    sx={{
                        bgcolor: "#EFE9FF",
                        color: "#6E56CF",
                        fontWeight: 500,
                        width: "fit-content",
                    }}
                />
            ),
        },
        {
            field: "department",
            headerName: "Department",
            flex: 1.5,
            minWidth: 150,
        },
    ];

    return (
        <Widget>
            {/* Header Section */}
            <Box sx={{ mb: 3, position: 'relative' }}>
                <Stack
                    direction={{ xs: 'column', sm: 'row' }}
                    justifyContent="space-between"
                    alignItems={{ xs: 'flex-start', sm: 'center' }}
                    spacing={2}
                >
                    <Stack direction="row" alignItems="center" spacing={1}>
                        <IconButton
                            onClick={() => navigate("/ceo/dashboard")}
                            sx={{
                                '&:hover': {
                                    backgroundColor: 'action.hover',
                                }
                            }}
                        >
                            <IoIosArrowBack size={20} />
                        </IconButton>
                        <Typography variant="body1" fontWeight={600}>
                            Full Ranking
                        </Typography>
                    </Stack>
                    <Stack
                        direction={{ xs: 'column', sm: 'row' }}
                        spacing={2}
                        sx={{ width: { xs: '100%', sm: 'auto' } }}
                    >
                        <FormControl size="small" sx={{ minWidth: 125 }}>
                            <Select
                                labelId="year-select-label"
                                id="year-select"
                                value={selectedYear}
                                onChange={handleYearChange}
                                startAdornment={
                                    <Box sx={{
                                        mr: 1,
                                        display: "flex",
                                        alignItems: "center",
                                        color: "text.secondary"
                                    }}>
                                        <MdOutlineCalendarToday />
                                    </Box>
                                }
                                sx={{
                                    minWidth: "120px",
                                    "& .MuiSelect-select": {
                                        display: "flex",
                                        alignItems: "center",
                                        paddingLeft: "8px",
                                        padding: "11px 0"
                                    },
                                }}
                                disabled={isFetchingRankings}
                            >
                                {years.map((year) => (
                                    <MenuItem key={year} value={year}>
                                        {year}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>

                        {/* Department Selector */}
                        <Box sx={{ flex: 1, minWidth: 240 }}>
                            {!isDepartmentsLoading ? (
                                <AutoCompleteSelector
                                    allSearchItems={departmentOptions}
                                    typeOfSelectedItem="departmentId"
                                    placeholder="Select department"
                                    name="departmentId"
                                    initialValue={selectedDepartmentId}
                                    onSelectionChange={handleDepartmentChange}
                                    disabled={isFetchingRankings}
                                />
                            ) : (
                                <Skeleton
                                    variant="rectangular"
                                    width="100%"
                                    height={40}
                                />
                            )}
                        </Box>
                    </Stack>
                </Stack>
            </Box>

            {/* Table Section */}
            {isError ? (
                <TryAgain
                    minHeight="400px"
                    message="Failed to load rankings"
                    handleTryAgain={refetch}
                />
            ) : (
                <Table
                    rows={rows}
                    columns={columns}
                    getRowId={(row) => row.id}
                    loading={isLoadingRankings || isFetchingRankings}
                    getRowHeight={() => 80}
                />
            )}
        </Widget>
    );
};

export default RankingsPage;