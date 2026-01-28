import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { API_HEADERS, ENDPOINTS } from "../../settings/constants";

export const userApiSlice = createApi({
  reducerPath: "userApi",
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_BASE_URL,
  }),
  tagTypes: ["User"],
  endpoints: (builder) => ({
    fetchCurrentUser: builder.query({
      query: () => ({
        url: ENDPOINTS.user.get_current_user,
        method: "POST",
        headers: API_HEADERS.DEFAULT,
        body: { id: 0 },
      }),
      transformResponse: (response) => {
        const isSuccess = response?.d?.IsSuccess == true;
        if (!isSuccess) {
          throw new Error(response?.d?.Message || "Operation failed");
        }

        const data = response?.d?.Result?.[0];
        let roles = data?.UserType
          ? data.UserType.split("&").map((role) => role.trim())
          : [];

        // FIX: Normalize "Manger" to "Manager" to fix the typo
        roles = roles.map(role => role === "Manger" ? "Manager" : role);

        const isEmployee = roles[0] == "Employee";
        const isManagerAndNotCommercialManager = roles[0] == "Manager" && !data?.IsDepartmentManager && data?.JobTitle != "Commercial Manager";
        const IsHR = roles[0] == "HR";
        const isDepartmentManagerAndNotCommercialManager = data?.IsDepartmentManager && data?.JobTitle != "Commercial Manager";
        const isCommercialManager = data?.JobTitle == "Commercial Manager";

        // Updated CEO logic
        const isCEO = isCommercialManager;

        // Build the roles array
        let userRoles = [];

        // FIX: Handle CEO first, then other roles
        if (isCEO) {
          userRoles = ["CEO"];
          // CEO might also have other roles, add them if they exist
          if (roles.length > 0 && roles[0] !== "CEO") {
            userRoles = ["CEO", ...roles];
          }
        }
        else if (isEmployee) {
          userRoles = ["Employee"];
        }
        else if (isManagerAndNotCommercialManager || IsHR) {
          userRoles = ["Employee", ...roles];
        }
        else if (isDepartmentManagerAndNotCommercialManager) {
          userRoles = ["Employee", "Manager", ...roles];
        }
        // FIX: Add this else case to handle users without clear role assignment
        else if (roles.length > 0) {
          // If user has roles but doesn't fit any category, just use their roles
          userRoles = roles;
        }
        else {
          // No roles found - this might cause unauthorized
          userRoles = [];
        }

        return {
          userId: data?.Id,
          name: data?.Name,
          jobTitle: data?.JobTitle,
          appRatingNumber: data?.AppRatingNumber,
          departmentId: data?.DepartmentId,
          roles: userRoles,
          managerId: data?.DirectManagerId,
          img: data?.Image?.URL,
          numberOfPendingRequestForManager: data?.NumberOfPendingRequestForManager || 0,
        };
      },
      providesTags: ["User"],
    }),
  }),
});

export const { useFetchCurrentUserQuery } = userApiSlice;



