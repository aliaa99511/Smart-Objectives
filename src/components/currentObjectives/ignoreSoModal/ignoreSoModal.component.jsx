import { Button } from "@mui/material";
import styles from "./ignoreSoModal.module.css";
import { useDispatch } from "react-redux";
import { closeModal } from "../../../appState/slices/modalSlice";
import { PiWarningCircle } from "react-icons/pi";
import { useManagerIgnoreMutation } from "../../../appState/apis/managerApprovalsSoApiSlice";
import { showToast } from "../../../helpers/utilities/showToast";
import BtnLoader from "../../general/btnLoader/btnLoader.component";
import { smartObjectiveApiSlice } from "../../../appState/apis/smartObjectiveApiSlice";
import { closeDrawer } from "../../../appState/slices/drawerSlice";

const IgnoreSoModal = ({ modalData }) => {
  const [managerIgnore, { isLoading: isIgnoreLoading }] =
    useManagerIgnoreMutation();

  const dispatch = useDispatch();

  const handleCancel = () => {
    dispatch(closeModal());
  };

  const handleIgnore = () => {
    if (modalData) {
      managerIgnore({ id: modalData?.id })
        .unwrap()
        .then(() => {
          // Handle success
          showToast({
            type: "success",
            messgae: "Ignored smart objective successfully",
          });
          modalData?.comingFrom == "objectiveDetails" &&
            dispatch(
              smartObjectiveApiSlice.util.invalidateTags([
                { type: "SmartObjectives", id: modalData?.id },
              ])
            );

          dispatch(closeModal());
          dispatch(closeDrawer());
          modalData?.handleMenuClose && modalData.handleMenuClose();
        })
        .catch((error) => {
          // Handle error
          showToast({
            type: "error",
            messgae: "Failed to Ignore objective",
          });
          console.error("Failed to ignore objective:", error);
        });
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.iconContainer}>
        <PiWarningCircle className={styles.icon} />
      </div>
      <h2 className={styles.title}>Ignore Objective</h2>
      <p className={styles.message}>
        Are you sure you want to ignore this objective? It will be{" "}
        <strong>deleted</strong> from the employee view!
      </p>
      <div className={styles.buttonContainer}>
        <Button
          variant="outlined"
          className={styles.cancelButton}
          onClick={handleCancel}
          disabled={isIgnoreLoading}
        >
          cancel
        </Button>
        <Button
          className={styles.submitButton}
          onClick={handleIgnore}
          disabled={isIgnoreLoading}
          variant="contained"
        >
          {isIgnoreLoading ? <BtnLoader /> : "Ignore"}
        </Button>
      </div>
    </div>
  );
};

export default IgnoreSoModal;
