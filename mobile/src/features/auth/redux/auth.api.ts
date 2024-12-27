import { ENV } from "@/config/constants";
import { createApi } from "@reduxjs/toolkit/query/react";
import { logIn } from "./auth.slice";
import { User } from "./user.api";
import { Agent } from "./agent.api";
import { Shipper } from "./shipper.api";
import { baseQuery } from "./baseApi";

type LoginPayload = {
	phone: string;
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
	baseQuery,
	endpoints: (builder) => ({
		loginClient: builder.mutation<
			LoginResponse,
			Omit<LoginPayload, "role">
		>({
			query: (body) => ({
				url: "/auth/user/login",
				method: "POST",
				body,
			}),
			onQueryStarted: async (_, { dispatch, queryFulfilled }) => {
				const result = await queryFulfilled;
				const { token, data } = result.data;
				dispatch(logIn({ token, user: data }));
			},
		}),
		loginAgent: builder.mutation<LoginResponse, Omit<LoginPayload, "role">>({
			query: (body) => ({
				url: "/auth/agent/login",
				method: "POST",
				body,
			}),
			onQueryStarted: async (_, { dispatch, queryFulfilled }) => {
				const result = await queryFulfilled;
				const { token, data } = result.data;
				dispatch(logIn({ token, user: data }));
			},
		}),
		loginShipper: builder.mutation<
			LoginResponse,
			Omit<LoginPayload, "role">
		>({
			query: (body) => ({
				url: "/auth/shipper/login",
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
				url: "/auth/user/register",
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
