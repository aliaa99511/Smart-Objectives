import styles from "./closeQuarterModal.module.css";
import { PiWarningCircle } from "react-icons/pi";
import {
  useCloseQuarterMutation,
  useGetUnSubmittedObjectivesQuery,
} from "../../../appState/apis/managerApprovalsSoApiSlice";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Autocomplete,
  Button,
  CircularProgress,
  FormControl,
  MenuItem,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import { useState } from "react";
import { getYearsArray } from "../../../helpers/utilities/getYearsArray";
import { quarterOptions } from "../../../settings/constants/options/quarterOptions";
import { useDispatch } from "react-redux";
import { closeModal } from "../../../appState/slices/modalSlice";
import { useFetchCurrentUserQuery } from "../../../appState/apis/userApiSlice";
import { IoMdArrowDropdown } from "react-icons/io";
import BtnLoader from "../../general/btnLoader/btnLoader.component";
import { showToast } from "../../../helpers/utilities/showToast";

function CloseQuarterModal() {
  const dispatch = useDispatch();
  const { data: userData } = useFetchCurrentUserQuery();

  const currentYear = new Date().getFullYear();
  const [selectedYear, setSelectedYear] = useState(currentYear);
  const [selectedQuarter, setSelectedQuarter] = useState("");
  const yearsArray = getYearsArray(2015);
  const {
    data,
    isLoading: isGetUnSubmittedObjectivesLoading,
    isFetching: isGetUnSubmittedObjectivesFetching,
    isError,
    error,
  } = useGetUnSubmittedObjectivesQuery(
    {
      year: selectedYear,
      quarter: selectedQuarter,
      managerId: userData?.userId,
    },
    { skip: !selectedYear || !selectedQuarter },
  );
  const [closeQuarter, { isLoading: isCloseQuarterLoading }] =
    useCloseQuarterMutation();

  const handleYearChange = (event) => {
    const newYear = event.target.value;
    setSelectedYear(newYear);
  };
  const handleQuarterChange = (quarter) => {
    setSelectedQuarter(quarter);
  };
  const handleCancel = () => {
    dispatch(closeModal());
  };
  const handleConfirm = () => {
    closeQuarter({ year: selectedYear, quarter: selectedQuarter })
      .then(() => {
        // Handle success
        showToast({
          type: "success",
          messgae: "Quarter closed successfully",
        });

        dispatch(closeModal());
      })
      .catch((error) => {
        // Handle error
        showToast({
          type: "error",
          messgae: "Failed to close quarter",
        });
        console.error("Failed to ignore objective:", error);
      });
  };
  return (
    <div className={styles.container}>
      <div className={styles.iconContainer}>
        <PiWarningCircle className={styles.icon} />
      </div>
      <h2 className={styles.title}>Close Quarter</h2>
      <p className={styles.message}>select the quarter you want to close</p>
      <div className={styles.filters}>
        <div className={styles.filter}>
          <FormControl variant="outlined" size="small">
            <Select
              labelId="year-select-label"
              id="year-select"
              value={selectedYear}
              onChange={handleYearChange}
              sx={{
                minWidth: "200px",
                "& .MuiSelect-select": {
                  display: "flex",
                  alignItems: "center",
                  paddingLeft: "8px",
                  paddingBlock: "11px",
                },
              }}
            >
              {yearsArray.map((year) => (
                <MenuItem key={year} value={year}>
                  {year}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </div>
        <div className={styles.filter}>
          <Autocomplete
            fullWidth
            options={quarterOptions}
            getOptionLabel={(option) => option.Title || ""}
            value={quarterOptions.find((q) => q.Id === selectedQuarter) || null}
            onChange={(event, newValue) => {
              handleQuarterChange(newValue ? newValue.Id : "");
            }}
            renderInput={(params) => (
              <TextField
                {...params}
                placeholder="Select Quarter"
                className={styles.formControl}
              />
            )}
            disableClearable={true}
          />
        </div>
      </div>
      {isGetUnSubmittedObjectivesLoading ||
      isGetUnSubmittedObjectivesFetching ? (
        <CircularProgress size={24} sx={{ margin: "40px 0 15px 0" }} />
      ) : (
        selectedYear &&
        selectedQuarter && (
          <>
            <p className={styles.message} style={{ margin: "40px 0 15px 0" }}>
              This action will mark all{" "}
              <strong>{data?.unsubmittedObjectivesCount}</strong> unsubmitted
              objectives as <strong>&quot;Not Achieved&quot;</strong> and lock
              the log for this Quarter.
            </p>
            {data?.unsubmittedObjectivesCount > 0 && (
              <Accordion
                sx={{
                  boxShadow: "none",

                  border: "none",
                  width: "100%",
                }}
              >
                <AccordionSummary
                  expandIcon={
                    <IoMdArrowDropdown
                      style={{
                        fontSize: "20px",
                        color: "#362396",
                      }}
                    />
                  }
                  sx={{
                    width: "min-content",
                    margin: "0 auto",
                    marginBottom: "20px",
                  }}
                  aria-controls="panel1-content"
                  id="panel1-header"
                >
                  <Typography
                    component="span"
                    sx={{ fontSize: "12px", color: "#362396" }}
                  >
                    View unsubmitted objectives
                  </Typography>
                </AccordionSummary>
                <AccordionDetails
                  sx={{ border: "1px solid #F6F6F7", borderRadius: "10px" }}
                >
                  {data?.unsubmittedObjectives?.map((objective) => (
                    <div key={objective.id} className={styles.objective}>
                      <Typography>{objective.employeeName}</Typography>
                      <Typography
                        sx={{
                          whiteSpace: "nowrap",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          width: "75%",
                        }}
                      >
                        {objective.title}
                      </Typography>
                      <Typography>{`${objective.progress}%`}</Typography>
                    </div>
                  ))}
                </AccordionDetails>
              </Accordion>
            )}
          </>
        )
      )}
      <div className={styles.buttonContainer}>
        <Button
          variant="outlined"
          onClick={handleCancel}
          className={styles.cancelButton}
        >
          Cancel
        </Button>
        <Button
          variant="contained"
          onClick={handleConfirm}
          className={styles.submitButton}
          disabled={
            !selectedQuarter ||
            !selectedYear ||
            !data?.unsubmittedObjectivesCount ||
            isGetUnSubmittedObjectivesFetching ||
            isGetUnSubmittedObjectivesLoading ||
            isCloseQuarterLoading
          }
        >
          {isCloseQuarterLoading ? <BtnLoader /> : "Confirm"}
        </Button>
      </div>
    </div>
  );
}

export default CloseQuarterModal;
