import React, { useState, useEffect, useRef } from "react";
import {
  Box,
  Card,
  Typography,
  Stack,
  Avatar,
  LinearProgress,
  Grid2,
  useTheme,
  FormControl,
  MenuItem,
  Select,
  CircularProgress,
  Skeleton,
} from "@mui/material";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { useGetOrganizationDashboardQuery } from "../../appState/apis/smartObjectiveApiSlice";
import ObjectiveOverviewCard from "../../components/general/objectiveOverviewCard/objectiveOverviewCard.component";
import { TbTargetArrow } from "react-icons/tb";
import { IoCheckmarkDoneSharp } from "react-icons/io5";
import { GoAlertFill } from "react-icons/go";
import { MdBarChart, MdAccessTimeFilled, MdOutlineCalendarToday } from "react-icons/md";
import TopOne from "../../assets/top-1.svg";
import TopTwo from "../../assets/top-2.svg";
import TopThree from "../../assets/top-3.svg";
import { useLocation, useNavigate } from "react-router-dom";
import { quarterOptions } from "../../settings/constants/options/quarterOptions";
import { getYearsArray } from "../../helpers/utilities/getYearsArray";
import Widget from "../../components/general/widget/widget.component";
import TryAgain from "../../components/general/tryAgain/tryAgain.component";

/* ================= Tooltip ================= */
const DepartmentTooltip = ({ active, payload }) => {
  if (!active || !payload?.length) return null;
  const d = payload[0].payload;

  return (
    <Box sx={{ p: 1.5, bgcolor: "#111827", color: "#fff", borderRadius: 2 }}>
      <Typography fontSize={12}>Progress: {d.progress}%</Typography>
      <Typography fontSize={12}>Achieved: {d.achievedCount}</Typography>
      <Typography fontSize={12}>Total: {d.objectiveCount}</Typography>
    </Box>
  );
};

/* ================= Colors ================= */
const CATEGORY_COLORS = [
  "#4F46E5",
  "#6366F1",
  "#818CF8",
  "#C7D2FE",
  "#E5E7EB",
];

/* ================= Loading Components ================= */
const OverviewLoadingSkeleton = () => (
  <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap", mb: 1.35 }}>
    {[...Array(5)].map((_, index) => (
      <Card key={index} sx={{ p: 2.5, borderRadius: 3, flex: 1, minWidth: 180 }}>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={2}>
          <Box>
            <Skeleton variant="text" width={100} height={20} />
            <Skeleton variant="text" width={80} height={30} />
          </Box>
          <Skeleton variant="circular" width={40} height={40} />
        </Stack>
        <Skeleton variant="text" width={100} height={16} />
      </Card>
    ))}
  </Box>
);

const DepartmentChartLoading = () => (
  <Card sx={{ pt: 1, borderRadius: 3, overflow: 'hidden', height: 340 }}>
    <Skeleton variant="text" width={250} height={24} sx={{ m: 1.5, ml: 2 }} />
    <Box sx={{ height: 280, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <CircularProgress />
    </Box>
  </Card>
);

const TopAchieversLoading = () => (
  <Card sx={{ p: 2.5, borderRadius: 3 }}>
    <Stack direction="row" justifyContent="space-between" mb={1.2}>
      <Box>
        <Skeleton variant="text" width={150} height={24} />
        <Skeleton variant="text" width={200} height={16} />
      </Box>
      <Skeleton variant="text" width={100} height={16} />
    </Stack>
    <Grid2 container spacing={2}>
      {[...Array(3)].map((_, index) => (
        <Grid2 size={{ xs: 12, md: 4 }} key={index}>
          <Card variant="outlined" sx={{ p: 2, borderRadius: 3, textAlign: "center" }}>
            <Skeleton variant="circular" width={50} height={50} sx={{ mx: 'auto', my: 2 }} />
            <Skeleton variant="text" width={120} height={24} sx={{ mx: 'auto' }} />
            <Skeleton variant="text" width={100} height={16} sx={{ mx: 'auto' }} />
            <Skeleton variant="rectangular" width={120} height={40} sx={{ mx: 'auto', mt: 2, borderRadius: 10 }} />
          </Card>
        </Grid2>
      ))}
    </Grid2>
  </Card>
);

const CategoriesLoading = () => (
  <Card sx={{ p: 2.5, borderRadius: 3, height: "100%" }}>
    <Skeleton variant="text" width={180} height={24} />
    <Skeleton variant="text" width={250} height={16} sx={{ mb: 2 }} />

    <Box sx={{ height: 180, display: "flex", alignItems: "center", justifyContent: "center" }}>
      <CircularProgress />
    </Box>

    <Stack spacing={1.2} mt={3}>
      {[...Array(5)].map((_, index) => (
        <Stack key={index} direction="row" justifyContent="space-between">
          <Stack direction="row" spacing={1} alignItems="center">
            <Skeleton variant="circular" width={10} height={10} />
            <Skeleton variant="text" width={80} height={16} />
          </Stack>
          <Skeleton variant="text" width={40} height={16} />
        </Stack>
      ))}
    </Stack>

    <Box sx={{ mt: 8 }}>
      <Stack direction="row" justifyContent="space-between">
        <Skeleton variant="text" width={120} height={16} />
        <Skeleton variant="text" width={40} height={24} />
      </Stack>
      <Skeleton variant="rectangular" height={12} sx={{ mt: 1, borderRadius: 5 }} />
    </Box>
  </Card>
);

/* ================= Page ================= */
const DashboardPage = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const location = useLocation();

  // State for filters
  const [years, setYears] = useState([]);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [selectedQuarter, setSelectedQuarter] = useState(1);
  const [isFiltering, setIsFiltering] = useState(false);
  const previousFilters = useRef({ year: null, quarter: null });

  // Initialize years array
  useEffect(() => {
    const yearsArray = getYearsArray(2015);
    setYears(yearsArray);
  }, []);

  // Get query parameters from URL
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const yearParam = searchParams.get("year");
    const quarterParam = searchParams.get("quarter");

    if (yearParam) {
      setSelectedYear(Number(yearParam));
    } else {
      updateYearInUrl(selectedYear);
    }

    if (quarterParam) {
      setSelectedQuarter(Number(quarterParam));
    } else {
      updateQuarterInUrl(selectedQuarter);
    }
  }, [location.search]);

  // Update year in URL
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

  // Update quarter in URL
  const updateQuarterInUrl = (quarter) => {
    const searchParams = new URLSearchParams(location.search);
    searchParams.set("quarter", quarter);

    navigate(
      {
        pathname: location.pathname,
        search: searchParams.toString(),
      },
      { replace: true }
    );
  };

  // Handle year change
  const handleYearChange = (event) => {
    const newYear = event.target.value;

    // Check if filter actually changed
    if (newYear !== selectedYear) {
      setIsFiltering(true);
      previousFilters.current = { year: selectedYear, quarter: selectedQuarter };
      setSelectedYear(newYear);
      updateYearInUrl(newYear);
    }
  };

  // Handle quarter change
  const handleQuarterChange = (quarterId) => {
    // Check if filter actually changed
    if (quarterId !== selectedQuarter) {
      setIsFiltering(true);
      previousFilters.current = { year: selectedYear, quarter: selectedQuarter };
      setSelectedQuarter(quarterId);
      updateQuarterInUrl(quarterId);
    }
  };

  // Fetch dashboard data with filters
  const { data, isLoading, isError, refetch, isFetching } = useGetOrganizationDashboardQuery({
    year: selectedYear,
    quarter: selectedQuarter,
    topAchieverCount: 3,
  });

  // Reset filtering state when data loads
  useEffect(() => {
    if (!isFetching && data) {
      setIsFiltering(false);
    }
  }, [isFetching, data]);

  // Show loading when initially loading or when filtering
  const showLoading = isLoading || (isFiltering && isFetching);

  // Extract data or set defaults
  const overview = data?.overview || {};
  const departments = data?.departments || [];
  const maxObjectiveCount = data?.maxObjectiveCount || 0;
  const topAchievers = data?.topAchievers || [];
  const categories = data?.categories || [];
  const maxCategoryProgress = data?.maxCategoryProgress || 0;

  /* ================= Overview ================= */
  const overviewData = [
    {
      title: "Total Objectives",
      count: overview.total || 0,
      unit: "Objectives",
      icon: TbTargetArrow,
      iconColor: "#362396",
      iconBgColor: "#F7F6FB",
    },
    {
      title: "Under Review",
      count: overview.underReview || 0,
      unit: "Objectives",
      icon: MdAccessTimeFilled,
      iconColor: "#E36F27",
      iconBgColor: "#FDF4E9",
    },
    {
      title: "Achieved",
      count: overview.achieved || 0,
      unit: "Objectives",
      icon: IoCheckmarkDoneSharp,
      iconColor: "#22C55E",
      iconBgColor: "#EFF8EF",
    },
    {
      title: "Not Achieved",
      count: overview.notAchieved || 0,
      unit: "Objectives",
      icon: GoAlertFill,
      iconColor: "#EF3535",
      iconBgColor: "#FFEAEF",
    },
    {
      title: "Completion Rate",
      count: overview.completionRate || 0,
      unit: "%",
      icon: MdBarChart,
      iconColor: "#3789E8",
      iconBgColor: "#EFF6FE",
    },
  ];

  return (
    <Box>
      {/* Header with Filters */}
      <Widget>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h6" fontWeight="bold">
            Organization Dashboard
          </Typography>

          <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
            {/* Loading indicator for filters */}
            {isFiltering && isFetching && (
              <CircularProgress size={20} sx={{ mr: 1 }} />
            )}

            {/* Year Selector */}
            <FormControl variant="outlined" size="small">
              <Select
                value={selectedYear}
                onChange={handleYearChange}
                startAdornment={
                  <Box sx={{ mr: 1, display: "flex", alignItems: "center" }}>
                    <MdOutlineCalendarToday />
                  </Box>
                }
                disabled={showLoading}
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

            {/* Quarter Selector */}
            <FormControl variant="outlined" size="small">
              <Select
                value={selectedQuarter}
                onChange={(e) => handleQuarterChange(e.target.value)}
                disabled={showLoading}
                sx={{
                  minWidth: "120px",
                }}
              >
                {quarterOptions.map((quarter) => (
                  <MenuItem key={quarter.Id} value={quarter.Id}>
                    {quarter.Title}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
        </Box>
      </Widget>

      {/* ================= spacing ================= */}
      <div style={{ height: 7 }}></div>
      {/* ================= spacing ================= */}

      {/* ================= Main Content ================= */}
      <Widget minHeight="calc(100vh - 280px)">
        {isError ? (
          <TryAgain
            minHeight="calc(100vh - 210px)"
            message="An error occurred while loading data"
            handleTryAgain={refetch}
          />
        ) : (
          <>
            {/* ================= Overview Cards ================= */}
            {showLoading ? (
              <OverviewLoadingSkeleton />
            ) : (
              <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap", mb: 1.35 }}>
                {overviewData.map((item) => (
                  <ObjectiveOverviewCard key={item.title} {...item} />
                ))}
              </Box>
            )}

            {/* ================= Main Content Grid ================= */}
            <Grid2 container spacing={2} sx={{ width: '100%', margin: 0 }}>
              {/* ================= LEFT COLUMN (9) ================= */}
              <Grid2 size={{ xs: 12, md: 8.5 }}>
                <Stack spacing={2}>
                  {/* ===== Achieved by Department ===== */}
                  {showLoading ? (
                    <DepartmentChartLoading />
                  ) : departments.length > 0 ? (
                    <Card sx={{ pt: 1, borderRadius: 3, overflow: 'hidden' }}>
                      <Typography fontWeight={600} sx={{ p: 1.5, pl: 2 }}>
                        Achieved Objectives by Department ({selectedYear} - Q{selectedQuarter})
                      </Typography>

                      {/* Scrollable container */}
                      <Box sx={{
                        width: '100%',
                        overflowX: 'auto',
                        '&::-webkit-scrollbar': {
                          height: 8,
                        },
                        '&::-webkit-scrollbar-track': {
                          background: '#f1f1f1',
                          borderRadius: 4,
                        },
                        '&::-webkit-scrollbar-thumb': {
                          background: '#888',
                          borderRadius: 4,
                        },
                        '&::-webkit-scrollbar-thumb:hover': {
                          background: '#555',
                        },
                      }}>
                        <Box sx={{
                          minWidth: departments.length * 92,
                          height: 280,
                        }}>
                          <ResponsiveContainer width="100%" height="100%">
                            <BarChart
                              data={departments}
                              barCategoryGap="20%"
                              barGap={-40}
                              margin={{ top: 20, right: 20, left: -20, bottom: 10 }}
                            >
                              <XAxis
                                dataKey="name"
                                tick={{ fontSize: 12, fill: "#6B7280" }}
                                angle={-25}
                                textAnchor="end"
                                height={60}
                              />
                              <YAxis
                                domain={[0, maxObjectiveCount]}
                                tick={{ fontSize: 12, fill: "#6B7280" }}
                                allowDecimals={false}
                              />
                              <Tooltip content={<DepartmentTooltip />} />

                              {/* BACK BAR → TOTAL OBJECTIVES */}
                              <Bar
                                dataKey="objectiveCount"
                                barSize={40}
                                fill="#D6DBED66"
                                radius={[10, 10, 10, 10]}
                              />

                              {/* FRONT BAR → ACHIEVED */}
                              <Bar
                                dataKey="achievedCount"
                                barSize={40}
                                fill={theme.palette.primary.main}
                                radius={[10, 10, 0, 0]}
                              />
                            </BarChart>
                          </ResponsiveContainer>
                        </Box>
                      </Box>
                    </Card>
                  ) : (
                    <Card sx={{ p: 3, borderRadius: 3, textAlign: 'center' }}>
                      <Typography color="text.secondary">
                        No department data available for {selectedYear} - Q{selectedQuarter}
                      </Typography>
                    </Card>
                  )}

                  {/* ===== Top 3 Achievers ===== */}
                  {showLoading ? (
                    <TopAchieversLoading />
                  ) : topAchievers.length > 0 ? (
                    <Card sx={{ p: 2.5, borderRadius: 3 }}>
                      <Stack direction="row" justifyContent="space-between" mb={1.2}>
                        <Box>
                          <Typography fontWeight={600}>Top 3 Achievers</Typography>
                          <Typography fontSize={13} color="text.secondary" mb={2}>
                            Top performing Employees based on completion
                          </Typography>
                        </Box>
                        {/* Updated "Full Rankings" link */}
                        <Typography
                          component="span" // Use span instead of Link
                          fontSize={13}
                          fontWeight={700}
                          sx={{
                            cursor: "pointer",
                            "&:hover": {
                              textDecoration: "underline",
                            }
                          }}
                          onClick={() => navigate("/rankings", {
                            state: {
                              year: selectedYear,
                              quarter: selectedQuarter
                            }
                          })}
                        >
                          Full Rankings →
                        </Typography>
                      </Stack>

                      <Grid2 container spacing={2}>
                        {topAchievers.map((item, index) => (
                          <Grid2 size={{ xs: 12, md: 4 }} key={item.id}>
                            <Card
                              variant="outlined"
                              sx={{
                                p: 2,
                                borderRadius: 3,
                                textAlign: "center",
                                position: "relative",
                                background: "#f7f7fc"
                              }}
                            >
                              {/* Top Achiever Badge */}
                              <Box
                                sx={{
                                  position: "absolute",
                                  top: 0,
                                  left: 15,
                                  zIndex: 1000,
                                  width: 50,
                                  height: 50,
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "center",
                                }}
                              >
                                {index === 0 && <img src={TopOne} alt="1st Place" style={{ width: "100%", height: "100%" }} />}
                                {index === 1 && <img src={TopTwo} alt="2nd Place" style={{ width: "100%", height: "100%" }} />}
                                {index === 2 && <img src={TopThree} alt="3rd Place" style={{ width: "100%", height: "100%" }} />}
                              </Box>

                              <Avatar
                                src={item.image}
                                sx={{
                                  width: 70,
                                  height: 70,
                                  mx: "auto",
                                  my: 2,
                                  border: `3px solid ${theme.palette.primary.main}`,
                                }}
                              />

                              <Typography fontWeight={600}>{item.name}</Typography>
                              <Typography fontSize={13} color="text.secondary">
                                {item.jobTitle}
                              </Typography>

                              <Box
                                sx={{
                                  mt: 2,
                                  bgcolor: "#E8E7F4",
                                  color: "#656179",
                                  borderRadius: 10,
                                  px: 2,
                                  py: 1,
                                  fontSize: 13,
                                  fontWeight: 600,
                                  display: "flex",
                                  alignItems: "center"
                                }}
                              >
                                <Box sx={{
                                  background: theme.palette.primary.main,
                                  color: "white",
                                  borderRadius: "50%",
                                  width: 25,
                                  height: 24,
                                  lineHeight: "24px",
                                  mr: .5
                                }}>
                                  {item.achievementCount}
                                </Box>
                                Achievements
                              </Box>
                            </Card>
                          </Grid2>
                        ))}
                      </Grid2>
                    </Card>
                  ) : (
                    <Card sx={{ p: 3, borderRadius: 3, textAlign: 'center' }}>
                      <Typography color="text.secondary">
                        No top achievers data available
                      </Typography>
                    </Card>
                  )}
                </Stack>
              </Grid2>

              {/* ================= RIGHT COLUMN (3) ================= */}
              <Grid2 size={{ xs: 12, md: 3.5 }}>
                {showLoading ? (
                  <CategoriesLoading />
                ) : categories.length > 0 ? (
                  <Card sx={{ p: 2.5, borderRadius: 3, height: "100%" }}>
                    <Typography fontWeight={600} sx={{ mb: .7 }}>
                      Top Objectives Categories
                    </Typography>
                    <Typography fontSize={13} color="text.secondary" mb={2}>
                      Most active objectives categories across all teams
                    </Typography>

                    {/* Donut */}
                    <Box
                      sx={{
                        height: 180,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={categories}
                            dataKey="value"
                            cx="50%"
                            cy="50%"
                            innerRadius={55}
                            outerRadius={75}
                            startAngle={90}
                            endAngle={-270}
                            paddingAngle={2}
                            stroke="none"
                          >
                            {categories.map((_, i) => (
                              <Cell
                                key={i}
                                fill={CATEGORY_COLORS[i % CATEGORY_COLORS.length]}
                              />
                            ))}
                          </Pie>
                        </PieChart>
                      </ResponsiveContainer>
                    </Box>

                    {/* Legend */}
                    <Stack spacing={1.2} mt={3}>
                      {categories.map((c, i) => (
                        <Stack
                          key={c.name}
                          direction="row"
                          justifyContent="space-between"
                        >
                          <Stack direction="row" spacing={1} alignItems="center">
                            <Box
                              sx={{
                                width: 10,
                                height: 10,
                                borderRadius: "50%",
                                bgcolor: CATEGORY_COLORS[i],
                              }}
                            />
                            <Typography fontSize={13}>{c.name}</Typography>
                          </Stack>

                          <Typography fontSize={13} fontWeight={600}>
                            {c.value}%
                          </Typography>
                        </Stack>
                      ))}
                    </Stack>

                    {/* Top category */}
                    <Box sx={{ background: "#f7f7fc", px: 1.5, py: 2, mt: 8 }}>
                      <Stack direction="row" justifyContent="space-between">
                        <Typography fontSize={13} color="text.secondary">
                          Top category: {categories[0]?.name}
                        </Typography>
                        <Typography fontSize={17} fontWeight={800} color="primary">
                          {maxCategoryProgress}%
                        </Typography>
                      </Stack>

                      <LinearProgress
                        variant="determinate"
                        value={maxCategoryProgress}
                        sx={{
                          height: 12,
                          borderRadius: 5,
                          mt: 1,
                          bgcolor: "#EEF0FA",
                          "& .MuiLinearProgress-bar": {
                            bgcolor: "primary.main",
                          },
                        }}
                      />
                    </Box>
                  </Card>
                ) : (
                  <Card sx={{ p: 3, borderRadius: 3, height: "100%", display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Typography color="text.secondary" textAlign="center">
                      No category data available
                    </Typography>
                  </Card>
                )}
              </Grid2>
            </Grid2>
          </>
        )}
      </Widget>
    </Box>
  );
};

export default DashboardPage;