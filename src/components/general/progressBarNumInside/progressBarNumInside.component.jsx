import styles from "./progressBarNumInside.module.css";
const ProgressBarNumInside = ({ progress }) => {
  return (
    <>
      <div className={styles.progressBar}>
        <div
          className={`${styles.progress} `}
          style={{ width: `${progress}%` }}
        ></div>
      </div>
      <span className={styles.progressNumber}>{progress}%</span>
    </>
  );
};

export default ProgressBarNumInside;
