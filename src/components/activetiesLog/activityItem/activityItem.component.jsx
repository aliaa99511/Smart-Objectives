import {
  SO_ACTIVITIES_STATUS,
  SO_ATCHIVEMENT_STATUS,
} from "../../../settings/constants/status/smartObjective.status";
import UserImg from "../../general/userImg/userImg.component";
import styles from "./activityItem.module.css";
const ActivityItem = ({ activityData }) => {
  const { name, img, status, progress, achievementComment, date, comment } =
    activityData || {};

  // Get status color configuration
  const statusColor =
    SO_ACTIVITIES_STATUS[status]?.txtColor ||
    SO_ACTIVITIES_STATUS["defaultStatus"]?.txtColor;

  // Render context-specific details based on status
  const renderActivityContext = () => {
    if (status === "Updated" && progress) {
      return (
        <>
          <span>to</span>
          <span style={{ color: "#000", fontWeight: "bold" }}>
            {`${progress}%`}
          </span>
        </>
      );
    }

    if (status === "Submited" && achievementComment) {
      const achievementColor =
        SO_ATCHIVEMENT_STATUS[achievementComment]?.txtColor ||
        SO_ATCHIVEMENT_STATUS["defaultStatus"]?.txtColor;

      return (
        <>
          <span>as</span>
          <span style={{ color: achievementColor }}>{achievementComment}</span>
        </>
      );
    }

    return null;
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.container}>
        <UserImg
          isLoading={false}
          fullRadius={true}
          userName={name}
          img={img}
          imgSize="imgSM"
        />
        <div className={styles.content}>
          <span>{name}</span>
          <span style={{ color: statusColor }}>{status}</span>
          <span>objective</span>

          {renderActivityContext()}

          <span>{`on ${date}`}</span>
        </div>
      </div>
      {comment && <div className={styles.commentBox}>{comment}</div>}
    </div>
  );
};

export default ActivityItem;
