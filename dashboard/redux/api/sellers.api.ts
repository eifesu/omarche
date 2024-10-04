import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"

import { siteConfig } from "@/config/site"

export type Seller = {
  sellerId: string
  firstName: string
  lastName: string
  gender: string
  tableNumber: number
  isActive: boolean
  pictureUrl?: string
}

export type Product = {
  productId: string
  name: string
  price: number
  amount: number
  unit: string
  isInStock: boolean
  sellerId: string
}

export const sellersApi = createApi({
  reducerPath: "sellersApi",
  baseQuery: fetchBaseQuery({ baseUrl: `${siteConfig.apiUrl}/sellers` }),
  tagTypes: ["Seller", "Product"],
  endpoints: (builder) => ({
    fetchSellerById: builder.query<Seller, string>({
      query: (sellerId) => `/${sellerId}`,
      providesTags: (result, error, sellerId) => [
        { type: "Seller", id: sellerId },
      ],
    }),
    fetchProductsBySellerId: builder.query<Product[], string>({
      query: (sellerId) => `/${sellerId}/products`,
      providesTags: (result, error, sellerId) => [
        { type: "Product", id: sellerId },
      ],
    }),
    updateSellerById: builder.mutation<
      Seller,
      Partial<Seller> & { sellerId: string }
    >({
      query: ({ sellerId, ...patch }) => ({
        url: `/${sellerId}`,
        method: "PUT",
        body: patch,
      }),
      invalidatesTags: (result, error, { sellerId }) => [
        { type: "Seller", id: sellerId },
      ],
    }),
  }),
})

export const {
  useFetchSellerByIdQuery,
  useFetchProductsBySellerIdQuery,
  useUpdateSellerByIdMutation,
} = sellersApi
