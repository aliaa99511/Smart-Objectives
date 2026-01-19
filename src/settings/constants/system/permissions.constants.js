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
};

export const ROLES = {
  Employee: {
    pages: {
      ...pagesForAllUsers,
    },
    smartObjective: {
      update: (user, SO) =>
        SO?.status == "Pending" && user?.userId == SO?.employeeId,
      updateProgress: (user, SO) =>
        SO?.status == "InProgress" && user?.userId == SO?.employeeId,
      submitObjective: (user, SO) =>
        SO?.status == "InProgress" && user?.userId == SO?.employeeId,
    },
  },
  Manger: {
    pages: {
      ...pagesForAllUsers,
      /* requestsAndApprovals: {
        parentText: "Requests & Approvals",
        parentIcon: "MdPendingActions",
        childLinks: [
          {
            creationRequests: {
              text: "creation Requests",
              to: "/creationRequests",
              icon: "MdSubdirectoryArrowRight",
              hasPermission: true,
            },
          },
          {
            submissionRequests: {
              text: "submission Requests",
              to: "/submissionRequests",
              icon: "MdSubdirectoryArrowRight",
              hasPermission: true,
            },
          },
        ],
      }, */
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
      myCompany: {
        text: "Company",
        to: "/myCompany",
        icon: "ImTree",
        hasPermission: true,
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
};
