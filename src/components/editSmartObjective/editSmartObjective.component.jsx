import { useSelector, useDispatch } from "react-redux";
import {
  useGetSmartObjectiveDetailsQuery,
  useUpdateSmartObjectiveMutation,
} from "../../appState/apis/smartObjectiveApiSlice";
import { useGetCategoriesQuery } from "../../appState/apis/systemApiSlice";
import { selectDrawer, closeDrawer } from "../../appState/slices/drawerSlice";
import styles from "./editSmartObjective.module.css";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useState, useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { showToast } from "../../helpers/utilities/showToast";
import Grid from "@mui/material/Grid2";
import {
  Button,
  IconButton,
  TextField,
  Typography,
  Skeleton,
  RadioGroup,
  FormControlLabel,
  Radio,
  FormControl,
  FormHelperText,
  Autocomplete,
} from "@mui/material";
import CustoumTextField from "../general/custoumTextField/custoumTextField.component";
import { RiDeleteBin4Fill } from "react-icons/ri";
import BtnLoader from "../general/btnLoader/btnLoader.component";
import ReferenceItem from "../general/referenceItem/referenceItem.component";

const EditSmartObjective = () => {
  const { drawerData } = useSelector(selectDrawer);
  const dispatch = useDispatch();
  const objectiveId = drawerData?.id;
  const {
    data: objectiveDetails,
    isLoading: isLoadingDetails,
    isError,
    error,
  } = useGetSmartObjectiveDetailsQuery(objectiveId, {
    skip: !objectiveId,
  });

  // Add the update mutation hook
  const [updateSmartObjective, { isLoading: isUpdating }] =
    useUpdateSmartObjectiveMutation();

  // Fetch categories
  const { data: categories = [], isLoading: isCategoriesLoading } =
    useGetCategoriesQuery();

  const [referenceInput, setReferenceInput] = useState("");

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

  // Populate form with data when objectiveDetails is loaded
  useEffect(() => {
    if (objectiveDetails && !isLoadingDetails) {
      reset({
        smartObjectiveTitle: objectiveDetails.title || "",
        Measure: objectiveDetails.measurable || "",
        Details: objectiveDetails.details || "",
        reach: objectiveDetails.achievable || "",
        Relevance: objectiveDetails.relevant || "",
        Weight: objectiveDetails.weight || 0,
        CategoryId: objectiveDetails.categoryId || null,
        references: objectiveDetails.references || [],
        pendingReference: "",
      });
    }
  }, [objectiveDetails, isLoadingDetails, reset]);

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
      // Create the payload for the update request
      const payload = {
        Title: data.smartObjectiveTitle,
        Details: data.Details,
        Measurable: data.Measure,
        Achievable: data.reach,
        Relevant: data.Relevance,
        Weight: data.Weight,
        CategoryId: data.CategoryId,
        References: data.references,
        ID: objectiveId,
      };
      // Convert to FormData
      const formData = new FormData();
      formData.append("Objective", JSON.stringify(payload));

      try {
        // Use the RTK Query mutation
        const response = await updateSmartObjective(formData).unwrap();

        // Check if the response indicates success
        if (response && response?.IsSuccess) {
          showToast({
            type: "success",
            messgae: "Smart objective updated successfully",
          });
          // Close the drawer
          dispatch(closeDrawer());
        } else {
          // Handle case where API returns success but with IsSuccess: false
          const errorMessage =
            response?.Message || "Failed to update smart objective";
          showToast({
            type: "error",
            messgae: errorMessage,
          });
        }
      } catch (error) {
        console.error("Failed to update objective:", error);
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
    // Reset form to original data
    if (objectiveDetails) {
      reset({
        smartObjectiveTitle: objectiveDetails.title || "",
        Measure: objectiveDetails.measurable || "",
        Details: objectiveDetails.details || "",
        reach: objectiveDetails.achievable || "",
        Relevance: objectiveDetails.relevant || "",
        Weight: objectiveDetails.weight || 0,
        CategoryId: objectiveDetails.categoryId || null,
        references: objectiveDetails.references || [],
        pendingReference: "",
      });
    }

    // Clear any reference input
    setReferenceInput("");

    // Close the drawer
    dispatch(closeDrawer());
  };

  if (isError) {
    return (
      <div>Error loading details: {error?.message || "Unknown error"}</div>
    );
  }

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
          {isLoadingDetails ? (
            <Skeleton variant="rectangular" width="100%" height={40} />
          ) : (
            <Controller
              name="smartObjectiveTitle"
              control={control}
              render={({ field }) => (
                <CustoumTextField
                  field={field}
                  errors={errors}
                  placeholder="enter objective title"
                  className={styles.formControl}
                  rows={1}
                  multiline={false}
                />
              )}
            />
          )}
        </Grid>
      </Grid>

      <Grid container spacing={2}>
        <Grid size={{ xs: 12 }}>
          <Typography className={styles.inputTitle}>
            Details <span className={styles.tag}>Specific</span>
          </Typography>
          {isLoadingDetails ? (
            <Skeleton variant="rectangular" width="100%" height={40} />
          ) : (
            <Controller
              name="Details"
              control={control}
              render={({ field }) => (
                <CustoumTextField
                  field={field}
                  errors={errors}
                  placeholder="Describe the objective and What needs to be accomplished."
                  className={styles.formControl}
                />
              )}
            />
          )}
        </Grid>

        <Grid size={{ xs: 12 }}>
          <Typography className={styles.inputTitle}>
            Measurement Criteria <span className={styles.tag}>Measurable</span>
          </Typography>
          {isLoadingDetails ? (
            <Skeleton variant="rectangular" width="100%" height={40} />
          ) : (
            <Controller
              name="Measure"
              control={control}
              render={({ field }) => (
                <CustoumTextField
                  field={field}
                  errors={errors}
                  placeholder="List the standards used for measuring success."
                  className={styles.formControl}
                />
              )}
            />
          )}
        </Grid>
      </Grid>

      <Grid container spacing={2}>
        <Grid size={{ xs: 12 }}>
          <Typography className={styles.inputTitle}>
            How to Reach It <span className={styles.tag}>Achievable</span>
          </Typography>
          {isLoadingDetails ? (
            <Skeleton variant="rectangular" width="100%" height={40} />
          ) : (
            <Controller
              name="reach"
              control={control}
              render={({ field }) => (
                <CustoumTextField
                  field={field}
                  errors={errors}
                  placeholder="What are The key steps to get there?"
                  className={styles.formControl}
                />
              )}
            />
          )}
        </Grid>

        <Grid size={{ xs: 12 }}>
          <Typography className={styles.inputTitle}>
            Relevance <span className={styles.tag}>Relevant</span>
          </Typography>
          {isLoadingDetails ? (
            <Skeleton variant="rectangular" width="100%" height={40} />
          ) : (
            <Controller
              name="Relevance"
              control={control}
              render={({ field }) => (
                <CustoumTextField
                  field={field}
                  errors={errors}
                  placeholder="The objective should matter to you and align with broader goals."
                  className={styles.formControl}
                />
              )}
            />
          )}
        </Grid>
      </Grid>

      {/* Category and Weight Fields */}
      <Grid container spacing={2}>
        <Grid size={{ xs: 12, md: 6 }}>
          <Typography className={styles.inputTitle}>Impact</Typography>
          {isLoadingDetails ? (
            <Skeleton variant="rectangular" width="100%" height={53} />
          ) : !isCategoriesLoading && categories ? (
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
                      placeholder="Select Category"
                      error={!!errors.CategoryId}
                      className={styles.formControl}
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
          {isLoadingDetails ? (
            <Skeleton variant="rectangular" width="100%" height={53} />
          ) : (
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
                      justifyContent: "flex-start",
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
          )}
        </Grid>
      </Grid>

      {/* References Section - Updated to use React Hook Form */}
      <Grid container spacing={2}>
        <Grid size={{ xs: 12 }}>
          <Typography className={styles.inputTitle}>
            References <span>multiple Links allowed</span>
          </Typography>
          {isLoadingDetails ? (
            <Skeleton variant="rectangular" width="100%" height={40} />
          ) : (
            <>
              {references.length > 0 && (
                <div className={styles.referencesList}>
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
                </div>
              )}
              <div className={styles.referenceInputWrapper}>
                <Controller
                  name="pendingReference"
                  control={control}
                  render={({ field: { ...restField } }) => (
                    <TextField
                      {...restField}
                      fullWidth
                      placeholder="enter the reference URL"
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
            </>
          )}
        </Grid>
        <Button
          sx={{ mt: 1 }}
          onClick={handleAddReference}
          variant="outlinedLight"
          disabled={isLoadingDetails}
        >
          New link
        </Button>
      </Grid>

      <div className={styles.submitRequest}>
        {isLoadingDetails ? (
          <>
            <Skeleton
              variant="rectangular"
              width={150}
              height={44}
              sx={{ borderRadius: 1 }}
            />
            <Skeleton
              variant="rectangular"
              width={150}
              height={44}
              sx={{ borderRadius: 1 }}
            />
          </>
        ) : (
          <>
            <Button
              type="button"
              variant="outlined"
              onClick={onCancel}
              disabled={isLoadingDetails}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="contained"
              disabled={isLoadingDetails}
            >
              {isUpdating ? <BtnLoader /> : "submit edits"}
            </Button>
          </>
        )}
      </div>
    </form>
  );
};

export default EditSmartObjective;
