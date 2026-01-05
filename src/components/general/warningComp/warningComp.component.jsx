import { IoWarningOutline } from "react-icons/io5";
import styles from "./warningComp.module.css";

const WarningComp = ({ message }) => {
  return (
    <>
      <div className={styles.iconWrapper}>
        <IoWarningOutline className={styles.icon} />
      </div>
      <h1 className={styles.title}>{message} </h1>
    </>
  );
};

export default WarningComp;
