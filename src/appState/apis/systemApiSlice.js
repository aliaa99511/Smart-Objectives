import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { API_HEADERS, BASEURLS, ENDPOINTS } from "../../settings/constants";

export const systemApiSlice = createApi({
  reducerPath: "system",
  baseQuery: fetchBaseQuery({
    baseUrl: "",
  }),
  tagTypes: ["Feedback"],
  endpoints: (builder) => ({
    sendFeedback: builder.mutation({
      query: (feedbackData) => ({
        url: `${import.meta.env.VITE_BASE_URL}${ENDPOINTS.system.sendFeedback}`,
        method: "POST",
        headers: API_HEADERS.DEFAULT,
        body: {
          appRating: {
            RatingNumber: feedbackData.rating,
            Comment: feedbackData.comment || "",
          },
        },
      }),
      transformResponse: (response) => {
        // Transform response to handle success/failure
        const isSuccess = response?.d?.IsSuccess == true;
        if (!isSuccess) {
          // If not successful, throw an error to trigger the rejected state
          throw new Error(response?.d?.Message || "Operation failed");
        }

        return {
          success: response?.d?.IsSuccess === true,
          message: response?.d?.Message,
        };
      },

      /* invalidatesTags: (result, error, arg) => {
        // Only invalidate tags if the request was successful
        if (result && result?.success) {
          return ["Feedback"];
        }
        // Return empty array if creation failed (won't invalidate any tags)
        return [];
      }, */
    }),

    getCategories: builder.query({
      query: () => ({
        url: `${import.meta.env.VITE_BASE_URL}${BASEURLS.forSharePointAPIs}${
          ENDPOINTS.system.categories
        }`,
        method: "GET",
        headers: API_HEADERS.DEFAULT,
      }),
      transformResponse: (response) => {
        // Transform SharePoint list response
        const categories = response?.d?.results || [];
        return categories.map((category) => ({
          Id: category.Id,
          Title: category.Title,
          CategoryType: category.CategoryType,
        }));
      },
    }),
  }),
});

// Export the auto-generated hooks
export const { useSendFeedbackMutation, useGetCategoriesQuery } =
  systemApiSlice;
