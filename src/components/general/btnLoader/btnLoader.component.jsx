import { CircularProgress } from "@mui/material";
import styles from "./btnLoader.module.css";
const BtnLoader = ({ color }) => {
  return (
    <CircularProgress
      className={`${styles.loader} ${styles[color]}`}
      size="20px"
    />
  );
};

export default BtnLoader;
