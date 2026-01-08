import { apiSlice } from "../api/apiSlice";

const restaurantsEndpoints = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getRestaurants: builder.query<any, void>({
            query: () => ({
                url: "/restaurants",
                method: "GET",
            }),
            providesTags: ["menus" as any],
        }),
    }),
});

export const { useGetRestaurantsQuery } = restaurantsEndpoints;
