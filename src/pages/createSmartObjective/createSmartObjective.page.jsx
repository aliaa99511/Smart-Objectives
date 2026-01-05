import { Link } from "react-router-dom";

import { FaArrowRightLong } from "react-icons/fa6";

import styles from "./createSmartObjective.module.css";
import { getYearAndQuarter } from "../../helpers/utilities/getYearAndQuarter";
import Widget from "../../components/general/widget/widget.component";
import QuarterHeader from "../../components/general/quarterHeader/quarterHeader.component";

import CreateSmartObjectiveForm from "../../components/general/createSmartObjectiveForm/createSmartObjectiveForm.component";
import { useFetchCurrentUserQuery } from "../../appState/apis/userApiSlice";

const CreateSmartObjective = () => {
  const { data: userData } = useFetchCurrentUserQuery();

  const { year, quarter, quarterMonths } = getYearAndQuarter();

  return (
    <Widget minHeight="calc(100vh - (10px * 2))">
      <div className={styles.breadCrumbsContainer}>
        <h1 className={styles.pageTitle}>Create New Objective</h1>
        <Link to="/">
          <div className={styles.breadCrumbs}>
            objectives overview
            <FaArrowRightLong style={{ fontSize: "14px" }} />
          </div>
        </Link>
      </div>
      <QuarterHeader
        year={year}
        quarter={quarter}
        quarterMonths={quarterMonths}
      />
      <CreateSmartObjectiveForm managerId={userData?.managerId} departmentId={userData?.departmentId} />
    </Widget>
  );
};

export default CreateSmartObjective;
