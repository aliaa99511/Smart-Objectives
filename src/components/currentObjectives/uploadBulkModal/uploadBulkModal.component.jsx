import { useState } from "react";
import PropTypes from "prop-types";
import { Box, Typography, Button } from "@mui/material";
import { MdUploadFile } from "react-icons/md";
import styles from "./uploadBulkModal.module.css";
import { useDispatch } from "react-redux";
import { closeModal } from "../../../appState/slices/modalSlice";
import { useUploadBulkExcelMutation } from "../../../appState/apis/managerApprovalsSoApiSlice";
import { showToast } from "../../../helpers/utilities/showToast";
import BtnLoader from "../../general/btnLoader/btnLoader.component";

const UploadBulkModal = ({ modalData }) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [dragActive, setDragActive] = useState(false);
  const dispatch = useDispatch();
  const [message, setMessage] = useState("");
  const [alerts, setAlerts] = useState([]);
  const [uploadBulkExcel, { isLoading }] = useUploadBulkExcelMutation();

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    validateAndSetFile(file);
  };

  const validateAndSetFile = (file) => {
    if (file) {
      // Check if file is Excel
      const validTypes = [
        "application/vnd.ms-excel",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      ];
      if (
        validTypes.includes(file.type) ||
        file.name.endsWith(".xlsx") ||
        file.name.endsWith(".xls")
      ) {
        setSelectedFile(file);
      } else {
        showToast({
          type: "error",
          messgae: "Please upload only Excel (.xlsx or .xls) files",
        });
      }
    }
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      validateAndSetFile(e.dataTransfer.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      showToast({
        type: "error",
        messgae: "Please select a file to upload",
      });
      return;
    }

    try {
      const response = await uploadBulkExcel({
        excelFile: selectedFile,
        employeeId: modalData?.employeeId || "",
        managerId: modalData?.managerId || "",
        departmentId: modalData?.departmentId || "",
      }).unwrap();
      setMessage(response?.message);
      setAlerts(response?.alerts);
      showToast({
        type: "success",
        messgae: "Bulk upload completed successfully",
      });
      response?.alerts?.length > 0 ? null : dispatch(closeModal());
    } catch (error) {
      showToast({
        type: "error",
        messgae: error?.message || "Failed to upload file",
      });
    }
  };

  const handleCancel = () => {
    dispatch(closeModal());
  };

  return (
    <Box className={styles.container}>
      <Typography className={styles.title}>Upload Bulk Objectives</Typography>
      <Typography className={styles.subtitle}>
        please upload an excel(.xlsx) file containing your objectives.
      </Typography>

      <Box
        className={`${styles.dropZone} ${dragActive ? styles.dragActive : ""} ${
          selectedFile ? styles.hasFile : ""
        }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <input
          type="file"
          id="file-upload"
          accept=".xlsx,.xls"
          onChange={handleFileChange}
          className={styles.fileInput}
        />
        <label htmlFor="file-upload" className={styles.uploadLabel}>
          <MdUploadFile className={styles.uploadIcon} />
          <Typography className={styles.uploadText}>
            <span className={styles.clickText}>Click to upload</span> or drag
            and drop
          </Typography>
          <Typography className={styles.fileType}>
            {selectedFile ? selectedFile.name : "Excel (.xlsx) file"}
          </Typography>
        </label>
      </Box>
      {alerts?.length > 0 && (
        <Box sx={{ mb: 4 }}>
          {message && (
            <Typography className={styles.message}>{message}</Typography>
          )}

          <Box className={styles.alerts}>
            {alerts.map((alert, index) => (
              <Typography key={index} className={styles.alert}>
                {alert}
              </Typography>
            ))}
          </Box>
        </Box>
      )}

      <Box className={styles.actions}>
        <Button
          variant="contained"
          onClick={handleUpload}
          disabled={isLoading || !selectedFile}
          className={styles.uploadButton}
        >
          {isLoading ? <BtnLoader color="white" /> : "Upload"}
        </Button>
        <Button
          variant="outlined"
          onClick={handleCancel}
          disabled={isLoading}
          className={styles.cancelButton}
        >
          Cancel
        </Button>
      </Box>
    </Box>
  );
};

UploadBulkModal.propTypes = {
  modalData: PropTypes.shape({
    employeeId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    managerId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    departmentId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  }),
};

export default UploadBulkModal;
