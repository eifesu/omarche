import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"

import { siteConfig } from "@/config/site"

export type Agent = {
  agentId: string
  marketId: string
  password: string
  email: string
  firstName: string
  lastName: string
  phone: string
  pictureUrl?: string
  createdAt: string
  updatedAt: string
}

export const agentApi = createApi({
  reducerPath: "agentApi",
  baseQuery: fetchBaseQuery({ baseUrl: `${siteConfig.apiUrl}/agents` }),
  endpoints: (builder) => ({
    fetchAgentById: builder.query<Agent, string>({
      query: (agentId) => `/${agentId}`,
    }),
    updateAgent: builder.mutation<Agent, Partial<Agent> & { agentId: string }>({
      query: ({ agentId, ...patch }) => ({
        url: `/${agentId}`,
        method: "PUT",
        body: patch,
      }),
    }),
  }),
})

export const { useFetchAgentByIdQuery, useUpdateAgentMutation } = agentApi
