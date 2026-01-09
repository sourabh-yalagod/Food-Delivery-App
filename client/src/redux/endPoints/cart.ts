import { apiSlice } from "../api/apiSlice";

const cartEndpoints = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getCarts: builder.query<any, void>({
            query: (userId) => ({
                url: "/carts/" + userId,
                method: "GET",
            }),
            providesTags: ["carts" as any],
        }),
        addToCart: builder.mutation<any, void>({
            query: (payload) => ({
                url: "/carts",
                method: "POST",
                body: payload,
            }),
            invalidatesTags: ['carts' as any]
        }),
        removeFromCart: builder.mutation<any, void>({
            query: (menuId) => ({
                url: "/carts/" + menuId,
                method: "DELETE",
                invalidatesTags: ['carts' as any]
            }),
        }),
    }),
});

export const { useGetCartsQuery, useAddToCartMutation, useRemoveFromCartMutation } = cartEndpoints;
