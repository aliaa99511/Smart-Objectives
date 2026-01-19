import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { showToast } from "../../../helpers/utilities/showToast";
import BtnLoader from "../btnLoader/btnLoader.component";
import { useDispatch } from "react-redux";
import CustoumTextField from "../custoumTextField/custoumTextField.component";
import { Controller, useForm } from "react-hook-form";
import {
  Button,
  Typography,
  RadioGroup,
  FormControlLabel,
  Radio,
  FormControl,
  FormHelperText,
  TextField,
  Box,
} from "@mui/material";
import Grid from "@mui/material/Grid2";
import { useNavigate } from "react-router-dom";
import styles from "./createAchievementForm.module.css";
import { showModal } from "../../../appState/slices/modalSlice";
import {
  useCreateAchievementByManagerMutation,
  useGetRequestDigestMutation,
  useUploadAchievementAttachmentMutation
} from "../../../appState/apis/managerApprovalsSoApiSlice";
import { useState, useRef, useCallback } from "react";
import FileUploadPlaceholder from "../../smartObjectiveDetails/fileUploadPlaceholder/fileUploadPlaceholder.component";
import ImgFileItem from "../../smartObjectiveDetails/imgFileItem/imgFileItem.component";

const CreateAchievementForm = ({
  employeeId = null,
  departmentId = null,
  redirctTo = "/",
}) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [createAchievementByManager, { isLoading }] = useCreateAchievementByManagerMutation();
  const [uploadAttachmentMutation] = useUploadAchievementAttachmentMutation();
  const [getDigest] = useGetRequestDigestMutation();

  const [isSubmitting, setIsSubmitting] = useState(false);

  const fileInputRef = useRef(null);
  const [fileError, setFileError] = useState("");
  const [files, setFiles] = useState([]);

  // Validation schema with Yup
  const schema = yup.object().shape({
    achievementTitle: yup.string().required("Achievement title is required"),
    Description: yup.string().required("Description is required"),
    Date: yup
      .date()
      .required("Date is required")
      .max(new Date(), "Date cannot be in the future")
      .typeError("Please enter a valid date"),
    Weight: yup
      .number()
      .required("Achievement weight is required")
      .min(1, "Weight must be at least 1")
      .max(5, "Weight must be at most 5"),
    attachments: yup.mixed(),
  });

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      achievementTitle: "",
      Description: "",
      Date: "",
      Weight: 0,
    },
  });

  // Function to handle file selection directly
  const handleFileChange = useCallback((e) => {
    if (!e.target.files || e.target.files.length === 0) {
      setFileError("");
      return;
    }

    const selectedFiles = Array.from(e.target.files);
    const validFiles = [];
    const errors = [];

    selectedFiles.forEach(file => {
      // Validate file type
      const allowedTypes = [
        'image/jpeg', 'image/jpg', 'image/png', 'image/gif',
        'application/pdf',
        'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'text/plain'
      ];

      if (!allowedTypes.includes(file.type)) {
        errors.push(`Invalid file type: ${file.name}. Allowed types: Images, PDF, Word, Excel, Text.`);
        return;
      }

      // Validate file size (10MB)
      if (file.size > 10 * 1024 * 1024) {
        errors.push(`File too large: ${file.name} (max 10MB)`);
        return;
      }

      validFiles.push(file);
    });

    if (errors.length > 0) {
      setFileError(errors.join(' '));
    } else {
      setFileError("");
      setFiles(prev => [...prev, ...validFiles]);
    }

    // Reset file input
    e.target.value = "";
  }, []);

  // Function to remove a selected file
  const handleFileDelete = useCallback((index) => {
    const fileToDelete = files[index];
    setFiles(prev => prev.filter((_, i) => i !== index));
  }, [files]);

  // Function to upload attachments
  const uploadAttachments = useCallback(
    async (achievementId, filesToUpload, digest) => {

      const uploadPromises = filesToUpload.map(file =>
        uploadAttachmentMutation({
          achievementId,
          file,
          digest
        }).unwrap()
      );

      await Promise.all(uploadPromises);

    }, [uploadAttachmentMutation]);

  const onSubmit = async (data) => {
    setIsSubmitting(true); // 🔹 loading from the very beginning

    try {
      // 1️⃣ Get SharePoint digest
      const digest = await getDigest().unwrap();

      // 2️⃣ Format date to UTC
      const date = new Date(data.Date);
      const utcDate = new Date(Date.UTC(
        date.getFullYear(),
        date.getMonth(),
        date.getDate(),
        0, 0, 0, 0
      ));

      // 3️⃣ Prepare payload
      const payload = {
        Title: data.achievementTitle,
        Description: data.Description,
        Date: utcDate.toISOString(),
        Weight: data.Weight,
        EmployeeId: employeeId,
        DepartmentId: departmentId,
      };

      // 4️⃣ Create achievement
      const response = await createAchievementByManager({ data: payload, digest }).unwrap();

      if (response && response?.IsSuccess && response?.Id) {
        const achievementId = response.Id;

        // 5️⃣ Upload attachments if exist
        if (files.length > 0) {
          await uploadAttachments(achievementId, files, digest);
          showToast({
            type: "success",
            message: "Achievement created with attachments successfully",
          });
        } else {
          showToast({
            type: "success",
            message: "Achievement created successfully",
          });
        }

        // 6️⃣ Reset form and files
        reset({
          achievementTitle: "",
          Description: "",
          Date: "",
          Weight: 0,
        });
        setFiles([]);

        dispatch(
          showModal({
            modalType: "createAchievementSuccess",
            modalSize: "xs",
            modalData: { redirctTo },
          })
        );
      } else {
        const errorMessage = response?.Message || "Failed to create achievement";
        showToast({ type: "error", message: errorMessage });
      }
    } catch (error) {
      console.error("Failed to create achievement:", error);
      showToast({
        type: "error",
        message: error?.data?.Message || error?.message || "Something went wrong. Please try again later.",
      });
    } finally {
      setIsSubmitting(false); // 🔹 turn off loading at the end
    }
  };

  const onCancel = async () => {
    navigate(redirctTo);
  };

  // Format date for display
  const formatDateForDisplay = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toISOString().split('T')[0];
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      onKeyDown={(e) => {
        if (e.key === "Enter" && e.target.tagName !== "TEXTAREA") {
          e.preventDefault();
        }
      }}
      className={styles.form}
    >
      <Grid container spacing={2}>
        <Grid size={{ xs: 12 }}>
          <Typography className={styles.inputTitle}>Achievement Title</Typography>
          <Controller
            name="achievementTitle"
            control={control}
            render={({ field }) => (
              <CustoumTextField
                field={field}
                errors={errors}
                placeholder="Enter achievement title"
                className={styles.formControl}
                rows={1}
                multiline={false}
              />
            )}
          />
        </Grid>
      </Grid>

      <Grid container spacing={2}>
        <Grid size={{ xs: 12 }}>
          <Typography className={styles.inputTitle}>
            Description
          </Typography>
          <Controller
            name="Description"
            control={control}
            render={({ field }) => (
              <CustoumTextField
                field={field}
                errors={errors}
                placeholder="Describe the achievement and what needs to be accomplished"
                className={styles.formControl}
              />
            )}
          />
        </Grid>
      </Grid>

      <Grid container spacing={2}>
        <Grid size={{ xs: 12, md: 6 }}>
          <Typography className={styles.inputTitle}>Date</Typography>
          <Controller
            name="Date"
            control={control}
            render={({ field: { onChange, value, ...restField } }) => (
              <FormControl fullWidth error={!!errors.Date}>
                <TextField
                  {...restField}
                  type="date"
                  value={formatDateForDisplay(value)}
                  onChange={(e) => onChange(e.target.value)}
                  error={!!errors.Date}
                  InputLabelProps={{
                    shrink: true,
                  }}
                  inputProps={{
                    max: new Date().toISOString().split('T')[0],
                  }}
                  fullWidth
                />
                {errors.Date && (
                  <FormHelperText>{errors.Date.message}</FormHelperText>
                )}
              </FormControl>
            )}
          />
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          <Typography className={styles.inputTitle}>
            Achievement Weight
          </Typography>
          <Controller
            name="Weight"
            control={control}
            render={({ field: { onChange, value } }) => (
              <FormControl error={!!errors.Weight} fullWidth>
                <RadioGroup
                  row
                  value={value.toString()}
                  onChange={(e) => onChange(parseInt(e.target.value))}
                  sx={{
                    display: "flex",
                    gap: 2,
                    justifyContent: "space-around",
                    alignItems: "center",
                  }}
                >
                  {[1, 2, 3, 4, 5].map((weight) => (
                    <FormControlLabel
                      key={weight}
                      value={weight.toString()}
                      control={<Radio />}
                      label={weight.toString()}
                      sx={{
                        margin: 0,
                        "& .MuiFormControlLabel-label": {
                          fontSize: "14px",
                        },
                      }}
                    />
                  ))}
                </RadioGroup>
                {errors.Weight && (
                  <FormHelperText>{errors.Weight?.message}</FormHelperText>
                )}
              </FormControl>
            )}
          />
        </Grid>
      </Grid>

      {/* Attachments Section */}
      <Grid container spacing={2}>
        <Grid size={{ xs: 12 }}>
          <Typography className={styles.inputTitle}>
            Attachments
          </Typography>

          {/* File Input */}
          <div className={styles.fileUploadContainer}>
            <input
              className={styles.uploadFile}
              type="file"
              accept=".jpg,.jpeg,.png,.gif,.pdf,.doc,.docx,.xls,.xlsx,.txt"
              ref={fileInputRef}
              onChange={handleFileChange}
              style={{ display: 'none' }}
              multiple
            />
            <div onClick={() => fileInputRef.current && fileInputRef.current.click()}>
              <FileUploadPlaceholder
                isError={!!fileError}
              />
            </div>
          </div>

          {fileError && (
            <FormHelperText error sx={{ mt: 1 }}>
              {fileError}
            </FormHelperText>
          )}

          {/* File List - Display selected files */}
          <Box mt={2}>
            {files.map((file, index) => (
              <ImgFileItem
                key={`new-${index}`}
                fileName={file.name}
                handleFileDelete={() => handleFileDelete(index)}
                id={index}
                isNewFile={true}
              />
            ))}
          </Box>

          <Typography variant="caption" color="text.secondary" display="block" sx={{ mt: 1 }}>
            Max file size: 10MB per file. Allowed types: Images, PDF, Word, Excel, Text files.
            Click the upload area to add files.
          </Typography>
        </Grid>
      </Grid>

      <div className={styles.submitRequest}>
        <Button
          type="button"
          variant="outlined"
          disabled={isSubmitting}
          onClick={onCancel}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          variant="contained"
          disabled={isSubmitting}
        >
          {isSubmitting ? <BtnLoader /> : "Submit"}
        </Button>
      </div>
    </form>
  );
};

export default CreateAchievementForm;