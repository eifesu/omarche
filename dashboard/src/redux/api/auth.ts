import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

// DTOs
interface LoginDTO {
  email: string;
  password: string;
}

interface AdminLoginDTO extends LoginDTO {}

// Response Types
interface Admin {
  adminId: string;
  marketId?: string;
  email: string;
}

interface AuthResponse {
  data: Admin;
  token: string;
}

export const authApi = createApi({
  reducerPath: 'authApi',
  baseQuery: fetchBaseQuery({ 
    baseUrl: import.meta.env.VITE_API_URL,
    prepareHeaders: (headers) => {
      const token = localStorage.getItem('token');
      if (token) {
        headers.set('authorization', `Bearer ${token}`);
      }
      return headers;
    },
  }),
  endpoints: (builder) => ({
    login: builder.mutation<AuthResponse, AdminLoginDTO>({
      query: (credentials) => ({
        url: '/auth/admin/login',
        method: 'POST',
        body: credentials,
      }),
    }),
    logout: builder.mutation<void, void>({
      query: () => ({
        url: '/auth/admin/logout',
        method: 'POST',
      }),
    }),
  }),
});

export const { 
  useLoginMutation,
  useLogoutMutation
} = authApi;
