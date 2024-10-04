import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"

import { siteConfig } from "@/config/site"

export type User = {
  userId: string
  email: string
  firstName: string
  lastName: string
  phone: string
  pictureUrl?: string
  createdAt: string
  updatedAt: string
}

export const userApi = createApi({
  reducerPath: "userApi",
  baseQuery: fetchBaseQuery({ baseUrl: `${siteConfig.apiUrl}/users` }),
  endpoints: (builder) => ({
    fetchUserById: builder.query<User, string>({
      query: (userId) => `/${userId}`,
    }),
    updateUser: builder.mutation<User, Partial<User> & { userId: string }>({
      query: ({ userId, ...patch }) => ({
        url: `/${userId}`,
        method: "PUT",
        body: patch,
      }),
    }),
  }),
})

export const { useFetchUserByIdQuery, useUpdateUserMutation } = userApi
