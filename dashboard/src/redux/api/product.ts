import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

export type ProductCategory =
	| "Legumes"
	| "Fruits"
	| "Viandes"
	| "Poissons"
	| "Boissons"
	| "Epices"
	| "Autres";

export interface Product {
	productId: string;
	name: string;
	description: string | null;
	price: number;
	amount: number;
	unit: string;
	category: ProductCategory;
	isInStock: boolean;
	pictureUrl: string[];
	sellerId: string;
	createdAt: Date | null;
	updatedAt: Date;
}

export interface CreateProductDTO {
	name: string;
	description: string;
	unit: string;
	amount: number;
	price: number;
	category: ProductCategory;
	pictureUrl: string[];
	sellerId: string;
}

export interface UpdateProductDTO {
	name?: string;
	description?: string;
	unit?: string;
	amount?: number;
	price?: number;
	category?: ProductCategory;
	isInStock?: boolean;
	pictureUrl?: string[];
}

export const productApi = createApi({
	reducerPath: "productApi",
	baseQuery: fetchBaseQuery({ baseUrl: `${API_URL}/` }),
	tagTypes: ["Product"],
	endpoints: (builder) => ({
		getAllProducts: builder.query<Product[], void>({
			query: () => "products/",
			providesTags: ["Product"],
		}),

		getProductById: builder.query<Product, string>({
			query: (productId) => `products/${productId}`,
			providesTags: ["Product"],
		}),

		createProduct: builder.mutation<Product, CreateProductDTO>({
			query: (newProduct) => ({
				url: "products/",
				method: "POST",
				body: newProduct,
			}),
			invalidatesTags: ["Product"],
		}),

		updateProduct: builder.mutation<
			Product,
			{ productId: string; updateData: UpdateProductDTO }
		>({
			query: ({ productId, updateData }) => ({
				url: `products/${productId}`,
				method: "PUT",
				body: updateData,
			}),
			invalidatesTags: ["Product"],
		}),

		deleteProduct: builder.mutation<{ message: string }, string>({
			query: (productId) => ({
				url: `products/${productId}`,
				method: "DELETE",
			}),
			invalidatesTags: ["Product"],
		}),
	}),
});

export const {
	useGetAllProductsQuery,
	useGetProductByIdQuery,
	useCreateProductMutation,
	useUpdateProductMutation,
	useDeleteProductMutation,
} = productApi;