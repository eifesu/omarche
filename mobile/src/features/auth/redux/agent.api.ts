import { ENV } from "@/config/constants";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export interface Agent {
	agentId: string;
	marketId: string;
	email: string;
	password: string;
	firstName: string;
	lastName: string;
	phone: string;
	role: string;
	createdAt: string;
	updatedAt: string;
}

export const agentsApi = createApi({
	reducerPath: "agentsApi",
	baseQuery: fetchBaseQuery({ baseUrl: `${ENV.API_URL}/agents` }),
	endpoints: (builder) => ({
		fetchAgentById: builder.query<Agent, string>({
			query: (agentId) => ({
				url: `/${agentId}`,
				method: "GET",
			}),
		}),
	}),
});

export const { useFetchAgentByIdQuery } = agentsApi;

export default agentsApi;
