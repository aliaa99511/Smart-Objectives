import styles from "./unauthorized.module.css";
import WarningComp from "../../components/general/warningComp/warningComp.component";
import { FiRefreshCcw } from "react-icons/fi";

const Unauthorized = () => {
  const handleRefresh = () => {
    window.location.reload();
  };
  return (
    <div className={styles.container}>
      <WarningComp message="Unauthorized!" />
      <button className={styles.button} onClick={handleRefresh}>
        <FiRefreshCcw /> Refresh
      </button>
    </div>
  );
};

export default Unauthorized;
