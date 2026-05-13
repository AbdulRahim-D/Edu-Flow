import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const classAPI = createApi({
  reducerPath: "classAPI",
  baseQuery: fetchBaseQuery({
    baseUrl: "http://localhost:6142/api/class",
    credentials: "include",
  }),
  tagTypes: ["Class"],
  endpoints: (builder) => ({
    createClass: builder.mutation({
      query: (classData) => ({
        url: "/create",
        method: "POST",
        body: classData,
      }),
      invalidatesTags: ["Class"],
    }),
    joinClass: builder.mutation({
      query: (classCode) => ({
        url: "/join",
        method: "PATCH",
        body: classCode,
      }),
      invalidatesTags: ["Class"],
    }),
    getClass: builder.query({
      query: () => ({
        url: "/",
        method: "GET",
      }),
      providesTags: ["Class"],
    }),
    getClassById:builder.query({
      query:(id)=>({
        url:`/${id}`,
        method:"GET",
      }),
      providesTags:["Class"]
    }),
    deleteClassById:builder.mutation({
      query:(classId)=>({
        url:`/${classId}`,
        method:"DELETE",
      }),
      invalidatesTags:['Class']
    })
  }),
});


export const {
  useCreateClassMutation,
  useGetClassQuery,
  useGetClassByIdQuery,
  useJoinClassMutation,
  useLazyGetClassQuery,
  useDeleteClassByIdMutation
} = classAPI;
