import { Box, Skeleton, Typography } from "@mui/material";
import styles from "./certficatesLog.module.css";
import Widget from "../widget/widget.component";
import StatusLabel from "../statusLabel/statusLabel.component";
import { formatTextWithSpaces } from "../../../helpers/utilities/formatTextWithSpaces";
import { SO_ATCHIVEMENT_STATUS } from "../../../settings/constants/status/smartObjective.status";
import Grid from "@mui/material/Grid2";
import CertificateCard from "../../certificates/certificateCard/certificateCard.component";
import { useSelector } from "react-redux";
import { selectDrawer } from "../../../appState/slices/drawerSlice";
import { useGetSmartObjectiveDetailsQuery } from "../../../appState/apis/smartObjectiveApiSlice";

const CertficatesLog = () => {
  const { drawerData } = useSelector(selectDrawer);
  const objectiveId = drawerData?.id || drawerData?.ID;

  const {
    data: objectiveDetails,
    isLoading,
    isError,
    error,
    refetch,
  } = useGetSmartObjectiveDetailsQuery(objectiveId, {
    skip: !objectiveId,
  });
  return (
    <Box className={styles.detailsContainer}>
      {/* Title Section */}
      <Typography variant="h6" fontWeight="bold" className={styles.mainTitle}>
        Certificates
      </Typography>
      <Widget>
        {isLoading ? (
          <Skeleton width={100} />
        ) : (
          <StatusLabel
            lable={formatTextWithSpaces(objectiveDetails.achievementStatus)}
            color={
              SO_ATCHIVEMENT_STATUS[objectiveDetails?.achievementStatus]
                ?.txtColor || SO_ATCHIVEMENT_STATUS["defaultStatus"]?.txtColor
            }
            BGColor={
              SO_ATCHIVEMENT_STATUS[objectiveDetails?.achievementStatus]
                ?.BGColor || SO_ATCHIVEMENT_STATUS["defaultStatus"]?.BGColor
            }
            fixedSpace="true"
            withDot="true"
          />
        )}

        <Typography variant="h6" fontWeight="bold" className={styles.title}>
          {isLoading ? (
            <Skeleton width="60%" />
          ) : (
            objectiveDetails?.title || "Objective Title"
          )}
        </Typography>
        <Typography variant="body2" color="gray">
          {isLoading ? (
            <Skeleton width="40%" />
          ) : (
            `Submitted on: ${objectiveDetails?.submittedOn || "Not yet!"}`
          )}
        </Typography>
      </Widget>

      {/* Details Section */}
      <div className={styles.detailsBody}>
        <Box className={styles.detailsContent}>
          <div className={styles.detailsItem}>
            <div className={styles.attachments}>
              {objectiveDetails?.attachments?.length > 0 && (
                <>
                  <Typography className={styles.lable}>Attachments:</Typography>
                  <Grid container spacing={2}>
                    {objectiveDetails?.attachments.map((certificateData) => (
                      <Grid key={certificateData?.Name} size={{ xs: 6 }}>
                        <CertificateCard certificateData={certificateData} />
                      </Grid>
                    ))}
                  </Grid>
                </>
              )}
            </div>
          </div>
        </Box>
      </div>
    </Box>
  );
};

export default CertficatesLog;
