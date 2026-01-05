import { Button, TextField } from "@mui/material";
import styles from "./rejectSoModal.module.css";
import { useDispatch } from "react-redux";
import { closeModal } from "../../../appState/slices/modalSlice";
import { PiWarningCircle } from "react-icons/pi";
import { useManagerRejectMutation } from "../../../appState/apis/managerApprovalsSoApiSlice";
import { showToast } from "../../../helpers/utilities/showToast";
import BtnLoader from "../../general/btnLoader/btnLoader.component";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { smartObjectiveApiSlice } from "../../../appState/apis/smartObjectiveApiSlice";
import { closeDrawer } from "../../../appState/slices/drawerSlice";

// Define validation schema
const schema = yup.object({
  justification: yup.string().required("Justification is required"),
});

const RejectSoModal = ({ modalData }) => {
  const [managerReject, { isLoading: isRejectLoading }] =
    useManagerRejectMutation();

  const dispatch = useDispatch();

  // Initialize form with validation
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      justification: "",
    },
  });

  const handleCancel = () => {
    dispatch(closeModal());
  };

  const onSubmit = (data) => {
    if (modalData) {
      managerReject({
        id: modalData?.id,
        justification: data.justification,
      })
        .unwrap()
        .then(() => {
          // Handle success
          showToast({
            type: "success",
            messgae: "Rejected smart objective successfully",
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
            messgae: "Failed to Reject objective",
          });
          console.error("Failed to reject objective:", error);
        });
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.iconContainer}>
        <PiWarningCircle className={styles.icon} />
      </div>
      <h2 className={styles.title}>reject achievement</h2>
      <p className={styles.message}>
        Are you sure you want to reject this objective? Rejecting this request
        will <strong>override</strong> the employee's statement!
      </p>

      <form className={styles.form} onSubmit={handleSubmit(onSubmit)}>
        <div className={styles.formGroup}>
          <label className={styles.label}>Justification:</label>
          <TextField
            {...register("justification")}
            placeholder="Enter your rejection justification..."
            multiline
            rows={4}
            fullWidth
            error={!!errors.justification}
            helperText={errors.justification?.message}
            className={styles.textField}
            disabled={isRejectLoading}
          />
        </div>

        <div className={styles.buttonContainer}>
          <Button
            variant="outlined"
            className={styles.cancelButton}
            onClick={handleCancel}
            type="button"
            disabled={isRejectLoading}
          >
            cancel
          </Button>
          <Button
            className={styles.submitButton}
            type="submit"
            disabled={isRejectLoading}
            variant="contained"
          >
            {isRejectLoading ? <BtnLoader /> : "Reject"}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default RejectSoModal;
