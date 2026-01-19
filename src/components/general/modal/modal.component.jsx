import {
  Box,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import "./modal.module.css";
import { closeModal, selectModal } from "../../../appState/slices/modalSlice";
import { useDispatch, useSelector } from "react-redux";
import { lazy, Suspense } from "react";
import MainLoader from "../mainLoader/mainLoader.component";

// Use lazy to create dynamically loaded components
const SuccsessModalSO = lazy(() =>
  import("../succsessModalSO/succsessModalSO.component")
);
const SuccsessAchievementSO = lazy(() =>
  import("../succsessAchievementSO/succsessAchievementSO.component")
);
const IgnoreSoModal = lazy(() =>
  import("../../currentObjectives/ignoreSoModal/ignoreSoModal.component")
);
const RejectSoModal = lazy(() =>
  import("../../currentObjectives/rejectSoModal/rejectSoModal.component")
);
const UploadBulkModal = lazy(() =>
  import("../../currentObjectives/uploadBulkModal/uploadBulkModal.component")
);

// Loading fallback component
const LoadingFallback = () => <MainLoader height="auto" />;

const Modal = () => {
  const { modalShow, modalData, modalType, modalSize, modalTitle } =
    useSelector(selectModal);
  const dispatch = useDispatch();

  const handleClose = (event, reason) => {
    // Prevent closing if the click is outside the modal or the escape key is pressed
    if (reason !== "backdropClick" || reason !== "escapeKeyDown") {
      return;
    } else {
      dispatch(closeModal());
    }
  };

  // Render the appropriate component based on modalType
  const renderComponent = () => {
    switch (modalType) {
      case "createSmartObjectiveSuccess":
        return <SuccsessModalSO modalData={modalData} />;
      case "createAchievementSuccess":
        return <SuccsessAchievementSO />;
      case "ignoreSo":
        return <IgnoreSoModal modalData={modalData} />;
      case "rejectSo":
        return <RejectSoModal modalData={modalData} />;
      case "uploadBulk":
        return <UploadBulkModal modalData={modalData} />;
      default:
        return null;
    }
  };

  return (
    <Dialog
      onClose={handleClose}
      aria-labelledby="customized-dialog-title"
      open={Boolean(modalShow)}
      className="dialog-component"
      maxWidth={modalSize}
      fullWidth={true}
    >
      <Box sx={{ m: 0, p: 3 }}>
        <>
          {modalTitle && (
            <DialogTitle
              id="customized-dialog-title"
              sx={{ fontSize: "15px", fontWeight: "700" }}
              className="dialog-title"
            >
              {modalTitle}
            </DialogTitle>
          )}
          {modalTitle && (
            <>
              <IconButton
                aria-label="close"
                onClick={handleClose}
                sx={{
                  position: "absolute",
                  left: 20,
                  top: 22,
                }}
              >
                <CloseIcon />
              </IconButton>
              <hr className="divderTitle" />
            </>
          )}
          <DialogContent>
            <Suspense fallback={<LoadingFallback />}>
              {renderComponent()}
            </Suspense>
          </DialogContent>
        </>
      </Box>
    </Dialog>
  );
};

export default Modal;
