import { useState, useEffect } from "react";
import { useFetchCurrentUserQuery } from "../../../appState/apis/userApiSlice";
import UserInfo from "../../general/userInfo/userInfo.component";
import styles from "./sideBar.module.css";
import { getAccessibleRoutesSchema } from "../../../helpers/utilities/permissinUtilities/getAccessibleRoutesSchema";
import { TbTargetArrow, TbCategoryPlus } from "react-icons/tb";
import { GiTrophyCup } from "react-icons/gi";
import { PiTreeView } from "react-icons/pi";
import { LiaCertificateSolid } from "react-icons/lia";
import { CiCircleInfo } from "react-icons/ci";
import {
  MdSubdirectoryArrowRight,
  MdPendingActions,
  MdOutlinePeople,
} from "react-icons/md";
import { ImTree } from "react-icons/im";
import { NavLink, useLocation } from "react-router-dom";

// MUI imports
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { usePendingRequestsNotificationQuery } from "../../../appState/apis/managerApprovalsSoApiSlice";
import FeadbackForm from "../feadback/feadbackForm.compoenent";
import { MdOutlineDashboard } from "react-icons/md";

const SideBar = () => {
  const { data: userData, isLoading } = useFetchCurrentUserQuery();
  // Check if user has manager role and conditionally fetch notifications
  const isManager = userData?.roles?.some((role) => role === "Manger");

  const { data: notificationsData } = usePendingRequestsNotificationQuery(
    undefined,
    {
      skip: !isManager, // Skip this query if user is not a manager
      pollingInterval: 60000, // Poll every minute to check for new notifications
    }
  );

  const routes = getAccessibleRoutesSchema(userData);
  const [expanded, setExpanded] = useState(false);
  const [initialLoad, setInitialLoad] = useState(true);

  const location = useLocation();
  const { pathname } = location;

  // Check if any parent should be expanded based on active child - only on initial load
  useEffect(() => {
    if (initialLoad && routes && routes.length > 0) {
      // Find the parent with an active child
      for (const route of routes) {
        if (route.isParent && route.children && route.children.length > 0) {
          const hasActiveChild = route.children.some(
            (child) => child.to === pathname
          );

          if (hasActiveChild) {
            setExpanded(route.text);
            break; // Only expand one parent
          }
        }
      }

      setInitialLoad(false);
    }
  }, [pathname, routes, initialLoad]);

  const iconMap = {
    TbTargetArrow,
    TbCategoryPlus,
    LiaCertificateSolid,
    MdSubdirectoryArrowRight,
    MdPendingActions,
    MdOutlinePeople,
    ImTree,
    PiTreeView,
    GiTrophyCup,
    CiCircleInfo,
    MdOutlineDashboard
  };

  const handleChange = (panel) => (event, newExpanded) => {
    event.stopPropagation();
    setExpanded(newExpanded ? panel : false);
  };

  // Check if a parent has an active child
  const isParentActive = (route) => {
    if (route.isParent && route.children && route.children.length > 0) {
      return route.children.some((child) => child.to === pathname);
    }
    return false;
  };

  const isNotfication =
    notificationsData?.pendingObjectivesCount !== undefined
      ? notificationsData.pendingObjectivesCount
      : userData?.numberOfPendingRequestForManager;

  return (
    <div className={styles.sidebar}>
      <div className={styles.sideBarHeader}>
        <UserInfo userData={userData} isLoading={isLoading} />
      </div>

      <div className={styles.sideBarCont}>
        <div className={styles.linksContainer}>
          {routes.map((route) => {
            // Check if this is a parent route with children
            if (route.isParent && route.children && route.children.length > 0) {
              const ParentIconComponent = iconMap[route.icon];
              const isActive = isParentActive(route);

              return (
                <Accordion
                  key={route.text}
                  expanded={expanded === route.text}
                  onChange={handleChange(route.text)}
                  disableGutters
                  elevation={0}
                  className={`${styles.accordion} ${isActive ? "activeParent" : ""
                    }`}
                >
                  <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls={`${route.text}-content`}
                    id={`${route.text}-header`}
                    className={styles.accordionSummary}
                  >
                    <div
                      className={`${styles.parentAccordion} ${isActive ? styles.activeParentText : ""
                        }`}
                    >
                      {ParentIconComponent && (
                        <ParentIconComponent
                          className={isActive ? styles.activeIcon : ""}
                          style={{ marginRight: "8px", fontSize: "24px" }}
                        />
                      )}
                      <span>{route.text}</span>
                    </div>
                  </AccordionSummary>
                  <AccordionDetails className={styles.accordionDetails}>
                    <div className={styles.childrenContainer}>
                      {route.children.map((child) => {
                        const ChildIconComponent = iconMap[child.icon];
                        const isChildActive = pathname === child.to;

                        return (
                          <NavLink
                            key={child.text}
                            to={child.to}
                            className={({ isActive }) =>
                              [
                                isActive ? styles.active : "",
                                styles.link,
                                styles.childLink,
                              ]
                                .filter(Boolean)
                                .join(" ")
                            }
                          >
                            {ChildIconComponent && (
                              <ChildIconComponent
                                className={
                                  isChildActive ? styles.activeChildIcon : ""
                                }
                                style={{ marginRight: "8px", fontSize: "20px" }}
                              />
                            )}
                            <span>{child.text}</span>
                          </NavLink>
                        );
                      })}
                    </div>
                  </AccordionDetails>
                </Accordion>
              );
            }

            // Regular menu item (not a parent)
            const IconComponent = iconMap[route.icon];
            return (
              <NavLink
                key={route.text}
                to={route.to}
                className={({ isActive }) =>
                  [
                    isActive ? styles.active : "",
                    `${styles.link} ${isNotfication &&
                    route.to == "/myTeam" &&
                    styles.pendingRequest
                    } `,
                  ]
                    .filter(Boolean)
                    .join(" ")
                }
              >
                {IconComponent && (
                  <IconComponent
                    className={pathname === route.to ? styles.activeIcon : ""}
                    style={{ marginRight: "8px", fontSize: "24px" }}
                  />
                )}
                <span>{route.text}</span>
              </NavLink>
            );
          })}
        </div>
        <div className={styles.sideBarFooter}>
          <FeadbackForm />
        </div>
      </div>
    </div>
  );
};

export default SideBar;
