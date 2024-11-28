import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { API_URL } from "../../config";
import { Order } from "./order";
import { Market } from "./market";

export interface Agent {
	agentId: string;
	firstName: string;
	lastName: string;
	email: string;
	phone: string;
	marketId: string;
	pictureUrl?: string;
	market: Market;
	createdAt: Date;
	updatedAt: Date;
	orders?: Order[];
}

export interface CreateAgentDTO {
	firstName: string;
	lastName: string;
	email: string;
	password: string;
	phone: string;
	marketId: string;
}

export interface UpdateAgentDTO {
	firstName?: string;
	lastName?: string;
	email?: string;
	password?: string;
	phone?: string;
	market?: {
		connect: {
			marketId: string;
		};
	};
	pictureUrl?: string;
}

export const agentApi = createApi({
	reducerPath: "agentApi",
	baseQuery: fetchBaseQuery({
		baseUrl: `${API_URL}/`,
	}),
	tagTypes: ["Agent"],
	endpoints: (builder) => ({
		getAllAgents: builder.query<Agent[], void>({
			query: () => "agents/",
			providesTags: ["Agent"],
		}),

		getAgentById: builder.query<Agent, string>({
			query: (agentId) => `agents/${agentId}`,
			providesTags: ["Agent"],
		}),

		getAgentOrders: builder.query<Order[], string>({
			query: (agentId) => `agents/${agentId}/orders`,
			providesTags: ["Agent"],
		}),

		createAgent: builder.mutation<Agent, CreateAgentDTO>({
			query: (newAgent) => ({
				url: "agents/",
				method: "POST",
				body: newAgent,
			}),
			invalidatesTags: ["Agent"],
		}),

		updateAgent: builder.mutation<
			Agent,
			{ agentId: string; updateData: UpdateAgentDTO }
		>({
			query: ({ agentId, updateData }) => ({
				url: `agents/${agentId}`,
				method: "PUT",
				body: updateData,
			}),
			invalidatesTags: ["Agent"],
		}),

		deleteAgent: builder.mutation<{ message: string }, string>({
			query: (agentId) => ({
				url: `agents/${agentId}`,
				method: "DELETE",
			}),
			invalidatesTags: ["Agent"],
		}),
	}),
});

export const {
	useGetAllAgentsQuery,
	useGetAgentByIdQuery,
	useGetAgentOrdersQuery,
	useCreateAgentMutation,
	useUpdateAgentMutation,
	useDeleteAgentMutation,
} = agentApi;
