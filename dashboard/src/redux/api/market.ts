import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { Seller } from "./seller";
import { Order } from "./order";
import { Agent } from "./agent";
import { Shipper } from "./shipper";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

export interface Market {
	marketId: string;
	pictureUrl?: string;
	name: string;
	latitude: number;
	longitude: number;
	isActive?: boolean;
	createdAt?: Date;
	updatedAt: Date;
	sellers?: Seller[];
	agents?: Agent[];
	shippers?: Shipper[];
}

export interface CreateMarketDTO {
	name: string;
	latitude: number;
	longitude: number;
	pictureUrl?: string;
}

export interface UpdateMarketDTO {
	name?: string;
	latitude?: number;
	longitude?: number;
	isActive?: boolean;
	pictureUrl?: string;
}

export interface OrderDetails {
	orderId: string;
	userId: string;
	agentId?: string;
	shipperId?: string;
	locationX: number;
	locationY: number;
	address: string;
	deliveryTime: string;
	paymentMethod: string;
	status: string;
	promoCode?: string;
	cancellationReason?: string;
	products: Array<{
		productId: string;
		name: string;
		quantity: number;
		price: number;
		unit: string;
	}>;
}

export const marketApi = createApi({
	reducerPath: "marketApi",
	baseQuery: fetchBaseQuery({ baseUrl: `${API_URL}/` }),
	tagTypes: ["Market"],
	endpoints: (builder) => ({
		getAllMarkets: builder.query<Market[], void>({
			query: () => "markets/",
			providesTags: ["Market"],
		}),

		getMarketById: builder.query<Market, string>({
			query: (marketId) => `markets/${marketId}`,
			providesTags: ["Market"],
		}),

		getSellersFromMarket: builder.query<Seller[], string>({
			query: (marketId) => `markets/${marketId}/sellers`,
			providesTags: ["Market"],
		}),

		getOrdersFromMarket: builder.query<Order[], string>({
			query: (marketId) => `markets/${marketId}/orders`,
			providesTags: ["Market"],
		}),

		getOrdersDetailsFromMarket: builder.query<OrderDetails[], string>({
			query: (marketId) => `markets/${marketId}/orders-details`,
			providesTags: ["Market"],
		}),

		createMarket: builder.mutation<Market, CreateMarketDTO>({
			query: (newMarket) => ({
				url: "markets/",
				method: "POST",
				body: newMarket,
			}),
			invalidatesTags: ["Market"],
		}),

		updateMarket: builder.mutation<
			Market,
			{ marketId: string; updateData: UpdateMarketDTO }
		>({
			query: ({ marketId, updateData }) => ({
				url: `markets/${marketId}`,
				method: "PUT",
				body: updateData,
			}),
			invalidatesTags: ["Market"],
		}),

		deleteMarket: builder.mutation<{ message: string }, string>({
			query: (marketId) => ({
				url: `markets/${marketId}`,
				method: "DELETE",
			}),
			invalidatesTags: ["Market"],
		}),
	}),
});

export const {
	useGetAllMarketsQuery,
	useGetMarketByIdQuery,
	useGetSellersFromMarketQuery,
	useGetOrdersFromMarketQuery,
	useGetOrdersDetailsFromMarketQuery,
	useCreateMarketMutation,
	useUpdateMarketMutation,
	useDeleteMarketMutation,
} = marketApi;
