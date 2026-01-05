import WarningComp from "../warningComp/warningComp.component";
import styles from "./tryAgain.module.css";
import { FiRefreshCcw } from "react-icons/fi";

const TryAgain = ({
  minHeight = "100vh",
  message = "Operation failed",
  handleTryAgain,
}) => {
  return (
    <div className={styles.container} style={{ minHeight: minHeight }}>
      <WarningComp message={message} />
      <button
        className={styles.button}
        onClick={handleTryAgain}
        style={{ top: `calc(${minHeight} - 100px)` }}
      >
        <FiRefreshCcw /> Try Again
      </button>
    </div>
  );
};

export default TryAgain;
