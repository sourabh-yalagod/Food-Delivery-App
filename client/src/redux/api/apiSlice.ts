import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
console.log(import.meta.env.BACKEND_URL);

export const apiSlice = createApi({
    reducerPath: "api",
    baseQuery: fetchBaseQuery({
        baseUrl: import.meta.env.VITE_BACKEND_URL + "/api",
        prepareHeaders: (headers) => {
            const token = localStorage.getItem("token");
            if (token) {
                headers.set("authorization", `Bearer ${token}`);
            }
            return headers;
        },
    }),
    tagTypes: ["User", "Post"],
    endpoints: () => ({}),
});
