import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"

import { siteConfig } from "@/config/site"

import { Agent } from "./agent.api"
import { Market } from "./markets.api"
import { Shipper } from "./shipper.api"
import { User } from "./user.api"

export type Order = {
  orderId: string
  userId: string
  agentId?: string
  shipperId?: string
  locationX: number
  locationY: number
  address: string
  deliveryTime: string
  paymentMethod: string
  status: OrderStatusType
  promoCode?: string
  cancellationReason?: string
  totalAmount: number
  createdAt: string
}

export type OrderDetails = {
  order: Order
  orderProducts: {
    product: {
      productId: string
      name: string
      price: number
    }
    quantity: number
    sellerName: string
    sellerTableNo: number
  }[]
  marketName: string
  client: User
  market: Market
  shipper: Shipper | null
  agent: Agent | null
}

export type OrderStatusType =
  | "IDLE"
  | "PROCESSING"
  | "PROCESSED"
  | "COLLECTING"
  | "DELIVERING"
  | "DELIVERED"
  | "CANCELED"

export const ordersApi = createApi({
  reducerPath: "ordersApi",
  baseQuery: fetchBaseQuery({ baseUrl: `${siteConfig.apiUrl}/orders` }),
  endpoints: (builder) => ({
    fetchOrders: builder.query<OrderDetails[], void>({
      query: () => "/",
    }),
    fetchOrderById: builder.query<OrderDetails, string>({
      query: (orderId) => `/${orderId}`,
    }),
    updateOrderStatus: builder.mutation<
      OrderDetails,
      { orderId: string; status: OrderStatusType; cancellationReason?: string }
    >({
      query: ({ orderId, status, cancellationReason }) => ({
        url: `/${orderId}/status`,
        method: "PUT",
        body: { status, cancellationReason },
      }),
    }),
  }),
})

export const {
  useFetchOrdersQuery,
  useFetchOrderByIdQuery,
  useUpdateOrderStatusMutation,
} = ordersApi
