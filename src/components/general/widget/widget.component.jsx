import styles from "./widget.module.css";
const Widget = ({ children, minHeight = "auto", padding = "" }) => {
  return (
    <div
      className={styles.widget}
      style={{ minHeight: minHeight, padding: padding }}
    >
      {children}
    </div>
  );
};

export default Widget;
