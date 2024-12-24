import { fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { RootState } from '@/redux/store';
import { ENV } from '@/config/constants';

export const baseQuery = fetchBaseQuery({
    baseUrl: ENV.API_URL,
    prepareHeaders: (headers, { getState }) => {
        const token = (getState() as RootState).auth.token;
        if (token) {
            headers.set('authorization', `Bearer ${token}`);
        }
        return headers;
    },
});
