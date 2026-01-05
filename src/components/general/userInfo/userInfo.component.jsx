import { Skeleton } from "@mui/material";
import "./userInfo.module.css";
import styles from "./userInfo.module.css";
import { getInitialCaracters } from "../../../helpers/utilities/getInitialCaracters";
import UserImg from "../userImg/userImg.component";

const UserInfo = ({
  userData,
  imgSize,
  nameSize,
  isLoading,
  fullRadius,
  withNotfication,
}) => {
  return (
    <div style={{ position: "relative" }}>
      <div
        className={`
        ${styles.userInfo}`}
      >
        <UserImg
          isLoading={isLoading}
          img={userData?.img}
          userName={userData?.name}
          notificationCount={userData?.notificationCount}
          imgSize={imgSize}
          fullRadius={fullRadius}
          withNotfication={withNotfication}
        />

        <div className={styles.userInfoText}>
          {userData?.badge && (
            <div className={`${styles.badge}`}>{userData?.badge}</div>
          )}
          <div>
            {isLoading ? (
              <Skeleton width={90} />
            ) : (
              <div className={`${styles.userName} ${styles[nameSize]}`}>
                {userData?.name}
              </div>
            )}
          </div>
          {isLoading ? (
            <Skeleton width={70} />
          ) : (
            <div className={`${styles.userRole}`}>{userData?.jobTitle}</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserInfo;
