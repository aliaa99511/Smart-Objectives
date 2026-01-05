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
          // If not successful, throw an error to trigger the rejected state
          throw new Error(response?.d?.Message || "Operation failed");
        }

        const data = response?.d?.Result?.[0];
        const roles = data?.UserType
          ? data.UserType.split("&").map((role) => role.trim())
          : [];
        const isEmployee = roles[0] == "Employee";
        const isManagerAndNotCommercialManager =
          roles[0] == "Manger" &&
          !data?.IsDepartmentManager &&
          data?.JobTitle != "Commercial Manager";
        const IsHR = roles[0] == "HR";
        const isDepartmentManagerAndNotCommercialManager =
          data?.IsDepartmentManager && data?.JobTitle != "Commercial Manager";
        const isCommercialManager = data?.JobTitle == "Commercial Manager";
        return {
          userId: data?.Id,
          name: data?.Name,
          jobTitle: data?.JobTitle,
          appRatingNumber: data?.AppRatingNumber,
          departmentId: data?.DepartmentId,
          roles: isEmployee
            ? ["Employee"]
            : isManagerAndNotCommercialManager || IsHR
            ? ["Employee", ...roles]
            : isDepartmentManagerAndNotCommercialManager
            ? ["Employee", "Manger", ...roles]
            : isCommercialManager
            ? ["Employee", "HR"]
            : /* : isDepartmentManagerAndNotCommercialManager
            ? ["DepartmentManager"] */
              [],

          managerId: data?.DirectManagerId,
          img: data?.Image?.URL,
          numberOfPendingRequestForManager:
            data?.NumberOfPendingRequestForManager || 0,
        };
      },
      providesTags: ["User"],
    }),
  }),
});

export const { useFetchCurrentUserQuery } = userApiSlice;
