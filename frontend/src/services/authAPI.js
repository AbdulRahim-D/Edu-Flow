import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { API } from "../../API";

export const authAPI = createApi({
    reducerPath: "authAPI",
    baseQuery: fetchBaseQuery({
         baseUrl: `${API}/auth`,
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