import styles from "./statusLabel.module.css";
const StatusLabel = ({
  lable,
  color,
  BGColor,
  withDot = false,
  textCenter = true,
  fixedSpace = false,
  count = null,
  height = "",
}) => {
  return (
    <div
      className={`${BGColor ? styles.statusLabelContainer : styles.textOnly} ${
        textCenter && styles.textCenter
      } ${fixedSpace && styles.fixedSpace}`}
      style={{
        backgroundColor: BGColor ? BGColor : "transparent",
        height: height,
      }}
    >
      {withDot && (
        <span
          className={styles.withDot}
          style={{ backgroundColor: color }}
        ></span>
      )}
      <span className={`${styles.statusLabel}`} style={{ color: color }}>
        <span>{lable}</span>
        <span>{count && `(${count})`}</span>
      </span>
    </div>
  );
};

export default StatusLabel;
