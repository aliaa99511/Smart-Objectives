/* eslint-disable react/prop-types */

import styles from "./quarterHeader.module.css"; // Update path!

const QuarterHeader = ({ year, quarter, quarterMonths, direction = "row", light = false }) => {
  return (
    <div className={`${styles.hederContainer} ${styles[direction]} ${light ? styles.light : ""}`}>
      <p className={styles.year}>
        {year} - Q{quarter}
      </p>
      <div className={styles.monthsContainer}>
        {quarterMonths?.map((month, index) => (
          <div key={index} className={styles.monthItem}>
            {month}
            {index < quarterMonths.length - 1 && (
              <span className={styles.separator}>|</span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default QuarterHeader;
