import { Breadcrumbs, Typography } from "@mui/material";
import styles from "./createAchievementsByDepartmentManager.module.css";
import { Link, useNavigate, useLocation } from "react-router-dom"; // Add useLocation
import Widget from "../../components/general/widget/widget.component";
import { useGetEmployeeDetailsQuery } from "../../appState/apis/managerApprovalsSoApiSlice";
import CreateAchievementForm from "../../components/general/createAchievementForm/createAchievementForm.component";

const CreateAchievementByDepartmentManager = () => {
    const navigate = useNavigate();
    const location = useLocation(); // Get location to access state

    // Get member data from navigation state instead of current user
    const memberData = location.state?.memberData;
    const employeeId = location.state?.employeeId;

    // Fetch employee details using the member's ID
    const {
        data: employeeDetails,
    } = useGetEmployeeDetailsQuery(employeeId, {
        skip: !employeeId,
    });

    // Use either the fetched details or the passed member data
    const displayData = employeeDetails || memberData;

    const handleCurrentObjectives = () => {
        navigate("/myTeam/currentObjectives", {
            state: { employeeId },
        });
    };

    return (
        <Widget>
            <Breadcrumbs className={styles.breadcrumbs} aria-label="breadcrumb">
                <Link to="/myDepartment">my department</Link>
                <div className={styles.pageName}>
                    <span>{"Create Achievement"}</span>
                </div>
            </Breadcrumbs>
            <Typography className={styles.title} variant="h6" fontWeight="bold">
                create achievement
            </Typography>

            <CreateAchievementForm
                employeeId={employeeId}
                departmentId={displayData?.departmentId || memberData?.departmentId}
                redirctTo="/myTeam"
            />
        </Widget>
    )
}

export default CreateAchievementByDepartmentManager