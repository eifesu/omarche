import { ENV } from "@/config/constants";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { logIn } from "./auth.slice";
import { User } from "./user.api";
import { Agent } from "./agent.api";
import { Shipper } from "./shipper.api";

type LoginPayload = {
	email: string;
	role: "Client" | "Agent" | "Shipper";
	password: string;
};

type LoginResponse = {
	token: string;
	data: User | Agent | Shipper;
};

type RegisterPayload = {
	email: string;
	password: string;
	firstName: string;
	lastName: string;
	address: string;
	phone: string;
	birthDay: string;
};

export const authApi = createApi({
	reducerPath: "authApi",
	baseQuery: fetchBaseQuery({ baseUrl: `${ENV.API_URL}/auth` }),
	endpoints: (builder) => ({
		loginClient: builder.mutation<
			LoginResponse,
			Omit<LoginPayload, "role">
		>({
			query: (body) => ({
				url: "/user/login",
				method: "POST",
				body,
			}),
			onQueryStarted: async (_, { dispatch, queryFulfilled }) => {
				const result = await queryFulfilled;
				const { token, data } = result.data;
				dispatch(logIn({ token, user: data }));
			},
		}),
		loginAgent: builder.mutation<LoginResponse, Omit<LoginPayload, "role">>(
			{
				query: (body) => ({
					url: "/agent/login",
					method: "POST",
					body,
				}),
				onQueryStarted: async (_, { dispatch, queryFulfilled }) => {
					const result = await queryFulfilled;
					const { token, data } = result.data;
					dispatch(logIn({ token, user: data }));
				},
			}
		),
		loginShipper: builder.mutation<
			LoginResponse,
			Omit<LoginPayload, "role">
		>({
			query: (body) => ({
				url: "/shipper/login",
				method: "POST",
				body,
			}),
			onQueryStarted: async (_, { dispatch, queryFulfilled }) => {
				const result = await queryFulfilled;
				const { token, data } = result.data;
				dispatch(logIn({ token, user: data }));
			},
		}),
		register: builder.mutation<void, RegisterPayload>({
			query: (body) => ({
				url: "/register",
				method: "POST",
				body,
			}),
		}),
	}),
});

export const {
	useLoginClientMutation,
	useLoginAgentMutation,
	useLoginShipperMutation,
	useRegisterMutation,
} = authApi;

export default authApi;
