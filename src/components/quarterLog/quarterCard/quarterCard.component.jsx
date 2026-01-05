/* eslint-disable react/prop-types */

import styles from "./quarterCard.module.css";
import QuarterHeader from "../../general/quarterHeader/quarterHeader.component";
import { getQuarterMonths } from "../../../helpers/utilities/getQuarterMonths";
import { SO_ATCHIVEMENT_STATUS } from "../../../settings/constants/status/smartObjective.status";
import { formatTextWithSpaces } from "../../../helpers/utilities/formatTextWithSpaces";
import StatusLabel from "../../general/statusLabel/statusLabel.component";
import { calculatePercentage } from "../../../helpers/utilities/calculatePercentage";
import { showDrawer } from "../../../appState/slices/drawerSlice";
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import waitImg from ".././../../assets/wait.svg";
import { isQuarterAfterCurrent as isQuarterAfterCurrentHelper } from "../../../helpers/utilities/isQuarterAfterCurrent";
const QuarterCard = ({
  year,
  quarter,
  quarterData,
  hideActions,
  isRedirectToQuarter = false,
  isRedirectToManagerCurrentObjectives = false,
  isRedirectToDepartmentManagerCurrentObjectives = false,
  isRedirectToHRCurrentObjectives = false,
  selectedDepartmentId = "",
  selectedDepartmentTitle = "",
}) => {
  const isQuarterAfterCurrent = isQuarterAfterCurrentHelper(quarter);

  const quarterMonths = getQuarterMonths(quarter); // Returns ["Apr", "May", "Jun"]
  const dispatch = useDispatch();

  return (
    <div className={styles.card}>
      {/*  <Link
        to={
          isRedirectToQuarter
            ? `/?year=${year}&quarter=${quarter}`
            : isRedirectToManagerCurrentObjectives
            ? `/myTeam/currentObjectives/?year=${year}&quarter=${quarter}`
            : isRedirectToDepartmentManagerCurrentObjectives
            ? `/myDepartment/currentObjectives/?year=${year}&quarter=${quarter}`
            : isRedirectToHRCurrentObjectives
            ? `/myCompany/currentObjectives?departmentId=${selectedDepartmentId}&departmentTitle=${selectedDepartmentTitle}&year=${year}&quarter=${quarter}`
            : ""
        }
        style={{
          textDecoration: "none",
          cursor: `pointer`,
        }}
      > */}
      <QuarterHeader
        year={year}
        quarter={quarter}
        quarterMonths={quarterMonths}
      />
      {/* </Link> */}
      <div className={styles.cardBody}>
        <div
          className={styles.scrollContainer}
          style={
            quarterData?.objectives?.length == 0
              ? {
                  minHeight: "100%",
                  justifyContent: "center",
                  alignItems: "center",
                }
              : {}
          }
        >
          {quarterData?.objectives?.length > 0 ? (
            quarterData?.objectives?.map((obj) => (
              <div
                key={obj.ID}
                className={styles.objetiveitem}
                onClick={() =>
                  dispatch(
                    showDrawer({
                      drawerData: { ...obj, hideActions },
                      drawerType: "detailsSO",
                    })
                  )
                }
              >
                <div className={styles.objetiveTitle}>
                  <p>{obj.Title}</p>
                </div>
                <StatusLabel
                  height={"20px"}
                  lable={formatTextWithSpaces(obj.FinalDiscission)}
                  color={
                    SO_ATCHIVEMENT_STATUS[obj?.FinalDiscission]?.txtColor ||
                    SO_ATCHIVEMENT_STATUS["defaultStatus"]?.txtColor
                  }
                  BGColor={
                    SO_ATCHIVEMENT_STATUS[obj?.FinalDiscission]?.BGColor ||
                    SO_ATCHIVEMENT_STATUS["defaultStatus"]?.BGColor
                  }
                  fixedSpace={true}
                />
              </div>
            ))
          ) : (
            <div className={styles.wait}>
              <div className={styles.cont}>
                <img src={waitImg} alt="" />
                {isQuarterAfterCurrent ? (
                  <p>Quarter Not Started</p>
                ) : (
                  <p>No Objective Submitted in this quarter</p>
                )}
              </div>
            </div>
          )}
        </div>
        {quarterData && quarterData?.summary?.count > 0 ? (
          <div className={styles.progressContainer}>
            <div className={styles.progressBar}>
              <div
                className={`${styles.progressSegment}`}
                style={{
                  width: `${calculatePercentage(
                    quarterData?.summary?.achieved,
                    quarterData?.summary?.count
                  )}%`,
                  backgroundColor: SO_ATCHIVEMENT_STATUS["Achieved"]?.txtColor,
                }}
              ></div>
              <div
                className={`${styles.progressSegment}`}
                style={{
                  width: `${calculatePercentage(
                    quarterData?.summary?.notAchieved,
                    quarterData?.summary?.count
                  )}%`,
                  backgroundColor:
                    SO_ATCHIVEMENT_STATUS["NotAchieved"]?.txtColor,
                }}
              ></div>
              <div
                className={`${styles.progressSegment}`}
                style={{
                  width: `${calculatePercentage(
                    quarterData?.summary?.notSubmitted,
                    quarterData?.summary?.count
                  )}%`,
                  backgroundColor:
                    SO_ATCHIVEMENT_STATUS["NotSubmitted"]?.txtColor,
                }}
              ></div>
              <div
                className={`${styles.progressSegment}`}
                style={{
                  width: `${calculatePercentage(
                    quarterData?.summary?.underReview,
                    quarterData?.summary?.count
                  )}%`,
                  backgroundColor:
                    SO_ATCHIVEMENT_STATUS["UnderReview"]?.txtColor,
                }}
              ></div>
            </div>

            <div className={styles.legend}>
              {quarterData?.summary?.achieved > 0 && (
                <StatusLabel
                  lable={formatTextWithSpaces("Achieved")}
                  color={SO_ATCHIVEMENT_STATUS["Achieved"]?.txtColor}
                  BGColor={
                    SO_ATCHIVEMENT_STATUS["Achieved"]?.BGColor ||
                    SO_ATCHIVEMENT_STATUS["defaultStatus"]?.BGColor
                  }
                  count={quarterData?.summary?.achieved}
                  fixedSpace={true}
                />
              )}
              {quarterData?.summary?.notAchieved > 0 && (
                <StatusLabel
                  lable={formatTextWithSpaces("NotAchieved")}
                  color={SO_ATCHIVEMENT_STATUS["NotAchieved"]?.txtColor}
                  BGColor={
                    SO_ATCHIVEMENT_STATUS["NotAchieved"]?.BGColor ||
                    SO_ATCHIVEMENT_STATUS["defaultStatus"]?.BGColor
                  }
                  count={quarterData?.summary?.notAchieved}
                  fixedSpace={true}
                />
              )}

              {quarterData?.summary?.notSubmitted > 0 && (
                <StatusLabel
                  lable={formatTextWithSpaces("NotSubmitted")}
                  color={SO_ATCHIVEMENT_STATUS["NotSubmitted"]?.txtColor}
                  BGColor={
                    SO_ATCHIVEMENT_STATUS["NotSubmitted"]?.BGColor ||
                    SO_ATCHIVEMENT_STATUS["defaultStatus"]?.BGColor
                  }
                  count={quarterData?.summary?.notSubmitted}
                  fixedSpace={true}
                />
              )}
              {quarterData?.summary?.underReview > 0 && (
                <StatusLabel
                  lable={formatTextWithSpaces("UnderReview")}
                  color={SO_ATCHIVEMENT_STATUS["UnderReview"]?.txtColor}
                  BGColor={
                    SO_ATCHIVEMENT_STATUS["UnderReview"]?.BGColor ||
                    SO_ATCHIVEMENT_STATUS["defaultStatus"]?.BGColor
                  }
                  count={quarterData?.summary?.underReview}
                  fixedSpace={true}
                />
              )}
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default QuarterCard;
