import { Box, IconButton } from "@mui/material";
import delIcon from "../../../assets/delIcon.svg";
import styles from "./imgFileItem.module.css";
import { FaFileArrowUp } from "react-icons/fa6";

const ImgFileItem = ({ fileName, id, handleFileDelete }) => {
  return (
    <Box className={styles.fileItem}>
      <div className={styles.fileItemContent}>
        <div className={styles.fileIcon}>
          <FaFileArrowUp />
        </div>
        <div className={styles.fileItemContentText}>
          <div className={styles.fileName}>{fileName}</div>
        </div>
      </div>
      {handleFileDelete && (
        <IconButton
          size="small"
          onClick={() => handleFileDelete(id)}
          className={styles.deleteIcon}
        >
          <img src={delIcon} alt="delIcon" />
        </IconButton>
      )}
    </Box>
  );
};

export default ImgFileItem;
