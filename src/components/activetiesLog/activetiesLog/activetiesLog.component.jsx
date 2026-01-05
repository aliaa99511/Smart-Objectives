import { useSelector } from "react-redux";
import { selectDrawer } from "../../../appState/slices/drawerSlice";
import styles from "./activetiesLog.module.css";
import Widget from "../../general/widget/widget.component";
import ActivityItem from "../activityItem/activityItem.component";
import { useGetActivitiesForSOQuery } from "../../../appState/apis/managerApprovalsSoApiSlice";
import { Box, Skeleton } from "@mui/material";
import TryAgain from "../../general/tryAgain/tryAgain.component";

const ActivetiesLog = () => {
  const { drawerData } = useSelector(selectDrawer);
  const objectiveId = drawerData?.id;

  const {
    data: activitiesData,
    isLoading,
    isError,
    refetch,
  } = useGetActivitiesForSOQuery(objectiveId);

  return (
    <div className={styles.container}>
      <h1> Activities Log </h1>
      {isLoading ? (
        <>
          <Skeleton
            variant="rectangular"
            width="100%"
            sx={{ mb: 2 }}
            height={40}
          />
          <Skeleton
            variant="rectangular"
            width="100%"
            sx={{ mb: 2 }}
            height={40}
          />
          <Skeleton variant="rectangular" width="100%" height={40} />
        </>
      ) : isError ? (
        <TryAgain
          minHeight="calc(100vh - 75px)"
          message="Failed to get activities"
          handleTryAgain={refetch}
        />
      ) : activitiesData ? (
        <>
          <Widget>
            <div className={styles.title}>{activitiesData?.title} </div>
            <small className={styles.date}>
              submitted on: {activitiesData?.submittedOn}{" "}
            </small>
          </Widget>
          <div className={styles.activityContainer}>
            {activitiesData?.activities?.map((item, index) => (
              <ActivityItem key={index} activityData={item} />
            ))}
          </div>
        </>
      ) : null}
    </div>
  );
};

export default ActivetiesLog;
