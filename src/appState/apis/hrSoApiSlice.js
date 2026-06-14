import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { API_HEADERS, BASEURLS, ENDPOINTS } from "../../settings/constants";
import { formatSharePointDate } from "../../helpers/utilities/formatSharePointDate";
import { extractText } from "../../helpers/utilities/extractText";

export const hrSoApiSlice = createApi({
  reducerPath: "hrSo",
  baseQuery: fetchBaseQuery({
    baseUrl: "",
  }),
  tagTypes: ["Achievers"],
  endpoints: (builder) => ({
    getAllAchieversByDepartment: builder.query({
      query: ({ year, departmentId, userId = 0 }) => ({
        url: `${import.meta.env.VITE_BASE_URL}${
          ENDPOINTS.hr.getAllAchieversByDepartment
        }`,
        method: "POST",
        headers: API_HEADERS.DEFAULT,
        body: {
          year,
          departmentId,
          achieversCount: 0, //0 to get all , if you want specific  achievers Count send number
          userId: userId || 0,
        },
      }),
      transformResponse: (response) => {
        // Transform response to handle success/failure
        const isSuccess = response?.d?.IsSuccess == true;
        if (!isSuccess) {
          // If not successful, throw an error to trigger the rejected state
          throw new Error(response?.d?.Message || "Operation failed");
        }

        // Adjust this according to your API's actual response structure
        const data = response?.d?.Result || [];

        const achievements = data.flatMap((item) => {
          const employeeName = item?.Employee?.Name || "team member";
          const employeeImg = item?.Employee?.Image?.URL || null;

          return (item?.Achievements || []).map((achievement) => ({
            employeeName,
            employeeImg,

            achivementDate: formatSharePointDate(achievement?.Date) || null,
            achivementTitle: achievement?.Title || "",
            achivementDes: extractText(achievement?.Description) || "",

            achivementAttachments:
              achievement?.Attachments?.map((attachment) => ({
                name: attachment?.Name || "",
                url: attachment?.URL || "",
              })) || [],
          }));
        });

        return achievements;
      },
      providesTags: ["Achievers"],
    }),
    getDepartmentsWithAchievements: builder.query({
      query: ({ year }) => ({
        url: `${import.meta.env.VITE_BASE_URL}${
          ENDPOINTS.hr.getDepartmentsAchiements
        }`,
        method: "POST",
        headers: API_HEADERS.DEFAULT,
        body: {
          year,
        },
      }),
      transformResponse: (response) => {
        // Transform response to handle success/failure
        const isSuccess = response?.d?.IsSuccess == true;
        if (!isSuccess) {
          // If not successful, throw an error to trigger the rejected state
          throw new Error(response?.d?.Message || "Operation failed");
        }

        // Adjust this according to your API's actual response structure
        const data = response?.d?.Result || [];
        return data.map((item) => ({
          departmentName: item?.DepartmentName || "Department Name",
          achievementCount: item?.AchievementCount || 0,
          icon: {
            name: item?.Attachment?.Name || "",
            imgUrl: item?.Attachment?.URL || "",
          },
          departmentId: item?.Id,
        }));
      },
    }),
    getDepartments: builder.query({
      query: () => ({
        url: `${import.meta.env.VITE_BASE_URL}${BASEURLS.forSharePointAPIs}${
          ENDPOINTS.hr.get_departments
        }`,
        method: "GET",
        headers: API_HEADERS.DEFAULT,
      }),
      transformResponse: (response) => {
        // Transform the SharePoint response to a more usable format
        if (response && response.d && response.d.results) {
          return response.d.results.reduce((validDepartmentss, department) => {
            const title = department?.Title;
            const id = department?.Id;

            // Only add to results if both id and title are valid
            if (id && title && title.trim() !== "") {
              validDepartmentss.push({ Id: id, Title: title });
            }

            return validDepartmentss;
          }, []);
        }
        return [];
      },
    }),
    getMyCompanyEmployees: builder.query({
      query: ({ departmentId, year, quarter }) => ({
        url: `${import.meta.env.VITE_BASE_URL}${
          ENDPOINTS.hr.get_myCompanyEmployees
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
        // Transform response to handle success/failure
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
          approveRequests: item?.Objectives || 0,
          achievedObjectives: item?.Achieved || 0,
          notAchievedObjectives: item?.NotAchieved || 0,
          underReviewObjectives: item?.UnderReview || 0,
          completionRate: item?.CompletionRate || 0,
        }));
      },
    }),
  }),
});

export const {
  useGetDepartmentsQuery,
  useGetMyCompanyEmployeesQuery,
  useGetDepartmentsWithAchievementsQuery,
  useGetAllAchieversByDepartmentQuery,
} = hrSoApiSlice;
