import { useRef, useState } from "react";
import styles from "./submitionForm.module.css";
import {
  Box,
  Button,
  FormControl,
  FormControlLabel,
  Radio,
  RadioGroup,
  TextField,
  Typography,
  FormHelperText,
} from "@mui/material";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import FileUploadPlaceholder from "../fileUploadPlaceholder/fileUploadPlaceholder.component";
import ImgFileItem from "../imgFileItem/imgFileItem.component";
import { AiOutlinePlusCircle } from "react-icons/ai";
import { closeDrawer } from "../../../appState/slices/drawerSlice";
import { useDispatch } from "react-redux";
import BtnLoader from "../../general/btnLoader/btnLoader.component";

// Define validation schema
const schema = yup.object().shape({
  achievementStatus: yup.string().required("Achievement status is required"),
  comment: yup.string().required("Comment is required"),
  certificates: yup.mixed(),
});

const SubmitionForm = ({ onSubmit, isSubmitting }) => {
  const [certificateName, setCertificateName] = useState("");
  const dispatch = useDispatch();

  // Initialize React Hook Form
  const {
    control,
    handleSubmit,
    formState: { errors },
    getValues,
    setValue,
    watch,
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      achievementStatus: "Achieved",
      comment: "",
      certificates: [], // Initialize with empty array
    },
  });

  // Watch achievement status to reactively show/hide certificate section
  const achievementStatus = watch("achievementStatus");

  const handleCertificateNameChange = (event) => {
    setCertificateName(event.target.value);
  };

  const fileInputRef = useRef(null);
  const [selectedFile, setSelectedFile] = useState(null);

  const [fileError, setFileError] = useState("");
  const [fileNameError, setFileNameError] = useState("");

  // Function to handle file selection
  const handleFileChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];

      // Check if file is PDF or image
      if (!file.type.startsWith("image/") && file.type !== "application/pdf") {
        setFileError("Please upload only PDF or image files");
        e.target.value = "";
        setSelectedFile(null);
        return;
      }
      // Store the selected file but don't add it to the form yet
      setSelectedFile(file);
      setFileError("");
    } else {
      setSelectedFile(null);
    }
  };

  // Function to add the certificate
  const handleAddCertificate = () => {
    if (!certificateName.trim()) {
      setFileNameError("Please enter a certificate name");
      return;
    }

    if (!selectedFile) {
      setFileNameError("");
      setFileError("Please select a file before adding a certificate");
      return;
    }

    const existingFiles = getValues("certificates") || [];

    // Process the file
    const fileExtension = selectedFile.name.split(".").pop();
    const processedFile = new File(
      [selectedFile],
      `${certificateName}.${fileExtension}`,
      { type: selectedFile.type }
    );

    // Check for duplicates
    const isDuplicate = existingFiles.some(
      (existingFile) =>
        existingFile.name === processedFile.name &&
        existingFile.size === processedFile.size
    );

    if (!isDuplicate) {
      setValue("certificates", [...existingFiles, processedFile]);
    }

    // Reset certificate name, file input, and selected file
    setCertificateName("");
    fileInputRef.current.value = "";
    setSelectedFile(null);
    setFileError("");
    setFileNameError("");
  };

  // Function to remove a selected file
  const handleFileDelete = (index) => {
    const updatedFiles = getValues("certificates").filter(
      (_, i) => i !== index
    );
    setValue("certificates", updatedFiles); // Update files

    // Reset input field if no files remain
    if (updatedFiles.length === 0 && fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleCancel = () => {
    dispatch(closeDrawer());
  };

  const onFormSubmit = (data) => {
    if (selectedFile) {
      setFileError("Please add the selected certificate before submitting");
      return;
    }
    if (certificateName) {
      setFileNameError(
        "Please add a certificate before submitting or remove the certificate Name"
      );
      return;
    }

    const submissionData = {
      ...data,
    };
    onSubmit(submissionData);
  };

  return (
    <Box className={styles.formContainer}>
      <form onSubmit={handleSubmit(onFormSubmit)}>
        <Box className={styles.formSection}>
          <Typography variant="subtitle1" className={styles.lable}>
            Achievement Status*
          </Typography>
          <Controller
            name="achievementStatus"
            control={control}
            render={({ field }) => (
              <FormControl
                component="fieldset"
                error={!!errors.achievementStatus}
              >
                <RadioGroup row {...field} className={styles.radioGroup}>
                  <FormControlLabel
                    value="Achieved"
                    control={<Radio color="success" />}
                    label="Achieved"
                    className={`${styles.radioLabel} ${
                      field.value === "Achieved" ? styles.achievedRadio : ""
                    }`}
                  />
                  <FormControlLabel
                    value="NotAchieved"
                    control={<Radio color="error" />}
                    label="Not Achieved"
                    className={`${styles.radioLabel} ${
                      field.value === "NotAchieved"
                        ? styles.notAchievedRadio
                        : ""
                    }`}
                  />
                </RadioGroup>
                {errors.achievementStatus && (
                  <FormHelperText error>
                    {errors.achievementStatus.message}
                  </FormHelperText>
                )}
              </FormControl>
            )}
          />
        </Box>

        <Box className={styles.formSection}>
          <Typography variant="subtitle1" className={styles.lable}>
            Comment*
          </Typography>
          <Controller
            name="comment"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                fullWidth
                multiline
                rows={3}
                placeholder="Leave a comment to describe your achievement..."
                className={styles.commentField}
                error={!!errors.comment}
                helperText={errors.comment?.message}
              />
            )}
          />
        </Box>

        {/* Only show Certificate section if achievement status is "Achieved" */}
        {achievementStatus === "Achieved" && (
          <Box className={styles.formSection}>
            <Typography variant="subtitle1" className={styles.lable}>
              Certificate
            </Typography>
            <Box>
              <TextField
                fullWidth
                placeholder="Certificate Name..."
                value={certificateName}
                onChange={handleCertificateNameChange}
                className={styles.certificateNameField}
                error={!!fileNameError}
                helperText={fileNameError}
              />
              <Controller
                name="certificates"
                control={control}
                render={({ field: { value } }) => (
                  <Box>
                    {/* File Input */}
                    <div className={styles.fileUploadContainer}>
                      <input
                        className={styles.uploadFile}
                        type="file"
                        accept="image/*,.pdf"
                        ref={fileInputRef}
                        onChange={handleFileChange}
                      />
                      <div onClick={() => fileInputRef.current.click()}>
                        <FileUploadPlaceholder
                          isError={!!fileError}
                          selectedFile={selectedFile}
                        />
                      </div>
                    </div>

                    {fileError && (
                      <FormHelperText error>{fileError}</FormHelperText>
                    )}

                    {/* Add Certificate Button */}
                    <Box className={styles.addCertificateButtonContainer}>
                      <p className={styles.noteHelper}>
                        Note: please make sure to add the certificate{" "}
                        <span>name</span> and attach the certificate{" "}
                        <span>file</span> before submitting!
                      </p>
                      <Button
                        variant="contained"
                        color="primary"
                        // startIcon={<AiOutlinePlusCircle />}
                        className={styles.addCertificateButton}
                        onClick={handleAddCertificate}
                        fullWidth
                      >
                        Add Certificate
                      </Button>
                    </Box>

                    {/* File List with Delete Option */}
                    <Box mt={1}>
                      {value?.map((file, index) => (
                        <ImgFileItem
                          key={index}
                          fileName={file.name}
                          handleFileDelete={handleFileDelete}
                          id={index}
                        />
                      ))}
                    </Box>
                  </Box>
                )}
              />
            </Box>
          </Box>
        )}

        <Box className={styles.actionButtons}>
          <Button
            variant="outlined"
            type="button"
            onClick={handleCancel}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            color="primary"
            type="submit"
            disabled={isSubmitting}
          >
            {isSubmitting ? <BtnLoader /> : "Submit Objective"}
          </Button>
        </Box>
      </form>
    </Box>
  );
};

export default SubmitionForm;
