/* eslint-disable react/prop-types */

import styles from "./objectiveOverviewCard.module.css";

const ObjectiveOverviewCard = ({ title, count, unit, icon: Icon, iconColor, iconBgColor }) => {
    return (
        <div className={styles.card}>
            <div className={styles.content}>
                <div className={styles.textContent}>
                    <h3 className={styles.title}>{title}</h3>
                    <div className={styles.countContainer}>
                        <span className={styles.count}>{count}</span>
                        <span className={styles.unit}>{unit}</span>
                    </div>
                </div>
                <div
                    className={styles.iconContainer}
                    style={{ backgroundColor: iconBgColor }}
                >
                    <Icon
                        className={styles.icon}
                        style={{ color: iconColor }}
                    />
                </div>
            </div>
        </div>
    );
};

export default ObjectiveOverviewCard;
