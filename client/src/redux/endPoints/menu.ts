import { apiSlice } from "../api/apiSlice";

const menuEndpoints = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getMenus: builder.query<any, void>({
            query: () => ({
                url: "/menus",
                method: "GET",
            }),
            providesTags: ["menus" as any],
        }),
    }),
});

export const { useGetMenusQuery } = menuEndpoints;
