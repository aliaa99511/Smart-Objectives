import styles from "./serverError.module.css";
import WarningComp from "../../components/general/warningComp/warningComp.component";
import { FiRefreshCcw } from "react-icons/fi";
const ServerError = () => {
  const handleRefresh = () => {
    window.location.reload();
  };
  return (
    <div className={styles.container}>
      <WarningComp message="server Error" />
      <button className={styles.button} onClick={handleRefresh}>
        <FiRefreshCcw /> Refresh
      </button>
    </div>
  );
};

export default ServerError;
