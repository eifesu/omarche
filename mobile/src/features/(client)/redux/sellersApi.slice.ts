import { ENV } from "@/config/constants";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { Product } from "./productsApi.slice";

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

export const sellersApi = createApi({
	reducerPath: "sellersApi",
	baseQuery: fetchBaseQuery({ baseUrl: `${ENV.API_URL}` }),
	tagTypes: ["Seller", "Product"],
	endpoints: (builder) => ({
		fetchProductsBySellerId: builder.query<Product[], string>({
			query: (sellerId) => ({
				url: `/sellers/${sellerId}/products`,
				method: "GET",
			}),
			providesTags: (_result, _error, sellerId) => [
				{ type: "Product", id: sellerId },
			],
		}),
		fetchSellerById: builder.query<Seller, string>({
			query: (sellerId) => ({
				url: `/sellers/${sellerId}`,
				method: "GET",
			}),
			providesTags: (_result, _error, sellerId) => [
				{ type: "Seller", id: sellerId },
			],
		}),
		updateSellerById: builder.mutation<
			Partial<Seller>,
			{ sellerId: string; data: Partial<Seller> }
		>({
			query: ({ sellerId, data }) => ({
				url: `/sellers/${sellerId}`,
				method: "PUT",
				body: data,
			}),
			invalidatesTags: (_result, _error, { sellerId }) => [
				{ type: "Seller", id: sellerId },
			],
		}),
		fetchSellersByMarketId: builder.query<Seller[], string>({
			query: (marketId) => ({
				url: `/markets/${marketId}/sellers`,
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
