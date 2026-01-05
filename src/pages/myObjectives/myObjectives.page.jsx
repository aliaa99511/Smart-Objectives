import { useGetMySmartObjectivesQuery } from "../../appState/apis/smartObjectiveApiSlice";
import { getYearAndQuarter } from "../../helpers/utilities/getYearAndQuarter";
import Widget from "../../components/general/widget/widget.component";
import QuarterHeader from "../../components/general/quarterHeader/quarterHeader.component";
import styles from "./myObjectives.module.css";
import { Link, useLocation } from "react-router-dom";
import { BsPlusCircle } from "react-icons/bs";
import SkeletonLoader from "../../components/general/skeletonLoader/skeletonLoader";
import ObjectiveCard from "../../components/myObjectives/objectiveCard/objectiveCard.component";
import Grid from "@mui/material/Grid2";
import { useFetchCurrentUserQuery } from "../../appState/apis/userApiSlice";
import TryAgain from "../../components/general/tryAgain/tryAgain.component";
import ObjectiveOverviewCard from "../../components/general/objectiveOverviewCard/objectiveOverviewCard.component";
import { TbTargetArrow } from "react-icons/tb";
import { IoCheckmarkDoneSharp } from "react-icons/io5";
import { GoAlertFill } from "react-icons/go";
import { MdBarChart } from "react-icons/md";
import { Box } from "@mui/material";
import { MdAccessTimeFilled } from "react-icons/md";

const MyObjectives = () => {
  // Get URL parameters
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const yearParam = searchParams.get("year");
  const quarterParam = searchParams.get("quarter");

  // Get default values from the utility function
  const { year, quarter, quarterMonths } = getYearAndQuarter(
    undefined,
    quarterParam,
    yearParam
  );

  const { data: userData } = useFetchCurrentUserQuery();

  // Use the RTK Query hook to fetch objectives
  const {
    data: objectives,
    isLoading,
    isError,
    refetch,
  } = useGetMySmartObjectivesQuery({
    Year: year,
    Quarter: quarter,
    EmployeeID: userData?.userId,
  });

  const overviewData = [
    {
      title: "My Objectives",
      count: `${objectives?.smartObjectivesOverView?.totalCount || 0}`,
      unit: "Objectives",
      icon: TbTargetArrow,
      iconColor: "#362396",
      iconBgColor: "#F7F6FB",
    },
    {
      title: "Under Review",
      count: `${objectives?.smartObjectivesOverView?.underReviewNum || 0}`,
      unit: "Objectives",
      icon: MdAccessTimeFilled,
      iconColor: "#E36F27",
      iconBgColor: "#FDF4E9",
    },
    {
      title: "Achieved",
      count: `${objectives?.smartObjectivesOverView?.achievedNum || 0}`,
      unit: "Objectives",
      icon: IoCheckmarkDoneSharp,
      iconColor: "#22c55e",
      iconBgColor: "#EFF8EF",
    },
    {
      title: "Not Achieved",
      count: `${objectives?.smartObjectivesOverView?.notAchievedNum || 0}`,
      unit: "Objectives",
      icon: GoAlertFill,
      iconColor: "#EF3535",
      iconBgColor: "#FFEAEF",
    },

    {
      title: "Completion rate",
      count: `${objectives?.smartObjectivesOverView?.completionRate || 0}`,
      unit: "%",
      icon: MdBarChart,
      iconColor: "#3789E8",
      iconBgColor: "#EFF6FE",
    },
  ];

  return (
    <>
      <Widget>
        <div className={styles.hederContainer}>
          <h4>Yearly objectives overview</h4>
          <div>
            <Link to="/createSmartObjective">
              <button className={styles.newObj}>
                <BsPlusCircle style={{ fontSize: "16px" }} /> New objective
              </button>
            </Link>
          </div>
        </div>
        <Box className={styles.overviewContainer}>
          {overviewData.map((item) => (
            <ObjectiveOverviewCard
              key={item.title}
              title={item.title}
              count={item.count}
              unit={item.unit}
              icon={item.icon}
              iconColor={item.iconColor}
              iconBgColor={item.iconBgColor}
            />
          ))}
        </Box>
      </Widget>
      <QuarterHeader
        year={year}
        quarter={quarter}
        quarterMonths={quarterMonths}
        light={true}
      />
      <>
        {isLoading && (
          <div className={styles.cardsContainer}>
            <SkeletonLoader count={6} />
          </div>
        )}
        {isError && (
          <TryAgain
            minHeight="calc(100vh - 175px)"
            message="An error occurred while loading data"
            handleTryAgain={refetch}
          />
        )}

        <Grid container spacing={2}>
          {objectives?.smartObjectives?.length === 0 && (
            <p style={{ textAlign: "center", width: "100%" }}>
              No Objectives Were Submitted
            </p>
          )}
          {objectives?.smartObjectives?.map((obj) => (
            <Grid key={obj.id} size={{ xs: 12, md: 6, lg: 4 }}>
              <ObjectiveCard key={obj.id} objective={obj} />
            </Grid>
          ))}
        </Grid>
      </>
    </>
  );
};

export default MyObjectives;
