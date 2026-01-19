import styles from "./succsessAchievementSO.module.css";
import { FaRegCircleCheck } from "react-icons/fa6";
import { useDispatch } from "react-redux";
import { closeModal } from "../../../appState/slices/modalSlice";
import { Button } from "@mui/material";

const SuccsessAchievementSO = () => {
  const dispatch = useDispatch();

  const handleDone = () => {
    dispatch(closeModal());
  };

  return (
    <div className={styles.container}>
      <div className={styles.iconContainer}>
        <FaRegCircleCheck className={styles.icon} />
      </div>
      <h2 className={styles.title}>Successfully Created</h2>
      <p className={styles.message}>
        Achievement has been created successfully.
      </p>
      <div className={styles.buttonContainer}>
        <Button
          variant="outlined"
          className={styles.doneButton}
          onClick={handleDone}
        >
          done
        </Button>
      </div>

    </div>
  );
};

export default SuccsessAchievementSO;
