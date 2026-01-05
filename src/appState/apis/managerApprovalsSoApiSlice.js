import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { API_HEADERS, BASEURLS, ENDPOINTS } from "../../settings/constants";
import { formatSharePointDate } from "../../helpers/utilities/formatSharePointDate";
import { extractText } from "../../helpers/utilities/extractText";

export const managerApprovalsSoApiSlice = createApi({
  reducerPath: "managerApprovalsSo",
  baseQuery: fetchBaseQuery({
    baseUrl: "",
  }),
  tagTypes: [
    "ManagerApprovals",
    "TeamMemberSO",
    "EmployeeDetails",
    "MyTeam",
    "PendingNotifications",
    "QuartersLogWithManager",
  ],
  endpoints: (builder) => ({
    // Add the new pendingRequestsNotification endpoint
    pendingRequestsNotification: builder.query({
      query: () => ({
        url: `${import.meta.env.VITE_BASE_URL}${
          ENDPOINTS.manager.pendingRequestsNotfication
        }`,
        method: "POST",
        body: {},
        headers: API_HEADERS.DEFAULT,
      }),
      transformResponse: (response) => {
        const isSuccess = response?.d?.IsSuccess == true;
        if (!isSuccess) {
          // If not successful, throw an error to trigger the rejected state
          throw new Error(response?.d?.Message || "Operation failed");
        }
        const data = response?.d;
        return {
          pendingObjectivesCount: data || 0,
        };
      },
      providesTags: ["PendingNotifications"],
    }),

    getTeamMemberSo: builder.query({
      query: ({ employeeId = null, year = 0, quarter = 0 }) => ({
        url: `${import.meta.env.VITE_BASE_URL}${
          ENDPOINTS.manager.getSmartObjectives
        }`,
        method: "POST",
        headers: API_HEADERS.DEFAULT,
        body: {
          EmployeeID: employeeId,
          Year: year,
          Quarter: quarter,
        },
      }),
      transformResponse: (response) => {
        const isSuccess = response?.d?.IsSuccess == true;
        if (!isSuccess) {
          // If not successful, throw an error to trigger the rejected state
          throw new Error(response?.d?.Message || "Operation failed");
        }
        const data = response?.d?.Result;
        const smartObjectives = data?.SmartObjectives?.map((item) => ({
          employeeId: item?.EmployeeID,
          employeeDirectManagerId: data?.Employee?.DirectManagerId,
          employeeName: item?.EmployeeName || "--",
          title: item?.Title || "--",
          id: item?.ID,
          status: item?.Status || null,
          achivementStatus: item?.AchievementStatus || "--",
          progress: item?.Progress || 0,
          finalDiscission: item?.FinalDiscission || "--",
          submissionDate: item?.SubmittedOn || "--",
          isHasAttachments: item?.Attachments?.length > 0,
        }));
        const smartObjectivesOverView = {
          achievedNum: data?.SmartObjectivesOverView?.Result?.Achieved,
          notAchievedNum: data?.SmartObjectivesOverView?.Result?.NotAchieved,
          totalCount:
            data?.SmartObjectivesOverView?.Result?.SmartObjectiveTotalCount,
          completionRate: data?.SmartObjectivesOverView?.Result?.CompletionRate
            ? Math.floor(data?.SmartObjectivesOverView?.Result?.CompletionRate)
            : 0,
        };
        return {
          smartObjectives,
          id: data?.Employee?.Id,
          name: data?.Employee?.Name,
          jobTitle: data?.Employee?.JobTitle,
          badge: data?.Employee?.Badge || "",
          img: data?.Employee?.Image?.URL || null,
          pendingRequests:
            data?.Employee?.NumberOfPendingRequestForEmployee || 0,
          smartObjectivesOverView,
        };
      },
      providesTags: ["TeamMemberSO"],
    }),

    // Add the getEmployeeDetails endpoint
    getEmployeeDetails: builder.query({
      query: (employeeId) => ({
        url: `${import.meta.env.VITE_BASE_URL}${
          ENDPOINTS.manager.getEmployeeDetails
        }`,
        method: "POST",
        headers: API_HEADERS.DEFAULT,
        body: {
          id: employeeId,
        },
      }),
      transformResponse: (response) => {
        const isSuccess = response?.d?.IsSuccess == true;
        if (!isSuccess) {
          // If not successful, throw an error to trigger the rejected state
          throw new Error(response?.d?.Message || "Operation failed");
        }
        const data = response?.d?.Result?.[0];
        return {
          id: data?.Id,
          name: data?.Name,
          jobTitle: data?.JobTitle,
          badge: data?.Badge || "",
          img: data?.Image?.URL || null,
          pendingRequests: data?.NumberOfPendingRequestForManager || 0,
          departmentId: data?.DepartmentId || null,
        };
      },
      providesTags: ["EmployeeDetails"],
    }),
    getMyTeam: builder.query({
      query: ({ year, quarter }) => ({
        url: `${import.meta.env.VITE_BASE_URL}${ENDPOINTS.manager.getMyTeam}`,
        method: "POST",
        headers: API_HEADERS.DEFAULT,
        body: {
          Year: year,
          Quarter: quarter,
        },
      }),
      transformResponse: (response) => {
        const isSuccess = response?.d?.IsSuccess == true;
        if (!isSuccess) {
          // If not successful, throw an error to trigger the rejected state
          throw new Error(response?.d?.Message || "Operation failed");
        }
        // Adjust this according to your API's actual response structure
        const data = response?.d?.Result || [];
        return data.map((item) => ({
          name: item?.Name || "team member",
          jobTitle: item?.JobTitle,
          img: item?.Image?.URL || null,
          departmentId: item?.DepartmentId,
          id: item?.Id,
          pendingRequests: item?.NumberOfPendingRequestForEmployee || 0,
          approveRequests: item?.NumberOfApproveRequestForEmployee || 0,
        }));
      },
      providesTags: ["MyTeam"],
    }),
    getMyDepartmentMembers: builder.query({
      query: ({ departmentId, year, quarter }) => ({
        url: `${import.meta.env.VITE_BASE_URL}${
          ENDPOINTS.manager.getMyDepartmentMembers
        }`,
        method: "POST",
        headers: API_HEADERS.DEFAULT,
        body: {
          departmentId,
          year,
          quarter,
        },
      }),
      transformResponse: (response) => {
        const isSuccess = response?.d?.IsSuccess == true;
        if (!isSuccess) {
          // If not successful, throw an error to trigger the rejected state
          throw new Error(response?.d?.Message || "Operation failed");
        }
        // Transform the response similar to getMyCompanyEmployees
        const data = response?.d?.Result || [];
        return data.map((item) => ({
          name: item?.Name || "team member",
          jobTitle: item?.JobTitle,
          img: item?.Image?.URL || null,
          departmentId: item?.DepartmentId,
          id: item?.Id,
          pendingRequests: item?.NumberOfPendingRequestForEmployee || 0,
          approveRequests: item?.NumberOfApproveRequestForEmployee || 0,
          achieved: item?.Achieved || 0,
          notAchieved: item?.NotAchieved || 0,
          underReview: item?.UnderReview || 0,
          objectives: item?.Objectives || 0,
          completionRate: item?.CompletionRate
            ? Math.floor(item?.CompletionRate)
            : 0,
        }));
      },
    }),

    // Manager Accept mutation
    managerAccept: builder.mutation({
      query: ({ id, justification = "" }) => ({
        url: `${import.meta.env.VITE_BASE_URL}${
          ENDPOINTS.manager.managerAccept
        }`,
        method: "POST",
        headers: API_HEADERS.DEFAULT,
        body: {
          id,
          isUnderView: false,
          status: "Accept",
          justification,
        },
      }),
      transformResponse: (response) => {
        const isSuccess = response?.d?.IsSuccess == true;
        if (!isSuccess) {
          // If not successful, throw an error to trigger the rejected state
          throw new Error(response?.d?.Message || "Operation failed");
        }
        return response?.d;
      },
      invalidatesTags: (result, error, arg) => {
        // Only invalidate tags if the request was successful
        if (result && result?.IsSuccess) {
          return [
            "TeamMemberSO",
            "EmployeeDetails",
            "MyTeam",
            "PendingNotifications",
            "Activities",
            { type: "QuartersLogWithManager", id: arg.employeeId },
          ];
        }
        // Return empty array if creation failed (won't invalidate any tags)
        return [];
      },
    }),

    // Manager Ignore mutation
    managerIgnore: builder.mutation({
      query: ({ id, justification = "" }) => ({
        url: `${import.meta.env.VITE_BASE_URL}${
          ENDPOINTS.manager.managerIgnore
        }`,
        method: "POST",
        headers: API_HEADERS.DEFAULT,
        body: {
          id,
          isUnderView: false,
          status: "Ignored",
          justification,
        },
      }),
      // Transform response to handle success/failure
      transformResponse: (response) => {
        const isSuccess = response?.d?.IsSuccess == true;
        if (!isSuccess) {
          // If not successful, throw an error to trigger the rejected state
          throw new Error(response?.d?.Message || "Operation failed");
        }
        return response?.d;
      },
      invalidatesTags: (result, error, arg) => {
        // Only invalidate tags if the request was successful
        if (result && result?.IsSuccess) {
          return [
            "TeamMemberSO",
            "EmployeeDetails",
            "MyTeam",
            "PendingNotifications",
            "Activities",
            { type: "QuartersLogWithManager", id: arg.employeeId },
          ];
        }
        // Return empty array if creation failed (won't invalidate any tags)
        return [];
      },
    }),

    // Manager Approve mutation
    managerApprove: builder.mutation({
      query: ({ id, justification = "" }) => ({
        url: `${import.meta.env.VITE_BASE_URL}${
          ENDPOINTS.manager.managerApprove
        }`,
        method: "POST",
        headers: API_HEADERS.DEFAULT,
        body: {
          id,
          isUnderView: true,
          status: "Accept",
          justification,
        },
      }),
      transformResponse: (response) => {
        const isSuccess = response?.d?.IsSuccess == true;
        if (!isSuccess) {
          // If not successful, throw an error to trigger the rejected state
          throw new Error(response?.d?.Message || "Operation failed");
        }
        return response?.d;
      },
      invalidatesTags: (result, error, arg) => {
        // Only invalidate tags if the request was successful
        if (result && result?.IsSuccess) {
          return [
            "TeamMemberSO",
            "EmployeeDetails",
            "MyTeam",
            "PendingNotifications",
            "Activities",
            { type: "QuartersLogWithManager", id: arg.employeeId },
          ];
        }
        // Return empty array if creation failed (won't invalidate any tags)
        return [];
      },
    }),

    // Manager Reject mutation
    managerReject: builder.mutation({
      query: ({ id, justification = "" }) => ({
        url: `${import.meta.env.VITE_BASE_URL}${
          ENDPOINTS.manager.managerReject
        }`,
        method: "POST",
        headers: API_HEADERS.DEFAULT,
        body: {
          id,
          isUnderView: true,
          status: "Ignored",
          justification,
        },
      }),
      transformResponse: (response) => {
        const isSuccess = response?.d?.IsSuccess == true;
        if (!isSuccess) {
          // If not successful, throw an error to trigger the rejected state
          throw new Error(response?.d?.Message || "Operation failed");
        }
        return response?.d;
      },
      invalidatesTags: (result, error, arg) => {
        // Only invalidate tags if the request was successful
        if (result && result?.IsSuccess) {
          return [
            "TeamMemberSO",
            "EmployeeDetails",
            "MyTeam",
            "PendingNotifications",
            "Activities",
            { type: "QuartersLogWithManager", id: arg.employeeId },
          ];
        }
        // Return empty array if creation failed (won't invalidate any tags)
        return [];
      },
    }),

    getQuartersLogWithManager: builder.query({
      query: ({ year, employeeId = null }) => ({
        url: `${import.meta.env.VITE_BASE_URL}${
          ENDPOINTS.smartObjectives.quartersLog
        }`,
        method: "POST",
        headers: API_HEADERS.DEFAULT,
        body: {
          Year: year,
          EmployeeID: employeeId,
        },
      }),
      transformResponse: (response) => {
        // Check if the request was successful
        if (!response?.d?.IsSuccess) {
          // Throw an error with the message from the API
          throw new Error(
            response?.d?.Message || "Failed to retrieve quarters log data"
          );
        }

        // Transform the response data from array to object with quarter numbers as keys
        const quartersArray = response?.d?.Result?.data || [];
        console.log("quartersArray", quartersArray);
        const employee = response?.d?.Result?.Employee || {};
        const employeeDetails = {
          name: employee?.Name || "",
          img: employee?.Image?.URL || "",
          jobTitle: employee?.JobTitle || "",
          badge: employee?.Badge || "",
          pendingRequests: employee?.NumberOfPendingRequestForEmployee || null,
        };

        // Convert array to object with quarter numbers as keys
        const quartersObject = quartersArray?.reduce((acc, quarterData) => {
          console.log("quarterData", quarterData);
          acc[quarterData?.Quarter] = {
            quarter: quarterData?.Quarter,
            objectives: quarterData?.Objectives || [],
            summary: {
              count: quarterData?.Summary?.Count || 0,
              notSubmitted: quarterData?.Summary?.NotSubmitted || 0,
              notAchieved: quarterData?.Summary?.NotAchieved || 0,
              achieved: quarterData?.Summary?.Achieved || 0,
              underReview: quarterData?.Summary?.UnderReview || 0,
            },
          };
          return acc;
        }, {});

        return {
          employeeDetails,
          data: quartersObject,
        };
      },
      providesTags: (result, error, { employeeId }) => [
        { type: "QuartersLogWithManager", id: employeeId || "current" },
      ],
    }),
    getActivitiesForSO: builder.query({
      query: (objectiveId) => ({
        url: `${import.meta.env.VITE_BASE_URL}${
          ENDPOINTS.manager.getActivtesForSO
        }`,
        method: "POST",
        headers: API_HEADERS.DEFAULT,
        body: {
          ObjectiveID: objectiveId,
        },
      }),
      transformResponse: (response) => {
        const isSuccess = response?.d?.IsSuccess == true;
        if (!isSuccess) {
          // If not successful, throw an error to trigger the rejected state
          throw new Error(response?.d?.Message || "Operation failed");
        }
        const data = response?.d?.Result;
        return {
          title: data?.Title || "__",
          submittedOn: data?.SubmittedOn
            ? formatSharePointDate(data?.SubmittedOn)
            : null,
          justification: data?.Justification || "",
          activities:
            data?.Actions?.map((action) => ({
              id: action?.Id,
              name: action?.User || "",
              status: action?.Action || "",
              progress: action?.Progess || "",
              achievementComment: action?.AchievementComment || "",
              comment:
                action?.Action == "Rejected"
                  ? extractText(data?.Justification)
                  : extractText(action?.Comment), //this only show for the rejected action by defult
              date: action?.ActionDate
                ? formatSharePointDate(action?.ActionDate)
                : null,
              img: action?.Image?.URL || null,
            })) || [],
        };
      },
      providesTags: ["Activities"],
    }),

    createSmartObjectiveByManager: builder.mutation({
      query: (objectiveData) => ({
        url: `${import.meta.env.VITE_BASE_URL}${
          ENDPOINTS.smartObjectives.create
        }`,
        method: "POST",
        headers: API_HEADERS.DEFAULT,
        body: objectiveData,
      }),
      // Transform the response to handle custom API response format
      transformResponse: (response) => {
        const isSuccess = response?.d?.IsSuccess == true;
        if (!isSuccess) {
          // If not successful, throw an error to trigger the rejected state
          throw new Error(response?.d?.Message || "Operation failed");
        }
        return response?.d;
      },
      invalidatesTags: (result) => {
        // Only invalidate tags if the request was successful
        if (result && result.IsSuccess) {
          return ["MyTeam", "TeamMemberSO", "QuartersLogWithManager"];
        }
        // Return empty array if creation failed (won't invalidate any tags)
        return [];
      },
    }),

    // Download Bulk Template
    downloadBulkTemplate: builder.mutation({
      query: () => ({
        url: `${import.meta.env.VITE_BASE_URL_PURE}${
          BASEURLS.forSharePointAPIs
        }${ENDPOINTS.manager.downloadBulkTemplate}`,
        method: "GET",
        responseHandler: async (response) => {
          // Handle binary response (Excel file)
          const blob = await response.blob();
          return blob;
        },
      }),
      transformResponse: (blob) => {
        // Create download link
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = "SOBulk.xlsx";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
        return { success: true };
      },
    }),

    // Upload Bulk Excel
    uploadBulkExcel: builder.mutation({
      query: ({ excelFile, employeeId, managerId, departmentId }) => {
        const formData = new FormData();
        // Append text fields first to avoid stream processing issues on server
        formData.append("employeeId", employeeId);
        formData.append("managerId", managerId);
        formData.append("departmentId", departmentId);
        formData.append("excelFile", excelFile, excelFile.name);

        return {
          url: `${import.meta.env.VITE_BASE_URL}${
            ENDPOINTS.manager.uploadBulkExcel
          }`,
          method: "POST",
          body: formData,
        };
      },
      transformResponse: (response) => {
        const isSuccess = response?.IsSuccess == true;
        if (!isSuccess) {
          throw new Error("Upload failed");
        }
        return {
          ...response,
          message: response?.Result?.length > 0 ? response?.Message : null,
          alerts: response?.Result || [],
        };
      },
      invalidatesTags: (result) => {
        if (result && result.IsSuccess) {
          return ["MyTeam", "TeamMemberSO", "QuartersLogWithManager"];
        }
        return [];
      },
    }),
  }),
});

// Export the auto-generated hooks
export const {
  useGetManagerApprovalsQuery,
  useGetEmployeeDetailsQuery,
  useGetMyTeamQuery,
  useGetTeamMemberSoQuery,
  useManagerAcceptMutation,
  useManagerIgnoreMutation,
  useManagerApproveMutation,
  useManagerRejectMutation,
  usePendingRequestsNotificationQuery,
  useGetQuartersLogWithManagerQuery,
  useGetActivitiesForSOQuery,
  useCreateSmartObjectiveByManagerMutation,
  useGetMyDepartmentMembersQuery,
  useDownloadBulkTemplateMutation,
  useUploadBulkExcelMutation,
} = managerApprovalsSoApiSlice;
