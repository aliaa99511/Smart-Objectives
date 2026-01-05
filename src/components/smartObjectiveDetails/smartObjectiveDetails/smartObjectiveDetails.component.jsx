import { useDispatch, useSelector } from "react-redux";
import {
  closeDrawer,
  selectDrawer,
} from "../../../appState/slices/drawerSlice";
import {
  smartObjectiveApiSlice,
  useGetSmartObjectiveDetailsQuery,
  useSubmitAchievementMutation,
} from "../../../appState/apis/smartObjectiveApiSlice";
import { useGetCategoriesQuery } from "../../../appState/apis/systemApiSlice";
import styles from "./smartObjectiveDetails.module.css";
import { Box, Button, Skeleton, Typography } from "@mui/material";
import { formatTextWithSpaces } from "../../../helpers/utilities/formatTextWithSpaces";
import { getYearAndQuarter } from "../../../helpers/utilities/getYearAndQuarter";
import {
  SO_ATCHIVEMENT_STATUS,
  SO_STATUS,
} from "../../../settings/constants/status/smartObjective.status";
import StatusLabel from "../../general/statusLabel/statusLabel.component";
import Widget from "../../general/widget/widget.component";
import QuarterHeader from "../../general/quarterHeader/quarterHeader.component";
import UserInfo from "../../general/userInfo/userInfo.component";
import ProgressBar from "../../general/progressBar/progressBar.component";
import { useState } from "react";
import { hasPermission } from "../../../helpers/utilities/permissinUtilities/hasPermission";
import SubmitionForm from "../submitionForm/submitionForm.component";
import { showToast } from "../../../helpers/utilities/showToast";
import { useFetchCurrentUserQuery } from "../../../appState/apis/userApiSlice";
import { showModal } from "../../../appState/slices/modalSlice";
import {
  useManagerAcceptMutation,
  useManagerApproveMutation,
} from "../../../appState/apis/managerApprovalsSoApiSlice";
import BtnLoader from "../../general/btnLoader/btnLoader.component";
import CertificateCard from "../../certificates/certificateCard/certificateCard.component";
import Grid from "@mui/material/Grid2";
import TryAgain from "../../general/tryAgain/tryAgain.component";
import { useLocation } from "react-router-dom";
import ReferenceItem from "../../general/referenceItem/referenceItem.component";

const SmartObjectiveDetails = () => {
  const { drawerData } = useSelector(selectDrawer);
  const objectiveId = drawerData?.id || drawerData?.ID;
  const hideActions = drawerData?.hideActions;
  const { data: userData } = useFetchCurrentUserQuery();
  const [showSubmitForm, setShowSubmitForm] = useState(false);
  const dispatch = useDispatch();
  const [submitAchievement, { isLoading: isSubmitting }] =
    useSubmitAchievementMutation();

  const [managerAccept, { isLoading: isAcceptLoading }] =
    useManagerAcceptMutation();
  const [managerApprove, { isLoading: isApproveLoading }] =
    useManagerApproveMutation();
  const {
    data: objectiveDetails,
    isLoading,
    isError,
    error,
    refetch,
  } = useGetSmartObjectiveDetailsQuery(objectiveId, {
    skip: !objectiveId,
  });

  // Fetch categories to display category title
  const { data: categories = [], isLoading: isCategoriesLoading } =
    useGetCategoriesQuery();

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

  // Find the category title based on categoryId
  const categoryTitle =
    !isCategoriesLoading && objectiveDetails?.categoryId
      ? categories.find((cat) => cat.Id === objectiveDetails.categoryId)?.Title
      : null;

  // Check if user has permission to submit this objective
  const canSubmitObjective =
    !isLoading &&
    objectiveDetails &&
    hasPermission(
      userData,
      "smartObjective",
      "submitObjective",
      objectiveDetails
    );

  if (isError) {
    return (
      <TryAgain
        minHeight="calc(100vh - 45px)"
        message="An error occurred while loading data"
        handleTryAgain={refetch}
      />
    );
  }

  if (!isLoading && !objectiveDetails) {
    return <div>No details found for this objective</div>;
  }

  const handleFormSubmit = async (data) => {
    // Create a FormData object for the submission
    const formData = new FormData();

    // Add the objective data as JSON string
    formData.append(
      "Objective",
      JSON.stringify({
        ID: objectiveId,
        AchievementStatus: data.achievementStatus,
        SubmitComment: data.comment,
        Progress: objectiveDetails?.progress,
      })
    );

    // Add file attachments
    if (data.certificates && data.certificates.length > 0) {
      data.certificates.forEach((file, index) => {
        formData.append(`file${index}`, file);
      });
    }

    try {
      // Submit the achievement using FormData
      const response = await submitAchievement(formData).unwrap();

      // Check if the response indicates success
      if (response && response?.IsSuccess) {
        showToast({
          type: "success",
          messgae: "Smart objective updated successfully",
        });
        // Hide the form after successful submission
        setShowSubmitForm(false);
      } else {
        // Handle case where API returns success but with IsSuccess: false
        const errorMessage =
          response?.Message || "Failed to update smart objective";
        showToast({
          type: "error",
          messgae: errorMessage,
        });
      }
    } catch (err) {
      console.error("Failed to submit achievement:", err);
      // Handle network or other errors
      showToast({
        type: "error",
        messgae: "Something went wrong. Please try again later.",
      });
    }
  };

  const handleAccept = () => {
    if (objectiveDetails) {
      managerAccept({ id: objectiveId })
        .unwrap()
        .then(() => {
          showToast({
            type: "success",
            messgae: "Accept smart objective successfully",
          });
          dispatch(
            smartObjectiveApiSlice.util.invalidateTags([
              { type: "SmartObjectives", id: objectiveId },
            ])
          );
          dispatch(closeDrawer());
        })
        .catch((error) => {
          showToast({
            type: "error",
            messgae: "Failed to accept objective",
          });
          console.error("Failed to accept objective:", error);
        });
    }
  };

  const handleIgnore = () => {
    if (objectiveDetails) {
      dispatch(
        showModal({
          modalType: "ignoreSo",
          modalSize: "xs",
          modalData: {
            id: objectiveId,
            comingFrom: "objectiveDetails",
            ...objectiveDetails,
          },
        })
      );
    }
  };

  const handleApprove = () => {
    if (objectiveDetails) {
      managerApprove({ id: objectiveId })
        .unwrap()
        .then(() => {
          showToast({
            type: "success",
            messgae: "Approve smart objective successfully",
          });
          dispatch(
            smartObjectiveApiSlice.util.invalidateTags([
              { type: "SmartObjectives", id: objectiveId },
            ])
          );
          dispatch(closeDrawer());
        })
        .catch((error) => {
          showToast({
            type: "error",
            messgae: "Failed to approve objective",
          });
          console.error("Failed to approve objective:", error);
        });
    }
  };

  const handleReject = () => {
    if (objectiveDetails) {
      dispatch(
        showModal({
          modalType: "rejectSo",
          modalSize: "sm",
          modalData: {
            id: objectiveId,
            comingFrom: "objectiveDetails",
            ...objectiveDetails,
          },
        })
      );
    }
  };

  return (
    <Box className={styles.detailsContainer}>
      <QuarterHeader
        year={year}
        quarter={quarter}
        quarterMonths={quarterMonths}
      />
      {/* Title Section */}
      <Widget>
        {isLoading ? (
          <Skeleton width={100} />
        ) : (
          <StatusLabel
            lable={formatTextWithSpaces(objectiveDetails.achievementStatus)}
            color={
              SO_ATCHIVEMENT_STATUS[objectiveDetails?.achievementStatus]
                ?.txtColor || SO_ATCHIVEMENT_STATUS["defaultStatus"]?.txtColor
            }
            BGColor={
              SO_ATCHIVEMENT_STATUS[objectiveDetails?.achievementStatus]
                ?.BGColor || SO_ATCHIVEMENT_STATUS["defaultStatus"]?.BGColor
            }
            fixedSpace="true"
            withDot="true"
          />
        )}

        <Typography variant="h6" fontWeight="bold" className={styles.title}>
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

      {/* Header Section */}
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
                lable={formatTextWithSpaces(objectiveDetails.status)}
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

      {/* Details Section */}
      <div className={styles.detailsBody}>
        <Box className={styles.detailsContent}>
          <Box className={styles.detailsItem}>
            <Typography className={styles.lable}>Details:</Typography>
            {isLoading ? (
              <Skeleton width="90%" height={50} />
            ) : (
              <Typography className={styles.detals} variant="body1">
                {objectiveDetails?.details || "No details available."}
              </Typography>
            )}
          </Box>

          <Box className={styles.detailsItem}>
            <Typography className={styles.lable}>
              Measurement criteria:
            </Typography>
            {isLoading ? (
              <Skeleton width="80%" height={30} />
            ) : (
              <Typography className={styles.detals} variant="body1">
                {objectiveDetails?.measurable || "Not specified."}
              </Typography>
            )}
          </Box>

          <Box className={styles.detailsItem}>
            <Typography className={styles.lable}>How to reach it:</Typography>
            {isLoading ? (
              <Skeleton width="70%" height={30} />
            ) : (
              <Typography className={styles.detals} variant="body1">
                {objectiveDetails?.achievable || "No milestones set."}
              </Typography>
            )}
          </Box>

          <Box className={styles.detailsItem}>
            <Typography className={styles.lable}>Relevance:</Typography>
            {isLoading ? (
              <Skeleton width="60%" height={30} />
            ) : (
              <Typography className={styles.detals} variant="body1">
                {objectiveDetails?.relevant || "Not specified."}
              </Typography>
            )}
          </Box>

          <Box className={styles.detailsItem}>
            <Typography className={styles.lable}>Reference:</Typography>
            {isLoading ? (
              <Skeleton width="50%" height={20} />
            ) : objectiveDetails?.references &&
              objectiveDetails.references.length > 0 ? (
              objectiveDetails.references.map((refrence, index) => (
                <ReferenceItem key={index} refrence={refrence} index={index} />
              ))
            ) : (
              <Typography>No references provided.</Typography>
            )}
          </Box>

          <Box className={styles.detailsItem}>
            <Typography className={styles.lable}>Impact:</Typography>
            {isLoading || isCategoriesLoading ? (
              <Skeleton width="40%" height={30} />
            ) : (
              <Typography className={styles.detals} variant="body1">
                {categoryTitle || "Not specified."}
              </Typography>
            )}
          </Box>

          <Box className={styles.detailsItem}>
            <Typography className={styles.lable}>Objective Weight:</Typography>
            {isLoading ? (
              <Skeleton width="30%" height={30} />
            ) : (
              <Typography className={styles.detals} variant="body1">
                {objectiveDetails?.weight || "Not specified."}
              </Typography>
            )}
          </Box>

          <Box className={styles.detailsItem}>
            <Typography className={styles.lable}>Progress:</Typography>
            {isLoading ? (
              <Skeleton width="60%" height={30} />
            ) : (
              <ProgressBar progress={objectiveDetails?.progress} />
            )}
          </Box>
          <div className={styles.detailsItem}>
            <div className={styles.attachments}>
              {objectiveDetails?.attachments?.length > 0 && (
                <>
                  <Typography className={styles.lable}>Attachments:</Typography>
                  <Grid container spacing={2}>
                    {objectiveDetails?.attachments.map((certificateData) => (
                      <Grid key={certificateData?.Name} size={{ xs: 6 }}>
                        <CertificateCard certificateData={certificateData} />
                      </Grid>
                    ))}
                  </Grid>
                </>
              )}
            </div>
          </div>

          {/* Submit Objective Button - Only show when status is InProgress and user has permission */}
          {canSubmitObjective && !showSubmitForm && (
            <Box className={styles.submitButtonContainer}>
              <Button
                variant="contained"
                color="primary"
                onClick={() => setShowSubmitForm(true)}
                className={styles.submitButton}
              >
                Submit Objective
              </Button>
            </Box>
          )}
        </Box>
      </div>

      {/* Submission Form - Only show when button is clicked */}
      {showSubmitForm && (
        <SubmitionForm
          onSubmit={(data) => handleFormSubmit(data)}
          isSubmitting={isSubmitting}
        />
      )}

      {!hideActions &&
        hasPermission(
          userData,
          "smartObjective",
          "accept",
          objectiveDetails
        ) && (
          <Box className={styles.submitButtonContainer}>
            <Button
              onClick={() => dispatch(closeDrawer())}
              className={styles.cancelButton}
            >
              cancel
            </Button>

            <Button
              variant="outlined"
              color="primary"
              onClick={handleIgnore}
              className={styles.outlineButton}
            >
              Ignore
            </Button>
            <Button
              variant="contained"
              color="primary"
              onClick={handleAccept}
              disabled={isAcceptLoading}
            >
              {isAcceptLoading ? <BtnLoader /> : "Accept"}
            </Button>
          </Box>
        )}
      {!hideActions &&
        hasPermission(
          userData,
          "smartObjective",
          "approve",
          objectiveDetails
        ) && (
          <Box className={styles.submitButtonContainer}>
            <Button
              onClick={() => dispatch(closeDrawer())}
              className={styles.cancelButton}
              disabled={isAcceptLoading || isApproveLoading}
            >
              cancel
            </Button>

            <Button
              variant="outlined"
              color="primary"
              onClick={handleReject}
              className={styles.outlineButton}
            >
              reject
            </Button>
            <Button
              variant="contained"
              color="primary"
              onClick={handleApprove}
              disabled={isApproveLoading}
            >
              {isApproveLoading ? <BtnLoader /> : "approve"}
            </Button>
          </Box>
        )}
    </Box>
  );
};

export default SmartObjectiveDetails;
