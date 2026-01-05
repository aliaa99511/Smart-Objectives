import CertificateCard from "../certificateCard/certificateCard.component";
import styles from "./certificatesContainer.module.css";
import Grid from "@mui/material/Grid2";
import { isQuarterAfterCurrent } from "../../../helpers/utilities/isQuarterAfterCurrent";
import { RiShieldStarLine } from "react-icons/ri";
import { GoCircleSlash } from "react-icons/go";

const CertificatesContainer = ({ certificates }) => {
  return (
    <>
      {certificates?.map((certificate) => (
        <div key={certificate?.Quarter} className={styles.container}>
          <h6>Quarter {certificate?.Quarter}:</h6>
          {certificate?.Certificates?.length > 0 ? (
            <Grid container spacing={2}>
              {certificate?.Certificates.map((certificateData) => (
                <Grid
                  key={certificateData?.Name}
                  size={{ xs: 12, md: 6, lg: 4 }}
                >
                  <CertificateCard certificateData={certificateData} />
                </Grid>
              ))}
            </Grid>
          ) : (
            <div className={styles.emptyMessage}>
              {isQuarterAfterCurrent(certificate?.Quarter) ? (
                <p className={styles.notStarted}>
                  <span className={styles.icon}>
                    <GoCircleSlash />{" "}
                  </span>
                  <span>
                    This quarter has not yet started or been submitted.
                  </span>
                </p>
              ) : (
                <p className={styles.noData}>
                  <span className={styles.icon}>
                    <RiShieldStarLine />{" "}
                  </span>
                  <span>
                    No certificates have been achieved during this quarter.
                  </span>
                </p>
              )}
            </div>
          )}
        </div>
      ))}
    </>
  );
};

export default CertificatesContainer;
