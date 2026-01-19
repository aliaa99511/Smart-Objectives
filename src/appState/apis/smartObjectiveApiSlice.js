import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { API_HEADERS, ENDPOINTS } from "../../settings/constants";

export const smartObjectiveApiSlice = createApi({
  reducerPath: "smartObjectives",
  baseQuery: fetchBaseQuery({
    baseUrl: "",
  }),
  tagTypes: ["SmartObjectives", "QuartersLog", "Certificates"],
  endpoints: (builder) => ({
    createSmartObjective: builder.mutation({
      query: (objectiveData) => ({
        url: `${import.meta.env.VITE_BASE_URL}${ENDPOINTS.smartObjectives.create
          }`,
        method: "POST",
        headers: API_HEADERS.DEFAULT,
        body: objectiveData,
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
      invalidatesTags: (result, error) => {
        // Only invalidate tags if the request was successful
        if (result && result.IsSuccess) {
          return ["SmartObjectives", "QuartersLog"];
        }
        // Return empty array if creation failed (won't invalidate any tags)
        return [];
      },
    }),

    // New query to fetch smart objectives
    getMySmartObjectives: builder.query({
      query: (payload) => ({
        url: `${import.meta.env.VITE_BASE_URL}${ENDPOINTS.smartObjectives.myObjective
          }`,
        method: "POST",
        headers: API_HEADERS.DEFAULT,
        body: { ...payload },
      }),
      transformResponse: (response) => {
        // Transform response to handle success/failure
        const isSuccess = response?.d?.IsSuccess == true;
        if (!isSuccess) {
          // If not successful, throw an error to trigger the rejected state
          throw new Error(response?.d?.Message || "Operation failed");
        }

        const data = response?.d?.Result?.SmartObjectives?.map((item) => ({
          employeeId: response?.d?.Result?.Employee?.Id,
          status: item?.Status,
          title: item?.Title,
          progress: item?.Progress,
          details: item?.Details,
          assignedOn: item?.AssignedOn || "__",
          id: item?.ID,
        }));
        const smartObjectivesOverView = {
          achievedNum:
            response?.d?.Result?.SmartObjectivesOverView?.Result?.Achieved,
          notAchievedNum:
            response?.d?.Result?.SmartObjectivesOverView?.Result?.NotAchieved,
          underReviewNum:
            response?.d?.Result?.SmartObjectivesOverView?.Result?.UnderReview,
          totalCount:
            response?.d?.Result?.SmartObjectivesOverView?.Result
              ?.SmartObjectiveTotalCount,
          completionRate: response?.d?.Result?.SmartObjectivesOverView?.Result
            ?.CompletionRate
            ? Math.floor(
              response?.d?.Result?.SmartObjectivesOverView?.Result
                ?.CompletionRate
            )
            : 0,
        };
        return {
          smartObjectives: data,
          smartObjectivesOverView,
        };
      },
      providesTags: ["SmartObjectives"],
    }),

    // New query to fetch smart objective details
    getSmartObjectiveDetails: builder.query({
      query: (objectiveId) => ({
        url: `${import.meta.env.VITE_BASE_URL}${ENDPOINTS.smartObjectives.objectiveDetails
          }`,
        method: "POST",
        headers: API_HEADERS.DEFAULT,
        body: { ObjectiveID: objectiveId },
      }),
      transformResponse: (response) => {
        // Transform response to handle success/failure
        const isSuccess = response?.d?.IsSuccess == true;
        if (!isSuccess) {
          // If not successful, throw an error to trigger the rejected state
          throw new Error(response?.d?.Message || "Operation failed");
        }

        const data = response?.d?.Result;
        const references = data?.References?.map((ref) => ref);
        return {
          attachments: data?.Attachments || [],
          achievementStatus: data?.AchievementStatus,
          title: data?.Title,
          submittedOn: data?.SubmittedOn,
          status: data?.Status,
          assignedOn: data?.AssignedOn,
          details: data?.Details,
          measurable: data?.Measurable,
          achievable: data?.Achievable,
          relevant: data?.Relevant,
          references,
          progress: data?.Progress,
          createdBy: {
            name: data?.CreatorName,
            img: data?.CreatorImage,
          },
          categoryId: data?.CategoryId,
          weight: data?.Weight || 0,
          employeeId: data?.Employee?.Id,
          employeeDirectManagerId: data?.Employee?.DirectManagerId,
        };
      },
      providesTags: (result, error, objectiveId) => [
        { type: "SmartObjectives", id: objectiveId },
      ],
    }),

    // Add update smart objective mutation
    updateSmartObjective: builder.mutation({
      query: (payload) => ({
        url: `${import.meta.env.VITE_BASE_URL}${ENDPOINTS.smartObjectives.update
          }`,
        method: "POST",
        headers: API_HEADERS.DEFAULT,
        body: payload,
      }),
      transformResponse: (response) => {
        // Transform response to handle success/failure
        const isSuccess = response?.IsSuccess == true;
        if (!isSuccess) {
          // If not successful, throw an error to trigger the rejected state
          throw new Error(response?.Message || "Operation failed");
        }

        return response;
      },
      invalidatesTags: (result, error, arg) => {
        // Only invalidate tags if the request was successful
        if (result && result.IsSuccess) {
          return [
            { type: "SmartObjectives", id: arg.ID },
            "SmartObjectives",
            "QuartersLog",
          ];
        }
        // Return empty array if update failed (won't invalidate any tags)
        return [];
      },
    }),

    // Add update progress mutation
    updateSmartObjectiveProgress: builder.mutation({
      query: (payload) => ({
        url: `${import.meta.env.VITE_BASE_URL}${ENDPOINTS.smartObjectives.updateProgress
          }`,
        method: "POST",
        headers: API_HEADERS.DEFAULT,
        body: payload,
      }),
      // Transform response to handle success/failure
      transformResponse: (response) => {
        const isSuccess = response?.IsSuccess == true;
        if (!isSuccess) {
          // If not successful, throw an error to trigger the rejected state
          throw new Error(response?.Message || "Operation failed");
        }
        return response;
      },
      invalidatesTags: (result, error, arg) => {
        // Only invalidate tags if the request was successful
        if (result && result.IsSuccess) {
          return [{ type: "SmartObjectives", id: arg.ID }, "SmartObjectives"];
        }
        // Return empty array if update failed (won't invalidate any tags)
        return [];
      },
    }),
    // Add this mutation to your existing smartObjectiveApiSlice.js file
    submitAchievement: builder.mutation({
      query: (payload) => ({
        url: `${import.meta.env.VITE_BASE_URL}${ENDPOINTS.smartObjectives.submitAchievement
          }`,
        method: "POST",
        headers: API_HEADERS.DEFAULT,
        body: payload,
      }),
      // Transform response to handle success/failure
      transformResponse: (response) => {
        const isSuccess = response?.IsSuccess == true;
        if (!isSuccess) {
          // If not successful, throw an error to trigger the rejected state
          throw new Error(response?.Message || "Operation failed");
        }
        return response;
      },
      invalidatesTags: (result, error, arg) => {
        // Get the objective ID from the payload
        const objectiveId = arg.Objective?.ID;
        return [
          "SmartObjectives",
          { type: "SmartObjectives", id: objectiveId },
          "QuartersLog",
          "Certificates",
        ];
      },
    }),
    // Add quarters log query
    getQuartersLog: builder.query({
      query: ({ year, employeeId = null }) => ({
        url: `${import.meta.env.VITE_BASE_URL}${ENDPOINTS.smartObjectives.quartersLog
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

        // Convert array to object with quarter numbers as keys
        const quartersObject = quartersArray?.reduce((acc, quarterData) => {
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

        return quartersObject;
      },
      providesTags: ["QuartersLog"],
    }),

    getCertificates: builder.query({
      query: ({ year, employeeId = null }) => ({
        url: `${import.meta.env.VITE_BASE_URL}${ENDPOINTS.employee.getCertificates
          }`,
        method: "POST",
        headers: API_HEADERS.DEFAULT,
        body: {
          employeeID: employeeId,
          Year: year,
        },
      }),
      transformResponse: (response) => {
        // Check if the request was successful
        if (!response?.d?.IsSuccess) {
          // Throw an error with the message from the API
          throw new Error(
            response?.d?.Message || "Failed to retrieve certificates data"
          );
        }

        const certificatesArray = response?.d?.Result?.Certificaties || [];
        const employee = response?.d?.Result?.Employee || {};
        const employeeDetails = {
          name: employee?.Name || "",
          img: employee?.Image?.URL || "",
          jobTitle: employee?.JobTitle || "",
          badge: employee?.Badge || "",
          pendingRequests: employee?.NumberOfPendingRequestForEmployee || null,
        };
        return {
          certificatesArray: certificatesArray,
          employeeDetails: employeeDetails,
        };
      },
      providesTags: ["Certificates"],
    }),
    getAchievementsLogByEmployeeID: builder.query({
      query: ({ employeeId = null }) => {
        let params = {
          $select: "*,Employee/Id,Employee/Title,Department/Id,Department/Title",
          $expand: "Employee,AttachmentFiles,Department",
          $orderby: "Created desc",
        };

        if (employeeId) {
          params.$filter = `EmployeeId eq ${employeeId}`;
        }

        return {
          url: `${import.meta.env.VITE_BASE_URL}${ENDPOINTS.smartObjectives.getAchievement}`,
          method: "GET",
          headers: API_HEADERS.DEFAULT,
          params: params,
        };
      },
      transformResponse: (response) => response.d?.results || [],
      providesTags: ["Achievements"],
    }),

  }),
});

// Export the auto-generated hooks
export const {
  useCreateSmartObjectiveMutation,
  useGetMySmartObjectivesQuery,
  useGetSmartObjectiveDetailsQuery,
  useUpdateSmartObjectiveMutation,
  useUpdateSmartObjectiveProgressMutation,
  useSubmitAchievementMutation,
  useGetQuartersLogQuery,
  useGetCertificatesQuery,
  useGetAchievementsLogByEmployeeIDQuery,
} = smartObjectiveApiSlice;
