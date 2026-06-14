import { isDateOutsideCurrentQuarter } from "../../../helpers/utilities/isDateOutsideCurrentQuarter";

const pagesForAllUsers = {
  createSmartObjective: {
    hasPermission: true,
  },
  myObjectives: {
    text: "objectives overview",
    to: "/",
    icon: "TbTargetArrow",
    hasPermission: true,
  },
  quartersLog: {
    text: "quarters Log",
    to: "/quartersLog",
    icon: "TbCategoryPlus",
    hasPermission: true,
  },
  certificates: {
    text: "certificates",
    to: "/certificates",
    icon: "LiaCertificateSolid",
    hasPermission: true,
  },
  achievements: {
    text: "achievements",
    to: "/achievements",
    icon: "GiTrophyCup",
    hasPermission: true,
  },
  about: {
    text: "About",
    to: "/about",
    icon: "CiCircleInfo",
    hasPermission: true,
  },
};

export const ROLES = {
  Employee: {
    pages: {
      ...pagesForAllUsers,
    },
    smartObjective: {
      update: (user, SO) =>
        SO?.status == "Pending" &&
        user?.userId == SO?.employeeId &&
        !isDateOutsideCurrentQuarter(SO?.creationDate),
      updateProgress: (user, SO) =>
        SO?.status == "InProgress" &&
        user?.userId == SO?.employeeId &&
        !isDateOutsideCurrentQuarter(SO?.creationDate),
      submitObjective: (user, SO) =>
        SO?.status == "InProgress" &&
        user?.userId == SO?.employeeId &&
        !isDateOutsideCurrentQuarter(SO?.creationDate),
    },
  },
  Manager: {
    pages: {
      ...pagesForAllUsers,
      myTeam: {
        text: "My Team",
        to: "/myTeam",
        icon: "MdOutlinePeople",
        hasPermission: true,
      },
      createSmartObjectiveByManager: {
        hasPermission: true,
      },
      createAchievementByManager: {
        hasPermission: true,
      },
      currentObjectives: {
        hasPermission: true,
      },
      certificateWithManager: {
        hasPermission: true,
      },
      achievementsWithManager: {
        hasPermission: true,
      },
      quarterLogWithManager: {
        hasPermission: true,
      },
    },
    smartObjective: {
      approve: (user, SO) =>
        SO?.status == "UnderReview" &&
        user?.userId == SO?.employeeDirectManagerId,
      reject: (user, SO) =>
        SO?.status == "UnderReview" &&
        user?.userId == SO?.employeeDirectManagerId,
      accept: (user, SO) =>
        SO?.status == "Pending" && user?.userId == SO?.employeeDirectManagerId,
      ignore: (user, SO) =>
        SO?.status == "Pending" && user?.userId == SO?.employeeDirectManagerId,
    },
  },
  HR: {
    pages: {
      ...pagesForAllUsers,
      company: {
        parentText: "Company",
        parentIcon: "PiSuitcaseSimpleBold",
        parentIconLibrary: "pi",
        childLinks: [
          {
            myCompany: {
              text: "Company Objectives",
              to: "/myCompany",
              icon: "",
              hasPermission: true,
            },
          },
          {
            myCompanyAchievements: {
              text: "Company Achievements",
              to: "/myCompanyAchievements",
              icon: "",
              hasPermission: true,
            },
          },
          {
            companyAchievements: {
              to: "/myCompanyAchievements/achievements",
              hasPermission: true,
            },
          },
        ],
      },
      currentObjectives: {
        hasPermission: true,
      },
      certificateWithHr: {
        hasPermission: true,
      },
      quarterLogWithHr: {
        hasPermission: true,
      },
      achievementsWithHr: {
        hasPermission: true,
      },
    },
  },
  DepartmentManager: {
    pages: {
      ...pagesForAllUsers,
      myDepartment: {
        text: "My Department",
        to: "/myDepartment",
        icon: "PiTreeView",
        hasPermission: true,
      },
      currentObjectives: {
        hasPermission: true,
      },
      createAchievementByDepartmentManager: {
        hasPermission: true,
      },
      certificateWithDepartmentManager: {
        hasPermission: true,
      },
      quarterLogWithDepartmentManager: {
        hasPermission: true,
      },
      achievementsWithDepartmentManager: {
        hasPermission: true,
      },
    },
  },
  CEO: {
    pages: {
      // CEO Dashboard - NO myObjectives here
      dashboard: {
        text: "Dashboard",
        to: "/ceo/dashboard",
        icon: "MdOutlineDashboard",
        hasPermission: true,
      },
      // Manager pages (CEO can access manager features)
      myTeam: {
        text: "My Team",
        to: "/myTeam",
        icon: "MdOutlinePeople",
        hasPermission: true,
      },
      createSmartObjectiveByManager: {
        hasPermission: true,
      },
      createAchievementByManager: {
        hasPermission: true,
      },
      currentObjectives: {
        hasPermission: true,
      },
      certificateWithManager: {
        hasPermission: true,
      },
      achievementsWithManager: {
        hasPermission: true,
      },
      quarterLogWithManager: {
        hasPermission: true,
      },
      // HR pages (CEO can access HR features)
      company: {
        parentText: "Company",
        parentIcon: "PiSuitcaseSimpleBold",
        parentIconLibrary: "pi",
        childLinks: [
          {
            myCompany: {
              text: "Company Objectives",
              to: "/myCompany",
              icon: "",
              hasPermission: true,
            },
          },
          {
            myCompanyAchievements: {
              text: "Company Achievements",
              to: "/myCompanyAchievements",
              icon: "",
              hasPermission: true,
            },
          },
          {
            companyAchievements: {
              to: "/myCompanyAchievements/achievements",
              hasPermission: true,
            },
          },
        ],
      },
      certificateWithHr: {
        hasPermission: true,
      },
      quarterLogWithHr: {
        hasPermission: true,
      },
      achievementsWithHr: {
        hasPermission: true,
      },
      // Rankings
      rankings: {
        hasPermission: true,
      },
      about: {
        text: "About",
        to: "/about",
        icon: "CiCircleInfo",
        hasPermission: true,
      },
    },
  },
};
