import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const taskAPI = createApi({
  reducerPath: "taskAPI",
  baseQuery: fetchBaseQuery({
    baseUrl: "http://localhost:6142/api/tasks",
    credentials: "include",
  }),
  tagTypes: ["Assignments"],
  endpoints: (builder) => ({
    createAssignment: builder.mutation({
      query: (assignmentDetails) => ({
        url: "/create",
        method: "POST",
        body: assignmentDetails,
      }),
      invalidatesTags: ["Assignments"],
    }),
    updateAssignmentStatus: builder.mutation({
      query: ({ id,status,submissionLink}) => ({
        url: `/update-status/${id}`,
        method: "PATCH",
        body: {status,submissionLink},
      }),
      invalidatesTags: ["Assignments"],
    }),
    updateAssignmentGrade: builder.mutation({
      query: ({grade,feedback,status,studentId, id}) => ({
        url: `/grade/${id}`,
        method: "PATCH",
        body: {grade,feedback,status,studentId},
      }),
      invalidatesTags: ["Assignments"],
    }),
    getStudentAssignment: builder.query({
      query: () => ({
        url: "student-task",
        method: "GET",
      }),
      providesTags: ["Assignments"],
    }),
    getTeacherAssignment: builder.query({
      query: () => ({
        url: "/teacher-task",
        method: "GET",
      }),
      providesTags: ["Assignments"],
    }),
    getClassWiseAssignments: builder.query({
      query: (id) => ({
        url: `/class/${id}`,
        method: "GET",
      }),
      providesTags: ["Assignments"],
    }),
    getAssignmentStats: builder.query({
      query: (id) => ({
        url: `/stats/${id}`,
        method: "GET",
      }),
      providesTags: ["Assignments"],
    }),
    getAssignmentsByField:builder.query({
      query:(data)=>({
        url:`/allassignments`,
        method:"POST",
        body:data,
      }),
      providesTags:["Assignments"]
    })
  }),
});

export const {
  useCreateAssignmentMutation,
  useGetAssignmentStatsQuery,
  useGetClassWiseAssignmentsQuery,
  useGetStudentAssignmentQuery,
  useGetTeacherAssignmentQuery,
  useGetAssignmentsByFieldQuery,
  useLazyGetTeacherAssignmentQuery,
  useLazyGetStudentAssignmentQuery,
  useUpdateAssignmentGradeMutation,
  useUpdateAssignmentStatusMutation,
} = taskAPI;
