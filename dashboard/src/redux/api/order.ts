import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { Product } from "./product";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

export interface OrderDTO {
	order: Order;
	orderProducts: {
		sellerName: string;
		sellerTableNo: number;
		product: Product;
		quantity: number;
	}[];
	marketName: string;
}

export interface Order {
	orderId: string;
	userId: string;
	agentId?: string;
	shipperId?: string;
	locationX: number;
	locationY: number;
	address: string;
	deliveryTime: string;
	paymentMethod: string;
	status:
		| "IDLE"
		| "PROCESSING"
		| "PROCESSED"
		| "COLLECTING"
		| "DELIVERING"
		| "DELIVERED"
		| "CANCELED";
	promoCode?: string;
	cancellationReason?: string;
}

export interface OrderProduct {
	productId: string;
	quantity: number;
}

export interface CreateOrderDTO {
	order: {
		userId: string;
		locationX: number;
		locationY: number;
		address: string;
		deliveryTime: string;
		paymentMethod: string;
		promoCodeId?: string;
		status:
			| "IDLE"
			| "PROCESSING"
			| "PROCESSED"
			| "COLLECTING"
			| "DELIVERING"
			| "DELIVERED"
			| "CANCELED";
	};
	orderProducts: OrderProduct[];
}

export interface UpdateOrderDTO {
	userId: string;
	locationX: number;
	locationY: number;
	address: string;
	deliveryTime: string;
	paymentMethod: string;
	promoCodeId?: string;
	status:
		| "IDLE"
		| "PROCESSING"
		| "PROCESSED"
		| "COLLECTING"
		| "DELIVERING"
		| "DELIVERED"
		| "CANCELED";
}

export interface UpdateOrderStatusDTO {
	status:
		| "IDLE"
		| "PROCESSING"
		| "PROCESSED"
		| "COLLECTING"
		| "DELIVERING"
		| "DELIVERED"
		| "CANCELED";
	cancellationReason?: string;
}

export const orderApi = createApi({
	reducerPath: "orderApi",
	baseQuery: fetchBaseQuery({ baseUrl: `${API_URL}/` }),
	tagTypes: ["Order"],
	endpoints: (builder) => ({
		getAllOrders: builder.query<OrderDTO[], void>({
			query: () => "orders/",
			providesTags: ["Order"],
		}),

		getOrderById: builder.query<OrderDTO, string>({
			query: (orderId) => `orders/${orderId}`,
			providesTags: ["Order"],
		}),

		getOrderProducts: builder.query<OrderProduct[], string>({
			query: (orderId) => `orders/${orderId}/order-products`,
			providesTags: ["Order"],
		}),

		getOrderDetails: builder.query<Order, string>({
			query: (orderId) => `orders/${orderId}/details`,
			providesTags: ["Order"],
		}),

		createOrder: builder.mutation<Order, CreateOrderDTO>({
			query: (newOrder) => ({
				url: "orders/",
				method: "POST",
				body: newOrder,
			}),
			invalidatesTags: ["Order"],
		}),

		updateOrder: builder.mutation<
			Order,
			{ orderId: string; updateData: UpdateOrderDTO }
		>({
			query: ({ orderId, updateData }) => ({
				url: `orders/${orderId}`,
				method: "PUT",
				body: updateData,
			}),
			invalidatesTags: ["Order"],
		}),

		updateOrderStatus: builder.mutation<
			Order,
			{ orderId: string; updateData: UpdateOrderStatusDTO }
		>({
			query: ({ orderId, updateData }) => ({
				url: `orders/${orderId}/status`,
				method: "PUT",
				body: updateData,
			}),
			invalidatesTags: ["Order"],
		}),

		deleteOrder: builder.mutation<{ message: string }, string>({
			query: (orderId) => ({
				url: `orders/${orderId}`,
				method: "DELETE",
			}),
			invalidatesTags: ["Order"],
		}),
	}),
});

export const {
	useGetAllOrdersQuery,
	useGetOrderByIdQuery,
	useGetOrderProductsQuery,
	useGetOrderDetailsQuery,
	useCreateOrderMutation,
	useUpdateOrderMutation,
	useUpdateOrderStatusMutation,
	useDeleteOrderMutation,
} = orderApi;
