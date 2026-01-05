import { Typography, CircularProgress, Box } from "@mui/material";
import Widget from "../../components/general/widget/widget.component";
import styles from "./myTeam.module.css";
import { useGetMyTeamQuery } from "../../appState/apis/managerApprovalsSoApiSlice";
import Grid from "@mui/material/Grid2";
import { getYearAndQuarter } from "../../helpers/utilities/getYearAndQuarter";
import TeamMemberCard from "../../components/myTeam/teamMemberCard/teamMemberCard.component";
import MainLoader from "../../components/general/mainLoader/mainLoader.component";
import TryAgain from "../../components/general/tryAgain/tryAgain.component";
const MyTeam = () => {
  const { year, quarter } = getYearAndQuarter();
  const {
    data: team,
    isLoading,
    isError,
    refetch,
  } = useGetMyTeamQuery({ year: year, quarter: quarter });

  return (
    <Widget minHeight="calc(100vh - 20px)">
      <Typography className={styles.title} variant="h6" fontWeight="bold">
        My team
      </Typography>
      {isLoading && <MainLoader height={"calc(100vh - 120px)"} />}

      {isError && (
        <TryAgain
          minHeight="calc(100vh - 120px)"
          message="An error occurred while loading data"
          handleTryAgain={refetch}
        />
      )}
      {team && team.length > 0 ? (
        <Grid container spacing={2}>
          {team.map((member) => (
            <Grid size={{ xs: 12, md: 6, lg: 3 }} key={member.id}>
              <TeamMemberCard member={member} />
            </Grid>
          ))}
        </Grid>
      ) : (
        !isLoading &&
        !isError && (
          <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            height="50vh"
          >
            <Typography>No team members found.</Typography>
          </Box>
        )
      )}
    </Widget>
  );
};

export default MyTeam;
