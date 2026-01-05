/* eslint-disable no-undef */
/* eslint-disable react/prop-types */
import { FiEdit3 } from "react-icons/fi";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import styles from "./objectiveCard.module.css";
import { formatTextWithSpaces } from "../../../helpers/utilities/formatTextWithSpaces";
import StatusLabel from "../../general/statusLabel/statusLabel.component";
import { SO_STATUS } from "../../../settings/constants/status/smartObjective.status";
import Widget from "../../general/widget/widget.component";
import { hasPermission } from "../../../helpers/utilities/permissinUtilities/hasPermission";
import { useDispatch } from "react-redux";
import { showDrawer } from "../../../appState/slices/drawerSlice";
import ProgressBar from "../../general/progressBar/progressBar.component";
import { useFetchCurrentUserQuery } from "../../../appState/apis/userApiSlice";
import { IconButton, Menu, MenuItem } from "@mui/material";
import { useState } from "react";

const ObjectiveCard = ({ objective }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const { data: userData } = useFetchCurrentUserQuery();
  const dispatch = useDispatch();

  const hasPermissionToEdit = hasPermission(
    userData,
    "smartObjective",
    "update",
    objective
  );
  const hasPermissionToUpdateProgress = hasPermission(
    userData,
    "smartObjective",
    "updateProgress",
    objective
  );

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleEdit = () => {
    dispatch(
      showDrawer({
        drawerData: objective,
        drawerType: `editSO`,
      })
    );
    handleClose();
  };
  const handleEditProgress = () => {
    dispatch(
      showDrawer({
        drawerData: objective,
        drawerType: `editProgressSO`,
      })
    );
    handleClose();
  };

  const handleViewDetails = () => {
    dispatch(showDrawer({ drawerData: objective, drawerType: "detailsSO" }));
    handleClose();
  };

  return (
    <Widget>
      <div className={`${styles.card} ${open && styles.activeCard}`}>
        <div className={styles.cardHeader}>
          <StatusLabel
            lable={formatTextWithSpaces(objective.status)}
            color={
              SO_STATUS[objective?.status]?.txtColor ||
              SO_STATUS["defaultStatus"]?.txtColor
            }
            BGColor={
              SO_STATUS[objective?.status]?.BGColor ||
              SO_STATUS["defaultStatus"]?.BGColor
            }
            fixedSpace="true"
          />
          <IconButton
            onClick={handleClick}
            className={`${styles.menuButton} ${open && styles.activeBtn}`}
          >
            <MoreVertIcon />
          </IconButton>

          {/* <div className={styles.action}>
            <div className={styles.action}>
              <button
                className={styles.editBtn}
                disabled={
                  !hasPermissionToEdit && !hasPermissionToUpdateProgress
                }
                onClick={() =>
                  dispatch(
                    showDrawer({
                      drawerData: objective,
                      drawerType: `${
                        hasPermissionToEdit
                          ? "editSO"
                          : hasPermissionToUpdateProgress
                          ? "editProgressSO"
                          : ""
                      }`,
                    })
                  )
                }
              >
                <FiEdit3 />
              </button>
            </div>
          </div> */}
        </div>
        <h3
          className={styles.title}
          onClick={() =>
            dispatch(
              showDrawer({ drawerData: objective, drawerType: "detailsSO" })
            )
          }
        >
          {objective.title}
        </h3>
        <ProgressBar progress={objective.progress} hideProgressNum={true} />

        <p className={styles.description}>{objective.details}</p>
        <p className={styles.date}>Assigned on: {objective.assignedOn}</p>
      </div>
      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          "aria-labelledby": "basic-button",
        }}
      >
        {hasPermissionToEdit ? (
          <MenuItem className={styles.menuItem} onClick={handleEdit}>
            Edit Objective
          </MenuItem>
        ) : hasPermissionToUpdateProgress ? (
          <MenuItem className={styles.menuItem} onClick={handleEditProgress}>
            update Progress
          </MenuItem>
        ) : null}

        <MenuItem className={styles.menuItem} onClick={handleViewDetails}>
          View details
        </MenuItem>
      </Menu>
    </Widget>
  );
};

export default ObjectiveCard;
