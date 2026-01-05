import { FormControl, Select, MenuItem, Box } from "@mui/material";
import Widget from "../../components/general/widget/widget.component";
import { MdOutlineCalendarToday } from "react-icons/md";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { getYearsArray } from "../../helpers/utilities/getYearsArray";
import styles from "./certificates.module.css";
import { useGetCertificatesQuery } from "../../appState/apis/smartObjectiveApiSlice";
import { useFetchCurrentUserQuery } from "../../appState/apis/userApiSlice";
import CertificatesContainer from "../../components/certificates/certificatesContainer/certificatesContainer.component";
import { Typography } from "@mui/material";
import MainLoader from "../../components/general/mainLoader/mainLoader.component";
import TryAgain from "../../components/general/tryAgain/tryAgain.component";
const Certificates = () => {
  const [years, setYears] = useState([]);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const navigate = useNavigate();
  const location = useLocation();

  const { data: userData } = useFetchCurrentUserQuery();

  // Fetch quarters log data using RTK Query
  const {
    data: certificates,
    isLoading,
    isFetching,
    isError,
    error,
    refetch,
  } = useGetCertificatesQuery({
    year: selectedYear,
    employeeId: userData?.userId,
  });

  const updateYearInUrl = (year) => {
    const searchParams = new URLSearchParams(location.search);
    searchParams.set("year", year);

    navigate(
      {
        pathname: location.pathname,
        search: searchParams.toString(),
      },
      { replace: true }
    );
  };

  const handleYearChange = (event) => {
    const newYear = event.target.value;
    setSelectedYear(newYear);
    updateYearInUrl(newYear);
  };

  useEffect(() => {
    // Get years array starting from 2015 to current year
    const yearsArray = getYearsArray(2015);
    setYears(yearsArray);

    // Check if year is in URL params
    const searchParams = new URLSearchParams(location.search);
    const yearParam = searchParams.get("year");

    if (yearParam) {
      setSelectedYear(Number(yearParam));
    } else {
      // Set current year as default in URL if not already there
      updateYearInUrl(selectedYear);
    }
  }, [location.search]);

  return (
    <>
      <Widget>
        <div className={styles.header}>
          <h1 className={styles.title}>Certificates</h1>
          <div className={styles.yearSelector}>
            <FormControl variant="outlined" size="small">
              <Select
                labelId="year-select-label"
                id="year-select"
                value={selectedYear}
                onChange={handleYearChange}
                startAdornment={
                  <Box sx={{ mr: 1, display: "flex", alignItems: "center" }}>
                    <MdOutlineCalendarToday />
                  </Box>
                }
                sx={{
                  minWidth: "120px",
                  "& .MuiSelect-select": {
                    display: "flex",
                    alignItems: "center",
                    paddingLeft: "8px",
                  },
                }}
              >
                {years.map((year) => (
                  <MenuItem key={year} value={year}>
                    {year}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </div>
        </div>
      </Widget>
      <Widget minHeight="calc(100vh - 115px)">
        {isLoading || isFetching ? (
          <MainLoader height={"calc(100vh - 160px)"} />
        ) : isError ? (
          <TryAgain
            minHeight="calc(100vh - 160px)"
            message="An error occurred while loading data"
            handleTryAgain={refetch}
          />
        ) : certificates?.certificatesArray?.length > 0 ? (
          <CertificatesContainer
            certificates={certificates?.certificatesArray}
          />
        ) : (
          <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            height="100%"
          >
            <Typography variant="body1" color="textSecondary">
              No certificates found for {selectedYear}
            </Typography>
          </Box>
        )}
      </Widget>
    </>
  );
};

export default Certificates;
