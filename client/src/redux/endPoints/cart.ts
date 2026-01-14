import { apiSlice } from "../api/apiSlice";

const cartEndpoints = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getCarts: builder.query<any, string>({
            query: (userId) => ({
                url: `/carts/${userId}`,
                method: "GET",
            }),
            providesTags: (result, error, userId) => [
                { type: "Carts", id: userId },
            ],
        }),

        addToCart: builder.mutation<any, { userId: string; payload: any }>({
            query: ({ payload }) => ({
                url: "/carts",
                method: "POST",
                body: payload,
            }),
            invalidatesTags: (result, error, { userId }) => [
                { type: "Carts", id: userId },
            ],
        }),

        removeFromCart: builder.mutation<any, { userId: string; menuId: string }>({
            query: (menuId) => ({
                url: `/carts/${menuId}`,
                method: "DELETE",
            }),
            invalidatesTags: (result, error, { userId }) => [
                { type: "Carts", id: userId },
            ],
        }),
    }),
});

export const {
    useGetCartsQuery,
    useAddToCartMutation,
    useRemoveFromCartMutation,
} = cartEndpoints;
