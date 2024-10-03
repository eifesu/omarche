import { ENV } from "@/config/constants";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { Seller } from "./sellersApi.slice";
import { OrderDetails } from "./ordersApi.slice";

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
		fetchSellersByMarketId: builder.query<Seller[], string>({
			query: (marketId) => ({
				url: `/${marketId}/sellers`,
				method: "GET",
			}),
		}),
		getOrdersByMarketId: builder.query<OrderDetails[], string>({
			query: (marketId) => `/${marketId}/orders`,
		}),
	}),
});

export const {
	useFetchMarketsQuery,
	useFetchSellersByMarketIdQuery,
	useGetOrdersByMarketIdQuery,
} = marketsApi;

export default marketsApi;
