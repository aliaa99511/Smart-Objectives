import { IconButton, Typography } from "@mui/material";
import styles from "./companyMemberCard.module.css";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { useState } from "react";
import { Menu, MenuItem } from "@mui/material";
import { useNavigate } from "react-router-dom";
import UserImg from "../../general/userImg/userImg.component";

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
    navigate(
      `/myCompany/currentObjectives?departmentId=${department.id
      }&departmentTitle=${encodeURIComponent(department.title)}`,
      {
        state: {
          employeeId: member.id,
        },
      }
    );
    handleClose();
  };

  const handleQuarterLog = () => {
    // Pass employee ID via state instead of URL parameter
    navigate(
      `/myCompany/quarterLog?departmentId=${department.id
      }&departmentTitle=${encodeURIComponent(department.title)}`,
      {
        state: { employeeId: member.id },
      }
    );
    handleClose();
  };
  const handleCertificate = () => {
    // Pass employee ID via state instead of URL parameter
    navigate(
      `/myCompany/certificateWithHr?departmentId=${department.id
      }&departmentTitle=${encodeURIComponent(department.title)}`,
      {
        state: { employeeId: member.id },
      }
    );
    handleClose();
  };
  const handleAchievements = () => {
    // Pass employee ID via state instead of URL parameter
    navigate(
      `/myCompany/achievementsWithHr?departmentId=${department.id
      }&departmentTitle=${encodeURIComponent(department.title)}`,
      {
        state: { employeeId: member.id },
      }
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
        </div>
        <div className={styles.stats}>
          <div
            className={styles.stat}
          >{`${member.approveRequests} objectives`}</div>
        </div>
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
          quarters log
        </MenuItem>
        <MenuItem className={styles.menuItem} onClick={handleCertificate}>
          certificate
        </MenuItem>
        <MenuItem className={styles.menuItem} onClick={handleAchievements}>
          achievements
        </MenuItem>
      </Menu>
    </div>
  );
};

export default CompanyMemberCard;
