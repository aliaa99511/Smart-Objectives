import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { API_HEADERS, BASEURLS, ENDPOINTS } from "../../settings/constants";

export const hrSoApiSlice = createApi({
  reducerPath: "hrSo",
  baseQuery: fetchBaseQuery({
    baseUrl: "",
  }),
  endpoints: (builder) => ({
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
          approveRequests: item?.NumberOfApproveRequestForEmployee || 0,
        }));
      },
    }),
  }),
});

export const {
  useGetDepartmentsQuery,
  useGetMyCompanyEmployeesQuery, // Add new export
} = hrSoApiSlice;
