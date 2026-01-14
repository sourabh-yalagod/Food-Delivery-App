import { apiSlice } from "../api/apiSlice";

const paymentEndpoints = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        createIntent: builder.mutation<any, string>({
            query: (payload) => ({
                url: `/payments/create-order`,
                method: "POST",
                body: payload
            }),
            providesTags: "Payments" as any
        }),

        verifyPayment: builder.mutation<any, any>({
            query: (payload) => ({
                url: "/payments/verify",
                method: "POST",
                body: payload,
            }),
            invalidatesTags: ['Payments']
        }),
    }),
});

export const { useVerifyPaymentMutation, useCreateIntentMutation } = paymentEndpoints;
