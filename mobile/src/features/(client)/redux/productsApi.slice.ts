import { ENV } from "@/config/constants";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { SellerDetails } from "./sellersApi.slice";

export type Product = {
	productId: string;
	pictureUrl: string[];
	name: string;
	description: string;
	unit: string;
	amount: number;
	price: number;
	category: "Légumes" | "Fruits" | "Viande" | "Poisson";
	isInStock: boolean;
	sellerId: string;
};

export type ProductDetails = {
	productId: string;
	pictureUrl: string[];
	name: string;
	description: string;
	unit: string;
	amount: number;
	price: number;
	category: "Légumes" | "Fruits" | "Viande" | "Poisson";
	isInStock: boolean;
	seller: SellerDetails;
};

export type UpdateProductDTO = Partial<Omit<Product, "productId" | "sellerId">>;

export const productApi = createApi({
	reducerPath: "productApi",
	baseQuery: fetchBaseQuery({ baseUrl: `${ENV.API_URL}/products` }),
	tagTypes: ["Product"],
	endpoints: (builder) => ({
		fetchProducts: builder.query<Product[], void>({
			query: () => ({
				url: "/",
				method: "GET",
			}),
			providesTags: ["Product"],
		}),
		fetchProductById: builder.query<ProductDetails, string>({
			query: (productId) => ({
				url: `/${productId}`,
				method: "GET",
			}),
			providesTags: (_result, _error, productId) => [
				{ type: "Product", id: productId },
			],
		}),
		createProduct: builder.mutation<void, Omit<Product, "productId">>({
			query: (body) => ({
				url: "/",
				method: "POST",
				body,
			}),
			invalidatesTags: ["Product"],
		}),
		updateProductById: builder.mutation<
			void,
			{ productId: string; data: UpdateProductDTO }
		>({
			onQueryStarted(arg, _) {
				console.log(arg);
			},
			query: ({ productId, data }) => ({
				url: `/${productId}`,
				method: "PUT",
				body: data,
			}),
			invalidatesTags: (_result, _error, { productId }) => [
				{ type: "Product", id: productId },
			],
		}),
		deleteProductById: builder.mutation<void, string>({
			query: (productId) => ({
				url: `/${productId}`,
				method: "DELETE",
			}),
			invalidatesTags: (_result, _error, productId) => [
				{ type: "Product", id: productId },
			],
		}),
	}),
});

export const {
	useFetchProductsQuery,
	useFetchProductByIdQuery,
	useCreateProductMutation,
	useUpdateProductByIdMutation,
	useDeleteProductByIdMutation,
} = productApi;

export default productApi;
