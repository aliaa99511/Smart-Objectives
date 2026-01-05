import {
  Box,
  Button,
  IconButton,
  Skeleton,
  Typography,
  TextField,
  Slider,
} from "@mui/material";
import { getYearAndQuarter } from "../../helpers/utilities/getYearAndQuarter";
import QuarterHeader from "../general/quarterHeader/quarterHeader.component";
import Widget from "../general/widget/widget.component";
import {
  useGetSmartObjectiveDetailsQuery,
  useUpdateSmartObjectiveProgressMutation,
} from "../../appState/apis/smartObjectiveApiSlice";
import { useSelector, useDispatch } from "react-redux";
import { selectDrawer, closeDrawer } from "../../appState/slices/drawerSlice";
import styles from "./editProgressSmartObjective.module.css";
import { SO_STATUS } from "../../settings/constants/status/smartObjective.status";
import { formatTextWithSpaces } from "../../helpers/utilities/formatTextWithSpaces";
import StatusLabel from "../general/statusLabel/statusLabel.component";
import UserInfo from "../general/userInfo/userInfo.component";
import { useState, useEffect } from "react";
import { FaPlus, FaMinus } from "react-icons/fa6";
import { showToast } from "../../helpers/utilities/showToast";
import BtnLoader from "../general/btnLoader/btnLoader.component";
import { useLocation } from "react-router-dom";

const EditProgressSmartObjective = () => {
  // Get URL parameters
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const yearParam = searchParams.get("year");
  const quarterParam = searchParams.get("quarter");

  // Get default values from the utility function
  const { year, quarter, quarterMonths } = getYearAndQuarter(
    undefined,
    quarterParam,
    yearParam
  );
  const { drawerData } = useSelector(selectDrawer);
  const dispatch = useDispatch();
  const objectiveId = drawerData?.id;
  const {
    data: objectiveDetails,
    isLoading,
    isError,
    error,
  } = useGetSmartObjectiveDetailsQuery(objectiveId, {
    skip: !objectiveId,
  });

  const [updateProgress, { isLoading: isUpdating }] =
    useUpdateSmartObjectiveProgressMutation();
  const [currentProgress, setCurrentProgress] = useState(0);
  const [initialProgress, setInitialProgress] = useState(0);
  const [progressInput, setProgressInput] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [comment, setComment] = useState("");

  useEffect(() => {
    if (objectiveDetails?.progress !== undefined) {
      setCurrentProgress(objectiveDetails.progress);
      setInitialProgress(objectiveDetails.progress);
    }
  }, [objectiveDetails]);

  const handleIncrement = () => {
    if (currentProgress < 100) {
      const newProgress = Math.min(currentProgress + 1, 100);
      setCurrentProgress(newProgress);
    }
  };

  const handleDecrement = () => {
    if (currentProgress > 0) {
      const newProgress = Math.max(currentProgress - 1, 0);
      setCurrentProgress(newProgress);
    }
  };

  const handleUpdateProgress = async () => {
    if (currentProgress === initialProgress) {
      showToast({
        type: "info",
        messgae: "No changes to update",
      });
      return;
    }

    try {
      const payload = {
        ID: objectiveId,
        Progress: currentProgress,
        SubmitComment: comment,
      };
      // Convert to FormData
      const formData = new FormData();
      formData.append("Objective", JSON.stringify(payload));
      const response = await updateProgress(formData).unwrap();

      if (response && response?.IsSuccess) {
        showToast({
          type: "success",
          messgae: "Progress updated successfully",
        });
        setInitialProgress(currentProgress);
        dispatch(closeDrawer());
      } else {
        showToast({
          type: "error",
          messgae: response?.Message || "Failed to update progress",
        });
      }
    } catch (error) {
      console.error("Failed to update progress:", error);
      showToast({
        type: "error",
        messgae: "Something went wrong. Please try again later.",
      });
    }
  };

  const handleCancel = () => {
    setCurrentProgress(initialProgress);
    dispatch(closeDrawer());
  };

  const handleProgressInputChange = (e) => {
    // Allow only numbers
    const value = e.target.value.replace(/[^0-9]/g, "");
    setProgressInput(value);
  };

  const applyProgressInput = () => {
    if (progressInput === "") return;

    let newProgress = parseInt(progressInput, 10);

    // Apply constraints
    if (isNaN(newProgress)) newProgress = initialProgress;
    if (newProgress > 100) newProgress = 100;
    if (newProgress < 0) newProgress = 0;

    setCurrentProgress(newProgress);
    setProgressInput("");
    setIsEditing(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      applyProgressInput();
    }
  };

  const handleBlur = () => {
    applyProgressInput();
  };

  return (
    <Box className={styles.detailsContainer}>
      <QuarterHeader
        year={year}
        quarter={quarter}
        quarterMonths={quarterMonths}
      />
      <Widget>
        <Typography variant="h6" fontWeight="bold">
          {isLoading ? (
            <Skeleton width="60%" />
          ) : (
            objectiveDetails?.title || "Objective Title"
          )}
        </Typography>
        <Typography variant="body2" color="gray">
          {isLoading ? (
            <Skeleton width="40%" />
          ) : (
            `Submitted on: ${objectiveDetails?.submittedOn || "Not yet!"}`
          )}
        </Typography>
      </Widget>
      <Widget>
        <div className={styles.detailsHeader}>
          <Box className={styles.headerItem}>
            <Typography variant="subtitle2" color="gray">
              Created by:
            </Typography>
            <Box display="flex" alignItems="center" gap={0.5}>
              <UserInfo
                userData={objectiveDetails?.createdBy}
                imgSize="imgSM"
                nameSize="nameSM"
                isLoading={isLoading}
              />
            </Box>
          </Box>

          {/* Status Section */}
          <Box className={`${styles.headerItem} ${styles.statusSection}`}>
            <Typography variant="subtitle2" color="gray">
              Status:
            </Typography>
            {isLoading ? (
              <Skeleton width={100} />
            ) : (
              <StatusLabel
                lable={formatTextWithSpaces(objectiveDetails?.status)}
                color={
                  SO_STATUS[objectiveDetails?.status]?.txtColor ||
                  SO_STATUS["defaultStatus"]?.txtColor
                }
                BGColor={
                  SO_STATUS[objectiveDetails?.status]?.BGColor ||
                  SO_STATUS["defaultStatus"]?.BGColor
                }
                fixedSpace="true"
              />
            )}
          </Box>

          {/* Assigned on Section */}
          <Box className={styles.headerItem}>
            <Typography variant="subtitle2" color="gray">
              Assigned on:
            </Typography>
            {isLoading ? (
              <Skeleton width={120} />
            ) : (
              <Typography variant="body1" className={styles.assignedOn}>
                {objectiveDetails?.assignedOn || "Not yet!"}
              </Typography>
            )}
          </Box>
        </div>
      </Widget>

      <Widget>
        <Box className={styles.detailsItem}>
          <Typography className={styles.label}>Progress:</Typography>
          {isLoading ? (
            <Skeleton width="100%" height={60} />
          ) : (
            <>
              <Box>
                <Slider
                  size="medium"
                  defaultValue={currentProgress}
                  onChange={(e, progress) => setCurrentProgress(progress)}
                  min={0}
                  max={100}
                  value={currentProgress}
                  valueLabelFormat={(value) => `${value}%`}
                  aria-label="medium"
                  valueLabelDisplay="on"
                />
              </Box>
              <Box className={styles.progressControls}>
                <Box className={styles.progressControlsContent}>
                  <IconButton
                    onClick={handleDecrement}
                    disabled={currentProgress <= 0 || isUpdating}
                    size="small"
                    className={`${styles.controlButton} ${
                      currentProgress <= 0 || isUpdating ? styles.disabled : ""
                    }`}
                  >
                    <FaMinus />
                  </IconButton>

                  {isEditing ? (
                    <TextField
                      value={progressInput}
                      onChange={handleProgressInputChange}
                      onKeyDown={handleKeyDown}
                      onBlur={handleBlur}
                      autoFocus
                      size="small"
                      className={styles.progressInput}
                      inputProps={{
                        maxLength: 3,
                      }}
                    />
                  ) : (
                    <span
                      className={styles.progressValue}
                      onClick={() => {
                        setIsEditing(true);
                        setProgressInput(currentProgress.toString());
                      }}
                    >
                      {currentProgress}%
                    </span>
                  )}

                  <IconButton
                    onClick={handleIncrement}
                    disabled={currentProgress >= 100 || isUpdating}
                    size="small"
                    className={`${styles.controlButton} ${
                      currentProgress >= 100 || isUpdating
                        ? styles.disabled
                        : ""
                    }`}
                  >
                    <FaPlus />
                  </IconButton>
                </Box>
              </Box>
            </>
          )}
        </Box>
        <Box className={styles.formSection}>
          <Typography variant="subtitle1" className={styles.label}>
            Comment:
          </Typography>

          <TextField
            fullWidth
            multiline
            rows={3}
            placeholder="leave a comment to describe your Progress ..."
            className={styles.commentField}
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          />
        </Box>
      </Widget>

      <div className={styles.submitRequest}>
        {isLoading ? (
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
              onClick={handleCancel}
              disabled={isUpdating}
            >
              Cancel
            </Button>
            <Button
              type="button"
              variant="contained"
              onClick={handleUpdateProgress}
              disabled={isUpdating || currentProgress === initialProgress}
              color="primary"
            >
              {isUpdating ? <BtnLoader /> : "Update Progress"}
            </Button>
          </>
        )}
      </div>
    </Box>
  );
};

export default EditProgressSmartObjective;
