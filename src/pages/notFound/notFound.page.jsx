import styles from "./notFound.module.css";
import { useNavigate } from "react-router-dom";
import { MdArrowBack } from "react-icons/md";
import WarningComp from "../../components/general/warningComp/warningComp.component";

const NotFound = () => {
  const navigate = useNavigate();

  const handleBackToHome = () => {
    navigate("/");
  };

  return (
    <div className={styles.container}>
      <WarningComp message="Page Not Found!" />
      <button className={styles.button} onClick={handleBackToHome}>
        <MdArrowBack /> Back To Home
      </button>
    </div>
  );
};

export default NotFound;
