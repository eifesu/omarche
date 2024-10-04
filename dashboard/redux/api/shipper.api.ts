import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"

import { siteConfig } from "@/config/site"

export type Shipper = {
  shipperId: string
  marketId: string
  email: string
  firstName: string
  lastName: string
  phone: string
  password: string
  pictureUrl?: string
  createdAt: string
  updatedAt: string
}

export const shippersApi = createApi({
  reducerPath: "shippersApi",
  baseQuery: fetchBaseQuery({ baseUrl: `${siteConfig.apiUrl}/shippers` }),
  tagTypes: ["Shipper"],
  endpoints: (builder) => ({
    fetchShipperById: builder.query<Shipper, string>({
      query: (shipperId) => `/${shipperId}`,
      providesTags: (result, error, shipperId) => [
        { type: "Shipper", id: shipperId },
      ],
    }),
    updateShipper: builder.mutation<
      Shipper,
      Partial<Shipper> & { shipperId: string }
    >({
      query: ({ shipperId, ...patch }) => ({
        url: `/${shipperId}`,
        method: "PUT",
        body: patch,
      }),
      invalidatesTags: (result, error, { shipperId }) => [
        { type: "Shipper", id: shipperId },
      ],
    }),
  }),
})

export const { useFetchShipperByIdQuery, useUpdateShipperMutation } =
  shippersApi
