import { Breadcrumbs, Typography } from "@mui/material";
import styles from "./createSmartObjectiveByManager.module.css";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Widget from "../../components/general/widget/widget.component";
import { getYearAndQuarter } from "../../helpers/utilities/getYearAndQuarter";
import QuarterHeader from "../../components/general/quarterHeader/quarterHeader.component";
import UserInfo from "../../components/general/userInfo/userInfo.component";
import CreateSmartObjectiveForm from "../../components/general/createSmartObjectiveForm/createSmartObjectiveForm.component";
import { useEffect, useState } from "react";
import { useGetEmployeeDetailsQuery } from "../../appState/apis/managerApprovalsSoApiSlice";
import { useFetchCurrentUserQuery } from "../../appState/apis/userApiSlice";

const CreateSmartObjectiveByManager = () => {
  const { data: userData } = useFetchCurrentUserQuery();
  const location = useLocation();
  const navigate = useNavigate();
  const [employeeId, setEmployeeId] = useState(null);
  const { year, quarter, quarterMonths } = getYearAndQuarter();

  // Get employeeId from location state or session storage for page refreshes
  useEffect(() => {
    // First try to get from location state
    if (location.state?.employeeId) {
      setEmployeeId(location.state.employeeId);
      // Store in session storage for page refreshes
      sessionStorage.setItem("currentEmployeeId", location.state.employeeId);
    } else {
      // If not in state (e.g., after page refresh), try session storage
      const storedEmployeeId = sessionStorage.getItem("currentEmployeeId");
      if (storedEmployeeId) {
        setEmployeeId(storedEmployeeId);
      } else {
        // If not found anywhere, redirect to myTeam
        navigate("/myTeam");
      }
    }
  }, [location, navigate]);

  // Fetch employee details
  const {
    data: employeeDetails,
    isLoading: isLoadingEmployee,
    isError: isErrorEmployee,
  } = useGetEmployeeDetailsQuery(employeeId, {
    skip: !employeeId,
  });

  // If no employeeId, don't render the component content
  if (!employeeId) return null;

  const handleCurrentObjectives = () => {
    // Pass employee ID via state instead of URL parameter
    navigate("/myTeam/currentObjectives", {
      state: { employeeId },
    });
  };

  return (
    <Widget>
      <Breadcrumbs className={styles.breadcrumbs} aria-label="breadcrumb">
        <Link to="/myTeam">my team</Link>
        <div
          onClick={handleCurrentObjectives}
          className={styles.breadcrumbsLink}
        >
          <span>{"current Objectives"}</span>
        </div>
        <div className={styles.pageName}>
          <span>{"New objective"}</span>
        </div>
      </Breadcrumbs>
      <Typography className={styles.title} variant="h6" fontWeight="bold">
        create new objective
      </Typography>
      <Widget>
        <div className={styles.details}>
          <div className="user">
            <UserInfo
              userData={{
                name: employeeDetails?.name || "",
                img: employeeDetails?.img || "",
                jobTitle: employeeDetails?.jobTitle || "",
                badge: employeeDetails?.badge || "",
                notificationCount: employeeDetails?.pendingRequests || null,
              }}
              imgSize="imgLG"
              nameSize="nameSM"
              isLoading={isLoadingEmployee}
              fullRadius={false}
              withNotfication={true}
            />
          </div>
          <div className="quarter">
            <QuarterHeader
              year={year}
              quarter={quarter}
              quarterMonths={quarterMonths}
              direction="column"
            />
          </div>
        </div>
      </Widget>

      <CreateSmartObjectiveForm
        employeeId={employeeId}
        managerId={userData?.userId}
        redirctTo="/myTeam"
        departmentId={employeeDetails?.departmentId}
      />
    </Widget>
  );
};

export default CreateSmartObjectiveByManager;
