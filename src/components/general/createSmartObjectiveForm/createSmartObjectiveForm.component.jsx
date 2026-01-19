import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { RiDeleteBin4Fill } from "react-icons/ri";
import { useCreateSmartObjectiveMutation } from "../../../appState/apis/smartObjectiveApiSlice";
import { useGetCategoriesQuery } from "../../../appState/apis/systemApiSlice";
import { showToast } from "../../../helpers/utilities/showToast";
import BtnLoader from "../../general/btnLoader/btnLoader.component";
import { useDispatch } from "react-redux";
import CustoumTextField from "../../general/custoumTextField/custoumTextField.component";
import { Controller, useForm } from "react-hook-form";
import {
  Button,
  TextField,
  Typography,
  IconButton,
  RadioGroup,
  FormControlLabel,
  Radio,
  FormControl,
  FormHelperText,
  Autocomplete,
  Skeleton,
} from "@mui/material";
import Grid from "@mui/material/Grid2";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./createSmartObjectiveForm.module.css";
import { showModal } from "../../../appState/slices/modalSlice";
import { useCreateSmartObjectiveByManagerMutation } from "../../../appState/apis/managerApprovalsSoApiSlice";
import ReferenceItem from "../referenceItem/referenceItem.component";

const CreateSmartObjectiveForm = ({
  employeeId = null,
  managerId = null,
  departmentId = null,
  redirctTo = "/",
}) => {
  const [referenceInput, setReferenceInput] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [createSmartObjective, { isLoading }] =
    useCreateSmartObjectiveMutation();
  const [createSmartObjectiveByManager, { isLoading: isLoadingByManager }] =
    useCreateSmartObjectiveByManagerMutation();

  // Fetch categories
  const { data: categories = [], isLoading: isCategoriesLoading } =
    useGetCategoriesQuery();

  // Validation schema with Yup
  const schema = yup.object().shape({
    smartObjectiveTitle: yup.string().required("Objective title is required"),
    Measure: yup.string().required("Measurement criteria is required"),
    Details: yup.string().required("Details are required"),
    reach: yup.string().required("How to reach it is required"),
    Relevance: yup.string().required("Relevance is required"),
    Weight: yup
      .number()
      .required("Objective weight is required")
      .min(1, "Objective weight is required")
      .max(5, "Weight must be between 1 and 5"),
    CategoryId: yup.string().required("CategoryId is required"),
    // references: yup.array().of(yup.string().url("Invalid URL format")),
    //allow internal url also
    references: yup.array().of(
      yup.string().test("is-url", "Invalid URL format", (value) => {
        if (!value) return true;
        try {
          new URL(value);
          return true;
        } catch {
          return false;
        }
      })
    ),
    pendingReference: yup
      .string()
      .test("valid-url", "Invalid URL format", function (value) {
        // If there's no value, it's valid
        if (!value || !value.trim()) return true;

        try {
          // Basic URL validation
          const url = new URL(value);

          // Check if it starts with http:// or https://
          if (!url.protocol.match(/^https?:$/)) {
            return this.createError({
              message: "URL must start with http:// or https://",
            });
          }

          return true;
        } catch (error) {
          return false;
        }
      }),
  });

  const {
    control,
    handleSubmit,
    watch,
    setValue,
    setError,
    clearErrors,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      smartObjectiveTitle: "",
      Measure: "",
      Details: "",
      reach: "",
      Relevance: "",
      Weight: 0,
      CategoryId: null,
      references: [],
      pendingReference: "",
    },
  });

  // Watch the references array to update the UI
  const references = watch("references");
  const handleAddReference = () => {
    if (!referenceInput.trim()) {
      return;
    }

    try {
      // Basic URL validation
      new URL(referenceInput);

      // Check if it starts with http:// or https://
      if (
        !referenceInput.startsWith("http://") &&
        !referenceInput.startsWith("https://")
      ) {
        throw new Error("URL must start with http:// or https://");
      }

      // Add to references array
      const updatedReferences = [...references, referenceInput];
      setValue("references", updatedReferences, { shouldValidate: true });

      // Clear the input
      setReferenceInput("");
      setValue("pendingReference", "", { shouldValidate: true });
      clearErrors("pendingReference");
    } catch (error) {
      // Set error for invalid URL
      setValue("pendingReference", referenceInput, { shouldValidate: false });
      setError("pendingReference", {
        type: "manual",
        message:
          error.message === "URL must start with http:// or https://"
            ? error.message
            : "Invalid URL format",
      });
    }
  };

  const handleRemoveReference = (index) => {
    const newReferences = [...references];
    newReferences.splice(index, 1);
    setValue("references", newReferences, { shouldValidate: true });
  };

  const onSubmit = async (data) => {
    handleAddReference();

    if (!errors?.["pendingReference"]?.message) {
      const payload = {
        smartObjective: {
          Title: data.smartObjectiveTitle,
          Details: data.Details,
          Measurable: data.Measure,
          Achievable: data.reach,
          Relevant: data.Relevance,
          References: data.references,
          AssignedTo: managerId == 0 ? employeeId : managerId,
          EmployeeID: employeeId, //null means the user create SO for itseltf,
          Weight: data.Weight,
          CategoryId: data.CategoryId,
          DepartmentId: departmentId,
        },
      };

      try {
        // Use the RTK Query mutation
        const response = employeeId
          ? await createSmartObjectiveByManager(payload).unwrap()
          : await createSmartObjective(payload).unwrap();
        // Check if the response indicates success
        if (response && response?.IsSuccess) {
          /* showToast({
            type: "success",
            messgae: "Smart objective created successfully",
          }); */
          // Reset the form
          reset({
            smartObjectiveTitle: "",
            Measure: "",
            Details: "",
            reach: "",
            Relevance: "",
            Weight: 0,
            CategoryId: "",
            references: [],
            pendingReference: "",
          });
          dispatch(
            showModal({
              modalType: "createSmartObjectiveSuccess",
              modalSize: "xs",
              modalData: {
                redirctTo,
              },
            })
          );
        } else {
          // Handle case where API returns success but with IsSuccess: false
          const errorMessage =
            response?.Message || "Failed to create smart objective";
          showToast({
            type: "error",
            messgae: errorMessage,
          });
        }
      } catch (error) {
        console.error("Failed to create objective:", error);
        // Handle network or other errors
        showToast({
          type: "error",
          messgae: "Something went wrong. Please try again later.",
        });
      }
    }
  };

  // Update the pendingReference field when the input changes
  const handleReferenceInputChange = (e) => {
    const value = e.target.value;
    setReferenceInput(value);
    setValue("pendingReference", value, { shouldValidate: false });
    if (!value) {
      // Clear the error
      clearErrors("pendingReference");
      return;
    }
    try {
      // Basic URL validation
      new URL(value);

      // Check if it starts with http:// or https://
      if (!value.startsWith("http://") && !value.startsWith("https://")) {
        throw new Error("URL must start with http:// or https://");
      }

      // Clear the error
      clearErrors("pendingReference");
    } catch (error) {
      // Set error for invalid URL
      setValue("pendingReference", value, { shouldValidate: false });
      setError("pendingReference", {
        type: "manual",
        message:
          error.message === "URL must start with http:// or https://"
            ? error.message
            : "Invalid URL format",
      });
    }
  };

  const onCancel = async () => {
    navigate(redirctTo);
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
          <Typography className={styles.inputTitle}>Objective Title</Typography>
          <Controller
            name="smartObjectiveTitle"
            control={control}
            render={({ field }) => (
              <CustoumTextField
                field={field}
                errors={errors}
                placeholder="Enter objective title"
                className={styles.formControl}
                rows={1}
                multiline={false}
              />
            )}
          />
        </Grid>
      </Grid>

      <Grid container spacing={2}>
        <Grid size={{ xs: 12, md: 6 }}>
          <Typography className={styles.inputTitle}>
            Details <span className={styles.tag}>Specific</span>
          </Typography>
          <Controller
            name="Details"
            control={control}
            render={({ field }) => (
              <CustoumTextField
                field={field}
                errors={errors}
                placeholder="Describe the objective and what needs to be accomplished"
                className={styles.formControl}
              />
            )}
          />
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          <Typography className={styles.inputTitle}>
            Measurement Criteria <span className={styles.tag}>Measurable</span>
          </Typography>
          <Controller
            name="Measure"
            control={control}
            render={({ field }) => (
              <CustoumTextField
                field={field}
                errors={errors}
                placeholder="List the standards used for measuring success"
                className={styles.formControl}
              />
            )}
          />
        </Grid>
      </Grid>

      <Grid container spacing={2}>
        <Grid size={{ xs: 12, md: 6 }}>
          <Typography className={styles.inputTitle}>
            How to Reach It <span className={styles.tag}>Achievable</span>
          </Typography>
          <Controller
            name="reach"
            control={control}
            render={({ field }) => (
              <CustoumTextField
                field={field}
                errors={errors}
                placeholder="What are the key steps to get there?"
                className={styles.formControl}
              />
            )}
          />
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          <Typography className={styles.inputTitle}>
            Relevance <span className={styles.tag}>Relevant</span>
          </Typography>
          <Controller
            name="Relevance"
            control={control}
            render={({ field }) => (
              <CustoumTextField
                field={field}
                errors={errors}
                placeholder="The objective should matter to you and align with broader goals"
                className={styles.formControl}
              />
            )}
          />
        </Grid>
      </Grid>

      {/* Category and Weight Fields */}
      <Grid container spacing={2}>
        <Grid size={{ xs: 12, md: 6 }}>
          <Typography className={styles.inputTitle}>Impact</Typography>
          {!isCategoriesLoading && categories ? (
            <Controller
              name="CategoryId"
              control={control}
              render={({ field: { onChange, value } }) => (
                <Autocomplete
                  fullWidth
                  options={categories}
                  groupBy={(option) => option.CategoryType}
                  getOptionLabel={(option) => option.Title || ""}
                  value={categories.find((cat) => cat.Id === value) || null}
                  onChange={(event, newValue) => {
                    onChange(newValue ? newValue.Id : "");
                  }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      placeholder="Choose One"
                      error={!!errors.CategoryId}
                      className={styles.formControl}
                    // helperText={errors?.assignTo?.message}
                    />
                  )}
                />
              )}
            />
          ) : (
            <Skeleton
              className={"input-skeleton"}
              variant="rectangular"
              fullwidth="true"
              height={53}
            />
          )}
          <div className={styles.errContainer}>
            {errors.CategoryId && (
              <span className="error-input">{errors.CategoryId.message}</span>
            )}
          </div>
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          <Typography className={styles.inputTitle}>
            Objective Weight
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

      {/* References Section - Updated to use React Hook Form */}
      <Grid container spacing={2}>
        <Grid size={{ xs: 12 }}>
          <Typography className={styles.inputTitle}>
            References <span>multiple Links allowed</span>
          </Typography>
          {references.length > 0 && (
            <div className={styles.referencesList}>
              {references.map((refrence, index) => (
                <ReferenceItem
                  key={index}
                  refrence={refrence}
                  handleRemoveReference={handleRemoveReference}
                  index={index}
                />
              ))}
            </div>
          )}
          <div className={styles.referenceInputWrapper}>
            <Controller
              name="pendingReference"
              control={control}
              render={({ field: { value, ...restField } }) => (
                <TextField
                  {...restField}
                  fullWidth
                  placeholder="Enter the reference url"
                  value={referenceInput}
                  onChange={handleReferenceInputChange}
                  error={!!errors.pendingReference}
                  helperText={errors.pendingReference?.message}
                  className={styles.formControl}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && referenceInput.trim()) {
                      e.preventDefault();
                      handleAddReference();
                    }
                  }}
                />
              )}
            />
          </div>
        </Grid>
        <Button onClick={handleAddReference} variant="outlinedLight">
          New link
        </Button>
      </Grid>

      <div className={styles.submitRequest}>
        <Button
          type="button"
          variant="outlined"
          disabled={isLoading || isLoadingByManager}
          onClick={onCancel}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          variant="contained"
          disabled={isLoading || isLoadingByManager}
        >
          {isLoading || isLoadingByManager ? <BtnLoader /> : "Submit"}
        </Button>
      </div>
    </form>
  );
};

export default CreateSmartObjectiveForm;
