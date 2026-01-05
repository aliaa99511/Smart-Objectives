import styles from "./fileUploadPlaceholder.module.css";
import { FaFileArrowUp } from "react-icons/fa6";

const FileUploadPlaceholder = ({ isError, selectedFile }) => {
  return (
    <div className={`${styles.container} ${isError && styles.error}`}>
      <div className={styles.contentContainer}>
        <div className={styles.iconContainer}>
          <FaFileArrowUp />
        </div>
        <div className={styles.mainPlaceHolder}>
          <span>Click to upload</span>
          <span>or drag and drop</span>
        </div>
        <div className={styles.secondaryPlacehoder}>
          <span>PNG, JPG or Pdf</span>
        </div>
        {selectedFile ? (
          <div className={styles.fileNameContainer}>
            <span className={styles.fileName}>{selectedFile.name}</span>
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default FileUploadPlaceholder;
