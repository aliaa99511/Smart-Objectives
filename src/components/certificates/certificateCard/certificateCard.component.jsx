import styles from "./certificateCard.module.css";
import { getImageName } from "../../../helpers/utilities/getImageName";
import { getFileType } from "../../../helpers/utilities/getFileType";
import { Link } from "react-router-dom";
import PdfIcon from "../../../assets/pdfFile.svg";

const CertificateCard = ({ certificateData }) => {
  const fileType = getFileType(certificateData?.URL);

  return (
    <Link
      to={certificateData?.URL}
      target="_blank"
      rel="noopener noreferrer"
      style={{ textDecoration: "none" }}
    >
      <div className={styles.container}>
        <div className={styles.image}>
          {fileType === "pdf" ? (
            <img src={PdfIcon} alt="PDF file" className={styles.pdfIcon} />
          ) : (
            <img src={certificateData?.URL} alt={certificateData?.Name} />
          )}
        </div>
        <h6>{getImageName(certificateData?.URL)}</h6>
      </div>
    </Link>
  );
};

export default CertificateCard;
