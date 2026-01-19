const isDevOrTest =
  import.meta.env.MODE === "development" || import.meta.env.MODE === "test";

export const ENDPOINTS = {
  user: {
    get_current_user:
      "_layouts/15/Uranium.SmartObjectives.Sharepoint/ManagerApprovals.aspx/GetManagerDetailsWithPendingRequest",
    // get_current_user: "currentuser",
    get_current_user_info:
      "lists/GetByTitle('Employees')/items?$filter=EmployeeId eq ",
    get_current_user_info_for_img:
      "lists/GetByTitle('Employees')/items?$filter=Employee eq ",
  },

  smartObjectives: {
    create: `_layouts/15/Uranium.SmartObjectives.Sharepoint/SmartObjectives.aspx/Create`,
    myObjective: `_layouts/15/Uranium.SmartObjectives.Sharepoint/SmartObjectives.aspx/GetObjectives`,
    objectiveDetails: `_layouts/15/Uranium.SmartObjectives.Sharepoint/SmartObjectives.aspx/GetObjectiveDetails`,
    update:
      "_layouts/15/Uranium.SmartObjectives.Sharepoint/SmartObjectives.aspx/Update",
    updateProgress:
      "_layouts/15/Uranium.SmartObjectives.Sharepoint/SmartObjectives.aspx/Update",
    submitAchievement:
      "_layouts/15/Uranium.SmartObjectives.Sharepoint/SmartObjectives.aspx/Update",
    quartersLog:
      "_layouts/15/Uranium.SmartObjectives.Sharepoint/SmartObjectives.aspx/GetQuartersLog",
    createAchievement:
      "_api/web/lists/getbytitle('Achievement')/items",
    getAchievement:
      "_api/web/lists/getbytitle('Achievement')/items",
  },
  employee: {
    getAllEmployees: `lists/GetByTitle('Employees')/items?$select=EmployeeId,Employee/Title&$expand=Employee`,
    getCertificates: "_layouts/15/Uranium.SmartObjectives.Sharepoint/SmartObjectives.aspx/GetCertificates",
    // getAchievements: `lists/GetByTitle('Achievement')/items?$select=EmployeeId,Employee/Title&$expand=Employee`,
  },
  manager: {
    getSmartObjectives:
      "_layouts/15/Uranium.SmartObjectives.Sharepoint/SmartObjectives.aspx/GetObjectives",
    /*     getSmartObjectives:
      "_layouts/15/Uranium.SmartObjectives.Sharepoint/ManagerApprovals.aspx/GetObjectives",
 */ getEmployeeDetails:
      "_layouts/15/Uranium.SmartObjectives.Sharepoint/ManagerApprovals.aspx/GetManagerDetailsWithPendingRequest",
    getMyTeam:
      "_layouts/15/Uranium.SmartObjectives.Sharepoint/ManagerApprovals.aspx/GetManagerTeamsWithPendingAndApprovalTasks",
    getMyDepartmentMembers:
      "_layouts/15/Uranium.SmartObjectives.Sharepoint/ManagerApprovals.aspx/GetEmployeesWithSmartObjectivesByDepartment",
    managerAccept:
      "_layouts/15/Uranium.SmartObjectives.Sharepoint/ManagerApprovals.aspx/ManagerUpdateObjectiveStatus",
    managerIgnore:
      "_layouts/15/Uranium.SmartObjectives.Sharepoint/ManagerApprovals.aspx/ManagerUpdateObjectiveStatus",
    managerApprove:
      "_layouts/15/Uranium.SmartObjectives.Sharepoint/ManagerApprovals.aspx/ManagerUpdateObjectiveStatus",
    managerReject:
      "_layouts/15/Uranium.SmartObjectives.Sharepoint/ManagerApprovals.aspx/ManagerUpdateObjectiveStatus",
    pendingRequestsNotfication:
      "_layouts/15/Uranium.SmartObjectives.Sharepoint/ManagerApprovals.aspx/GetNumberOfPendingSmartObjectivesCount",
    getActivtesForSO:
      "_layouts/15/Uranium.SmartObjectives.Sharepoint/SmartObjectives.aspx/GetTrackSmartObjectiveActions",
    downloadBulkTemplate: isDevOrTest
      ? "GetFileByServerRelativeUrl('/Documents/SOBulk.xlsx')/$value"
      : "GetFileByServerRelativeUrl('/hr/Documents/SOBulk.xlsx')/$value",
    uploadBulkExcel:
      "_layouts/15/Uranium.SmartObjectives.Sharepoint/ManagerApprovals.aspx/UploadExcel",
  },
  hr: {
    get_departments: "lists/GetByTitle('Departments')/items?$select=Id,Title",
    get_myCompanyEmployees:
      "_layouts/15/Uranium.SmartObjectives.Sharepoint/ManagerApprovals.aspx/GetEmployeesWithSmartObjectivesByDepartment",
  },
  system: {
    sendFeedback:
      "_layouts/15/Uranium.SmartObjectives.Sharepoint/SmartObjectives.aspx/CreateSmartObjectivesAppRating",
    categories: "lists/GetByTitle('ObjectivesCategory')/items",
  },
};
