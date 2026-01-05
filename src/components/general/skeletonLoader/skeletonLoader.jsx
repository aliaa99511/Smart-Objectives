/* eslint-disable react/prop-types */

import Grid from "@mui/material/Grid2";
import Skeleton from "@mui/material/Skeleton";
import styles from "./skeletonLoader.module.css"; // Adjust this based on your actual styles
import Widget from "../widget/widget.component";

const SkeletonLoader = ({ count }) => {
  return (
    <Grid container spacing={2}>
      {Array(count)
        .fill(0)
        .map((_, index) => (
          <Grid key={index} size={{ xs: 12, md: 6, lg: 4 }}>
            <Widget>
              <Skeleton
                variant="rectangular"
                className={styles.skeletonHeader}
              />
              <Skeleton variant="text" className={styles.skeletonBody} />
              <Skeleton variant="text" className={styles.skeletonFooter} />
            </Widget>
          </Grid>
        ))}
    </Grid>
  );
};

export default SkeletonLoader;
