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
      query: ({assignmentGrade, id}) => ({
        url: `/grade/${id}`,
        method: "PATCH",
        body: assignmentGrade,
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
  }),
});

export const {
  useCreateAssignmentMutation,
  useGetAssignmentStatsQuery,
  useGetClassWiseAssignmentsQuery,
  useGetStudentAssignmentQuery,
  useGetTeacherAssignmentQuery,
  useLazyGetTeacherAssignmentQuery,
  useLazyGetStudentAssignmentQuery,
  useUpdateAssignmentGradeMutation,
  useUpdateAssignmentStatusMutation,
} = taskAPI;
