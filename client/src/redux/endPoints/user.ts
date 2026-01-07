import { apiSlice } from "../api/apiSlice";

const userEndpoints = apiSlice.injectEndpoints({
    endpoints: builder => ({
        loginUser: builder.mutation({
            query: (data) => ({
                url: "/users/login",
                method: "POST",
                body: data,
                providesTags: ["User"],
            }),
        }),
        registerUser: builder.mutation({
            query: (data) => ({
                url: "/users/register",
                method: "POST",
                body: data,
            }),
        })
    })
})
export const { useLoginUserMutation, useRegisterUserMutation } = userEndpoints;