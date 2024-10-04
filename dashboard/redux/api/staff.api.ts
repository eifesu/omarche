import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"

import { siteConfig } from "@/config/site"

// Define types for Agent and Shipper
export interface Agent {
  agentId: string
  firstName: string
  lastName: string
  marketId: string
  email: string
  password: string
  phone: string
  pictureUrl?: string
  isOnline?: boolean
}

export interface Shipper {
  shipperId: string
  firstName: string
  lastName: string
  email: string
  password: string
  phone: string
  pictureUrl?: string
  isOnline?: boolean
  marketId: string
}

export const staffApi = createApi({
  reducerPath: "staffApi",
  baseQuery: fetchBaseQuery({ baseUrl: `${siteConfig.apiUrl}` }),
  tagTypes: ["Agents", "Shippers"],
  endpoints: (builder) => ({
    // Agent endpoints
    fetchAgents: builder.query<Agent[], void>({
      query: () => "/agents/",
      providesTags: ["Agents"],
    }),
    fetchAgentById: builder.query<Agent, string>({
      query: (agentId) => `/agents/${agentId}`,
      providesTags: (result, error, agentId) => [
        { type: "Agents", id: agentId },
      ],
    }),
    createAgent: builder.mutation<Agent, Omit<Agent, "agentId">>({
      query: (newAgent) => ({
        url: "/agents/",
        method: "POST",
        body: newAgent,
      }),
      invalidatesTags: ["Agents"],
    }),
    updateAgent: builder.mutation<Agent, Partial<Agent> & { agentId: string }>({
      query: ({ agentId, ...patch }) => ({
        url: `/agents/${agentId}`,
        method: "PUT",
        body: patch,
      }),
      invalidatesTags: (result, error, { agentId }) => [
        { type: "Agents", id: agentId },
        "Agents",
      ],
    }),
    deleteAgent: builder.mutation<void, string>({
      query: (agentId) => ({
        url: `/agents/${agentId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Agents"],
    }),

    // Shipper endpoints
    fetchShippers: builder.query<Shipper[], void>({
      query: () => "/shippers/",
      providesTags: ["Shippers"],
    }),
    fetchShipperById: builder.query<Shipper, string>({
      query: (shipperId) => `/shippers/${shipperId}`,
      providesTags: (result, error, shipperId) => [
        { type: "Shippers", id: shipperId },
      ],
    }),
    createShipper: builder.mutation<Shipper, Omit<Shipper, "shipperId">>({
      query: (newShipper) => ({
        url: "/shippers/",
        method: "POST",
        body: newShipper,
      }),
      invalidatesTags: ["Shippers"],
    }),
    updateShipper: builder.mutation<
      Shipper,
      Partial<Shipper> & { shipperId: string }
    >({
      query: ({ shipperId, ...patch }) => ({
        url: `/shippers/${shipperId}`,
        method: "PUT",
        body: patch,
      }),
      invalidatesTags: (result, error, { shipperId }) => [
        { type: "Shippers", id: shipperId },
        "Shippers",
      ],
    }),
    deleteShipper: builder.mutation<void, string>({
      query: (shipperId) => ({
        url: `/shippers/${shipperId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Shippers"],
    }),
  }),
})

export const {
  useFetchAgentsQuery,
  useFetchAgentByIdQuery,
  useCreateAgentMutation,
  useUpdateAgentMutation,
  useDeleteAgentMutation,
  useFetchShippersQuery,
  useFetchShipperByIdQuery,
  useCreateShipperMutation,
  useUpdateShipperMutation,
  useDeleteShipperMutation,
} = staffApi
