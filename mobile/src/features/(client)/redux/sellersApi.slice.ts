import { ENV } from "@/config/constants";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { Product } from "./productsApi.slice";
import { Market } from "./marketsApi.slice";

export type Seller = {
	sellerId: string;
	marketId: string;
	pictureUrl: string | undefined;
	firstName: string;
	lastName: string;
	tableNumber: number;
	products: Product[];
	gender: "M" | "F";
	isActive: boolean;
};

export type SellerDetails = {
	sellerId: string;
	market: Market;
	pictureUrl: string | undefined;
	firstName: string;
	lastName: string;
	tableNumber: number;
	gender: "M" | "F";
	isActive: boolean;
};

export const sellersApi = createApi({
	reducerPath: "sellersApi",
	baseQuery: fetchBaseQuery({ baseUrl: `${ENV.API_URL}/sellers` }),
	tagTypes: ["Seller", "Product"],
	endpoints: (builder) => ({
		fetchProductsBySellerId: builder.query<Product[], string>({
			query: (sellerId) => ({
				url: `/${sellerId}/products`,
				method: "GET",
			}),
			providesTags: (_result, _error, sellerId) => [
				{ type: "Product", id: sellerId },
			],
		}),
		fetchSellerById: builder.query<SellerDetails, string>({
			query: (sellerId) => ({
				url: `/${sellerId}`,
				method: "GET",
			}),
			providesTags: (_result, _error, sellerId) => [
				{ type: "Seller", id: sellerId },
			],
		}),
		updateSellerById: builder.mutation<
			SellerDetails,
			{ sellerId: string; data: SellerDetails }
		>({
			query: ({ sellerId, data }) => ({
				url: `/${sellerId}`,
				method: "PUT",
				body: data,
			}),
			invalidatesTags: (_result, _error, { sellerId }) => [
				{ type: "Seller", id: sellerId },
			],
		}),
		fetchSellersByMarketId: builder.query<Seller[], string>({
			query: (marketId) => ({
				url: `/market/${marketId}`,
				method: "GET",
			}),
			providesTags: (_result, _error, marketId) => [
				{ type: "Seller", id: marketId },
			],
		}),
		createSeller: builder.mutation<Seller, Partial<Seller>>({
			query: (newSeller) => ({
				url: "/",
				method: "POST",
				body: newSeller,
			}),
			invalidatesTags: [{ type: "Seller", id: "LIST" }],
		}),
	}),
});

export const {
	useFetchProductsBySellerIdQuery,
	useFetchSellerByIdQuery,
	useFetchSellersByMarketIdQuery,
	useCreateSellerMutation,
	useUpdateSellerByIdMutation,
} = sellersApi;

export default sellersApi;
