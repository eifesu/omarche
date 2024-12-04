import { ENV } from "@/config/constants";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export enum ProductCategory {
    Legumes = "Legumes",
    Fruits = "Fruits",
    Viandes = "Viandes",
    Poissons = "Poissons",
    Cereales = "Cereales",
    Tubercules = "Tubercules",
    Mer = "Mer",
    Epices = "Epices",
    Autres = "Autres"
}

export enum ProductUnit {
    KG = "KG",
    DEMI_KG = "DEMI_KG",
    TAS = "TAS",
    SAC = "SAC",
    BOITE = "BOITE",
    MORCEAUX = "MORCEAUX",
    UNIT = "UNIT",
    AUTRE = "AUTRE"
}

export type Product = {
    productId: string;
    pictureUrl: string[];
    name: string;
    description: string | null;
    unit: ProductUnit;
    amount: number;
    price: number;
    category: ProductCategory;
    sellerId: string;
    isInStock: boolean;
    createdAt: string | null;
    updatedAt: string;
    orderProducts?: Array<{
        orderProductId: string;
        orderId: string;
        quantity: number;
        createdAt: string | null;
        updatedAt: string;
    }>;
};

export type UpdateProductDTO = Partial<Omit<Product, "productId" | "sellerId">>;

export interface ProductDetails extends Product {
    // ... existing type definition
}

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
        fetchProductById: builder.query<Product, string>({
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
