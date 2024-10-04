import { ENV } from "@/config/constants";
import { OrderDetails } from "@/features/(client)/redux/ordersApi.slice";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export interface User {
	userId: string;
	email: string;
	password: string;
	firstName: string;
	lastName: string;
	city: string;
	address: string;
	phone: string;
	createdAt: string;
	updatedAt: string;
}

export const usersApi = createApi({
	reducerPath: "usersApi",
	baseQuery: fetchBaseQuery({ baseUrl: `${ENV.API_URL}/users` }),
	endpoints: (builder) => ({
		fetchUsers: builder.query<User[], void>({
			query: () => ({
				url: "/",
				method: "GET",
			}),
		}),
		fetchOrdersByUserId: builder.query<OrderDetails[], string>({
			query: (userId) => ({
				url: `/${userId}/orders`,
				method: "GET",
			}),
		}),
	}),
});

export const { useFetchUsersQuery, useFetchOrdersByUserIdQuery } = usersApi;

export default usersApi;