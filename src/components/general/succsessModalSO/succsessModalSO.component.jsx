import { Button } from "@mui/material";
import styles from "./succsessModalSO.module.css";
import { useDispatch } from "react-redux";
import { closeModal } from "../../../appState/slices/modalSlice";
import { FaRegCircleCheck } from "react-icons/fa6";
import { useNavigate } from "react-router-dom";

const SuccsessModalSO = ({ modalData }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleDone = () => {
    dispatch(closeModal());
    navigate(modalData?.redirctTo);
  };

  const handleNewObjective = () => {
    dispatch(closeModal());
  };

  return (
    <div className={styles.container}>
      <div className={styles.iconContainer}>
        <FaRegCircleCheck className={styles.icon} />
      </div>
      <h2 className={styles.title}>Successfully Created</h2>
      <p className={styles.message}>do you want to create another objective?</p>
      <div className={styles.buttonContainer}>
        <Button
          variant="outlined"
          className={styles.doneButton}
          onClick={handleDone}
        >
          done
        </Button>
        <Button
          variant="outlined"
          className={styles.newButton}
          onClick={handleNewObjective}
        >
          New Objective
        </Button>
      </div>
    </div>
  );
};

export default SuccsessModalSO;
