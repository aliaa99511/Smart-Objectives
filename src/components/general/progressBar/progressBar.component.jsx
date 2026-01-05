import styles from "./progressBar.module.css";
const ProgressBar = ({ progress, hideProgressNum = false }) => {
  return (
    <div className={styles.progressBar}>
      <div
        className={`${styles.progress} ${!hideProgressNum && styles.spaceTop}`}
        style={{ width: `${progress}%` }}
      >
        {!hideProgressNum && (
          <span
            className={styles.progressNumber}
            style={{
              left: `${progress}%`,
            }}
          >
            {progress}%
          </span>
        )}
      </div>
    </div>
  );
};

export default ProgressBar;
