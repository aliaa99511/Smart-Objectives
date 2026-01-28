import { Typography, CircularProgress, Box, Skeleton } from "@mui/material";
import Widget from "../../components/general/widget/widget.component";
import styles from "./myCompany.module.css";
import Grid from "@mui/material/Grid2";
import { getYearAndQuarter } from "../../helpers/utilities/getYearAndQuarter";
import { useGetDepartmentsQuery } from "../../appState/apis/hrSoApiSlice";
import AutoCompleteSelector from "../../components/general/autoCompleteSelector/autoCompleteSelector.component";
import { useLocation } from "react-router-dom";
import SelectDepartmentPlaceholder from "../../components/myCompany/selectDepartmentPlaceholder/selectDepartmentPlaceholder.component";
import { useGetMyCompanyEmployeesQuery } from "../../appState/apis/hrSoApiSlice";
import CompanyMemberCard from "../../components/myCompany/companyMemberCard/companyMemberCard.component";
import TryAgain from "../../components/general/tryAgain/tryAgain.component";
import MainLoader from "../../components/general/mainLoader/mainLoader.component";
const MyCompany = () => {
  const location = useLocation();
  // Get URL parameters
  const searchParams = new URLSearchParams(location.search);
  const selectedDepartmentId = searchParams.get("selectedDepartmentId") || null;

  const { year, quarter } = getYearAndQuarter();

  // Get employees for selected department
  const {
    data: departments,
    isLoading: isDepartmentsLoading,
    isError: isDepartmentsError,
  } = useGetDepartmentsQuery();
  const {
    data: companyEmployees,
    isLoading: isEmployeesLoading,
    isError: isEmployeesError,
    isFetching: isEmployeesFeatching,
    refetch,
  } = useGetMyCompanyEmployeesQuery(
    {
      departmentId: selectedDepartmentId,
      year,
      quarter,
    },
    { skip: !selectedDepartmentId }
  );

  return (
    <Widget minHeight="calc(100vh - 20px)">
      <div className={styles.header}>
        <Typography className={styles.title} variant="h6" fontWeight="bold">
          Company
        </Typography>
        <div className={styles.filters}>
          <div className={styles.filter}>
            {!isDepartmentsLoading ? (
              <AutoCompleteSelector
                allSearchItems={departments}
                typeOfSelectedItem={"selectedDepartmentId"}
                placeholder={"Select department"}
                name={"departmentId"}
                disabled={isDepartmentsLoading || isDepartmentsError}
              />
            ) : (
              <Skeleton variant="rectangular" fullwidth="true" height={48} />
            )}
          </div>
        </div>
      </div>

      {!selectedDepartmentId && <SelectDepartmentPlaceholder />}

      {(isEmployeesLoading || isEmployeesFeatching) && (
        <MainLoader height={"calc(100vh - 120px)"} />
      )}

      {isEmployeesError && (
        <TryAgain
          minHeight="calc(100vh - 120px)"
          message="An error occurred while loading data"
          handleTryAgain={refetch}
        />
      )}
      {selectedDepartmentId &&
        !isEmployeesLoading &&
        !isEmployeesError &&
        companyEmployees &&
        companyEmployees.length > 0 ? (
        <Grid container spacing={2}>
          {companyEmployees.map((member) => (
            <Grid size={{ xs: 12, md: 6, lg: 3 }} key={member.id}>
              <CompanyMemberCard
                member={member}
                department={{
                  id: selectedDepartmentId,
                  title: departments.find((d) => d.Id == selectedDepartmentId)
                    ?.Title,
                }}
              />
            </Grid>
          ))}
        </Grid>
      ) : (
        selectedDepartmentId &&
        !isEmployeesLoading &&
        !isEmployeesError && (
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

export default MyCompany;
