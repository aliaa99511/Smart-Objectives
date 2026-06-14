import { Typography } from "@mui/material";
import Widget from "../../components/general/widget/widget.component";
import styles from "./myCompanyAchievements.module.css";
import { useGetDepartmentsWithAchievementsQuery } from "../../appState/apis/hrSoApiSlice";
import { FaUsers } from "react-icons/fa";
import Grid from "@mui/material/Grid2";
import TryAgain from "../../components/general/tryAgain/tryAgain.component";
import MainLoader from "../../components/general/mainLoader/mainLoader.component";
import { useNavigate } from "react-router-dom";

function MyCompanyAchievements() {
  const currentYear = new Date().getFullYear();
  const navigate = useNavigate();

  const {
    data: departmentsWithAchievements,
    isLoading,
    isError,
    refetch,
  } = useGetDepartmentsWithAchievementsQuery({
    year: currentYear,
  });
  const handleNavigation = (departmentId) => {
    navigate(
      `/myCompanyAchievements/achievements/?year=${currentYear}&selectedDepartmentId=${departmentId}`,
      { state: { fromNavigation: true } },
    );
  };

  return (
    <Widget minHeight="calc(100vh - 20px)">
      <div className={styles.header}>
        <Typography className={styles.title} variant="h6" fontWeight="bold">
          Company Achievements
        </Typography>
      </div>
      {isLoading ? (
        <MainLoader height="calc(100vh - 175px)" />
      ) : isError ? (
        <TryAgain
          minHeight="calc(100vh - 175px)"
          message="An error occurred while loading achievements"
          handleTryAgain={refetch}
        />
      ) : (
        <Grid container spacing={2} sx={{ width: "100%" }}>
          {departmentsWithAchievements?.map((dep) => {
            return (
              <Grid size={{ xs: 12, md: 6, lg: 3 }} key={dep?.departmentName}>
                <div
                  className={styles.card}
                  onClick={() => handleNavigation(dep?.departmentId)}
                >
                  <div className={styles.cardIcon}>
                    {dep?.icon?.imgUrl ? (
                      <img src={dep?.icon?.imgUrl} alt={dep?.icon?.name} />
                    ) : (
                      <FaUsers />
                    )}
                  </div>
                  <div className={styles.depName}>{dep?.departmentName}</div>
                  <div className={styles.depAchievements}>
                    <span>{dep?.achievementCount}</span>
                    <span>Achievements</span>
                  </div>
                </div>
              </Grid>
            );
          })}
        </Grid>
      )}
    </Widget>
  );
}

export default MyCompanyAchievements;
