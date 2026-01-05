import { Skeleton } from "@mui/material";
import styles from "./userImg.module.css";
import { getInitialCaracters } from "../../../helpers/utilities/getInitialCaracters";
const UserImg = ({
  img,
  userName,
  notificationCount,
  imgSize = "imgMD",
  isLoading = true,
  fullRadius = true,
  withNotfication = false,
}) => {
  return (
    <div className={styles.imageContainer}>
      {isLoading ? (
        <Skeleton
          variant={`${fullRadius ? "circular" : "rectangular"}`}
          className={styles[imgSize]}
        />
      ) : img ? (
        <img
          src={`${img}`}
          alt={`${userName}'s profile`}
          className={`${styles.userImg} ${fullRadius && styles.fullRadius}  ${
            styles[imgSize]
          }`}
        />
      ) : (
        <div
          className={`${styles.userInitials} ${fullRadius && styles.fullRadius} 
              
              ${styles[imgSize]}
              `}
        >
          {getInitialCaracters(userName)}
        </div>
      )}

      {!isLoading && withNotfication && notificationCount > 0 && (
        <div className={styles.notificationBadge}>{notificationCount}</div>
      )}
    </div>
  );
};

export default UserImg;
