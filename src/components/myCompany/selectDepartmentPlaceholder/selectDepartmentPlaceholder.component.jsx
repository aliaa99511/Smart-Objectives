import styles from "./selectDepartmentPlaceholder.module.css";
import placeholderImge from "../../../assets/selectDepartmentPlaceholder.svg";
import { IoWarningOutline } from "react-icons/io5";

const SelectDepartmentPlaceholder = () => {
  return (
    <div className={styles.container}>
      <div>
        <div className={styles.imageContainer}>
          <img src={placeholderImge} alt="select department" />
        </div>
        <div className={styles.contentContainer}>
          <span className={styles.icon}>
            <IoWarningOutline />
          </span>
          <span className={styles.text}>
            use the filter above to show department data!
          </span>
        </div>
      </div>
    </div>
  );
};

export default SelectDepartmentPlaceholder;
