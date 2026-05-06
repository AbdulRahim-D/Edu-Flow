import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const authAPI = createApi({
    reducerPath: "authAPI",
    baseQuery: fetchBaseQuery({
         baseUrl: "http://localhost:6142/api/auth",
        credentials:"include"
}),
    endpoints: (builder) => ({
        login: builder.mutation({
            query: (userCreds) => ({
                url: "/login",
                method: "POST",
                body: userCreds,
            })
        }),
        signup: builder.mutation({
            query: (userDetails) => ({
                url: "/signup",
                method: "POST",
                body: userDetails,
            })
        })
    })
})

export const { useLoginMutation, useSignupMutation } = authAPI