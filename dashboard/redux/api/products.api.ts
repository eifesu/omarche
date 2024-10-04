import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"

import { siteConfig } from "@/config/site"

export type Product = {
  productId: string
  name: string
  price: number
  amount: number
  unit: string
  isInStock: boolean
  sellerId: string
}

export const productsApi = createApi({
  reducerPath: "productsApi",
  baseQuery: fetchBaseQuery({ baseUrl: `${siteConfig.apiUrl}/products` }),
  tagTypes: ["Product"],
  endpoints: (builder) => ({
    createProduct: builder.mutation<Product, Omit<Product, "productId">>({
      query: (newProduct) => ({
        url: "/",
        method: "POST",
        body: newProduct,
      }),
      invalidatesTags: (result, error, { sellerId }) => [
        { type: "Product", id: sellerId },
      ],
    }),
    updateProductById: builder.mutation<
      Product,
      Partial<Product> & { productId: string }
    >({
      query: ({ productId, ...patch }) => ({
        url: `/${productId}`,
        method: "PUT",
        body: patch,
      }),
      invalidatesTags: (result, error, { productId }) => [
        { type: "Product", id: productId },
      ],
    }),
  }),
})

export const { useCreateProductMutation, useUpdateProductByIdMutation } =
  productsApi
