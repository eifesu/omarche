import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"

import { siteConfig } from "@/config/site"

export type Market = {
  marketId: string
  name: string
  latitude: number
  longitude: number
  isActive: boolean
  pictureUrl: string | undefined
}

// Add these types
export type Order = {
  orderId: string
  status: string
  totalAmount: number
  createdAt: string
}

export type Seller = {
  sellerId: string
  firstName: string
  lastName: string
  tableNumber: number
  isActive: boolean
}

export const marketsApi = createApi({
  reducerPath: "marketsApi",
  baseQuery: fetchBaseQuery({ baseUrl: siteConfig.apiUrl }),
  tagTypes: ["Market", "Order", "Seller"],
  endpoints: (builder) => ({
    fetchMarkets: builder.query<Market[], void>({
      query: () => "/markets/",
      providesTags: ["Market"],
    }),
    fetchMarketById: builder.query<Market, string>({
      query: (marketId) => `/markets/${marketId}`,
      providesTags: (_result, _error, marketId) => [
        { type: "Market", id: marketId },
      ],
    }),
    updateMarket: builder.mutation<
      Market,
      Partial<Market> & Pick<Market, "marketId">
    >({
      query: ({ marketId, ...patch }) => ({
        url: `/markets/${marketId}`,
        method: "PUT",
        body: patch,
      }),
      invalidatesTags: (_result, _error, { marketId }) => [
        { type: "Market", id: marketId },
        "Market",
      ],
    }),
    createMarket: builder.mutation<
      Market,
      Omit<
        Market,
        "marketId" | "isActive" | "pictureUrl" | "createdAt" | "updatedAt"
      >
    >({
      query: (newMarket) => ({
        url: "/markets/",
        method: "POST",
        body: newMarket,
      }),
      invalidatesTags: ["Market"],
    }),
    // Add these new queries
    fetchOrdersByMarketId: builder.query<Order[], string>({
      query: (marketId) => `/markets/${marketId}/orders`,
      providesTags: (_result, _error, marketId) => [
        { type: "Order", id: marketId },
      ],
    }),
    fetchSellersByMarketId: builder.query<Seller[], string>({
      query: (marketId) => `/markets/${marketId}/sellers`,
      providesTags: (_result, _error, marketId) => [
        { type: "Seller", id: marketId },
      ],
    }),
  }),
})

export const {
  useFetchMarketsQuery,
  useFetchMarketByIdQuery,
  useUpdateMarketMutation,
  useCreateMarketMutation,
  useFetchOrdersByMarketIdQuery,
  useFetchSellersByMarketIdQuery,
} = marketsApi
