import { Box, IconButton, Slider, Typography } from "@mui/material";
import styles from "./companyMemberCard.module.css";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { useState } from "react";
import { Menu, MenuItem } from "@mui/material";
import { useNavigate } from "react-router-dom";
import UserImg from "../../general/userImg/userImg.component";
import { SO_ATCHIVEMENT_STATUS } from "../../../settings/constants/status/smartObjective.status";
import { savePositionAndNavigate } from "../../../hooks/navigationHelper";

const CompanyMemberCard = ({ member, department }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const navigate = useNavigate();
  const open = Boolean(anchorEl);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleCurrentObjectives = () => {
    savePositionAndNavigate(
      "myCompany",
      navigate,
      `/myCompany/currentObjectives?departmentId=${department.id}&departmentTitle=${encodeURIComponent(
        department.title
      )}`,
      {
        state: {
          employeeId: member.id,
        },
      },
      member.id
    );

    handleClose();
  };

  const handleQuarterLog = () => {
    savePositionAndNavigate(
      "myCompany",
      navigate,
      `/myCompany/quarterLog?departmentId=${department.id}&departmentTitle=${encodeURIComponent(
        department.title
      )}`,
      {
        state: {
          employeeId: member.id,
        },
      },
      member.id
    );

    handleClose();
  };

  const handleCertificate = () => {
    savePositionAndNavigate(
      "myCompany",
      navigate,
      `/myCompany/certificateWithHr?departmentId=${department.id}&departmentTitle=${encodeURIComponent(
        department.title
      )}`,
      {
        state: {
          employeeId: member.id,
        },
      },
      member.id
    );

    handleClose();
  };

  const handleAchievements = () => {
    savePositionAndNavigate(
      "myCompany",
      navigate,
      `/myCompany/achievementsWithHr?departmentId=${department.id}&departmentTitle=${encodeURIComponent(
        department.title
      )}`,
      {
        state: {
          employeeId: member.id,
        },
      },
      member.id
    );

    handleClose();
  };

  return (
    <div className={`${styles.card} ${open && styles.activeCard}`}>
      <IconButton
        onClick={handleClick}
        className={`${styles.menuButton} ${open && styles.activeBtn}`}
      >
        <MoreVertIcon />
      </IconButton>
      <div className={styles.header}>
        <UserImg
          isLoading={false}
          fullRadius={false}
          userName={member.name}
          img={member.img}
          imgSize="imgLG"
          withNotfication={true}
          notificationCount={member.pendingRequests}
        />
        <div className={styles.content}>
          <Typography variant="h6" className={styles.name}>
            {member.name}
          </Typography>
          <Typography
            variant="body2"
            color="textSecondary"
            className={styles.jobTitle}
          >
            {member.jobTitle}
          </Typography>
          <div
            className={styles.stat}
          >{`${member.approveRequests} objectives`}</div>
        </div>
        <div className={styles.statuses}>
          <div
            className={styles.status}
            style={{
              color:
                SO_ATCHIVEMENT_STATUS["Achieved"]?.txtColor ||
                SO_ATCHIVEMENT_STATUS["defaultStatus"]?.txtColor,
              backgroundColor:
                SO_ATCHIVEMENT_STATUS["Achieved"]?.BGColor ||
                SO_ATCHIVEMENT_STATUS["defaultStatus"]?.BGColor,
            }}
          >
            <span>{member.achievedObjectives}</span>
            <span>Achieved</span>
          </div>
          <div
            className={styles.status}
            style={{
              color: "#EF3535",
              backgroundColor: "#FFEAEF",
            }}
          >
            <span>{member.notAchievedObjectives}</span>
            <span>Not Achieved</span>
          </div>
          <div
            className={styles.status}
            style={{
              color:
                SO_ATCHIVEMENT_STATUS["UnderReview"]?.txtColor ||
                SO_ATCHIVEMENT_STATUS["defaultStatus"]?.txtColor,
              backgroundColor:
                SO_ATCHIVEMENT_STATUS["UnderReview"]?.BGColor ||
                SO_ATCHIVEMENT_STATUS["defaultStatus"]?.BGColor,
            }}
          >
            <span>{member.underReviewObjectives}</span>
            <span>Under Review</span>
          </div>
        </div>
        <Box style={{ width: "100%", marginTop: "10px" }}>
          <Box style={{ display: "flex", justifyContent: "space-between" }}>
            <Typography variant="body2" color="#72757C" fontSize="10px">
              Completion rate
            </Typography>
            <Typography variant="body2" color="#705CCF" fontSize="12px">
              {member?.completionRate}%
            </Typography>
          </Box>
          <Slider
            size="medium"
            defaultValue={member?.completionRate}
            value={member?.completionRate}
            valueLabelFormat={(value) => `${value}%`}
            aria-label="medium"
            sx={{
              cursor: "default",
            }}
          />
        </Box>
      </div>

      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          "aria-labelledby": "basic-button",
        }}
      >
        <MenuItem className={styles.menuItem} onClick={handleCurrentObjectives}>
          Current Objectives
        </MenuItem>
        <MenuItem className={styles.menuItem} onClick={handleQuarterLog}>
          Quarters Log
        </MenuItem>
        <MenuItem className={styles.menuItem} onClick={handleCertificate}>
          Certificate
        </MenuItem>
        <MenuItem className={styles.menuItem} onClick={handleAchievements}>
          Achievements
        </MenuItem>
      </Menu>
    </div>
  );
};

export default CompanyMemberCard;