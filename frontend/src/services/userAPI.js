import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const userAPI = createApi({
  reducerPath: "user",
  baseQuery: fetchBaseQuery({
    baseUrl: "http://localhost:6142/api/users",
    credentials: "include",
  }),
  tagTypes: ["User"],
  endpoints: (builder) => ({
    myProfile: builder.query({
      query: () => ({
        url: "/myprofile",
        method: "GET",
      }),
      providesTags: ["User"],
    }),
    updateProfile: builder.mutation({
      query: (userNewData) => ({
        url: "/update",
        method: "PATCH",
        body: userNewData,
      }),
      invalidatesTags: ["User"],
    }),
    logout: builder.query({
      query: () => ({
        url: "/logout",
        method: "POST",
      }),
      providesTags: ["User"],
    }),
    updateProfilePic: builder.mutation({
      query: (newProfilePic) => ({
        url: "/update-profile-pic",
        method: "PATCH",
        body: newProfilePic,
      }),
      invalidatesTags: ["User"],
    }),
  }),
});

export const {
  useLazyLogoutQuery,
  useMyProfileQuery,
  useUpdateProfileMutation,
  useUpdateProfilePicMutation,
} = userAPI;
