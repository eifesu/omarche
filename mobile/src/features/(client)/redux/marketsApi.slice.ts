import { ENV } from "@/config/constants";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { Seller } from "./sellersApi.slice";
import { Order } from "./ordersApi.slice";

export type Market = {
	marketId: string;
	name: string;
	latitude: number;
	longitude: number;
	isActive: boolean;
	pictureUrl: string | undefined;
};

export const marketsApi = createApi({
	reducerPath: "marketsApi",
	baseQuery: fetchBaseQuery({ baseUrl: `${ENV.API_URL}/markets` }),
	endpoints: (builder) => ({
		fetchMarkets: builder.query<Market[], void>({
			query: () => ({
				url: "/",
				method: "GET",
			}),
		}),
		fetchMarketById: builder.query<Market, string>({
			query: (marketId) => ({
				url: `/${marketId}`,
				method: "GET",
			}),
		}),
		fetchSellersByMarketId: builder.query<Seller[], string>({
			query: (marketId) => ({
				url: `/${marketId}/sellers`,
				method: "GET",
			}),
		}),
		getOrdersByMarketId: builder.query<Order[], string>({
			query: (marketId) => `/${marketId}/orders`,
		}),
	}),
});

export const {
	useFetchMarketsQuery,
	useFetchSellersByMarketIdQuery,
	useGetOrdersByMarketIdQuery,
	useFetchMarketByIdQuery,
} = marketsApi;

export default marketsApi;
