import { ENV } from "@/config/constants";
import { Agent } from "@/features/auth/redux/agent.api";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { Market } from "./marketsApi.slice";
import { Shipper } from "@/features/auth/redux/shipper.api";
import { User } from "@/features/auth/redux/user.api";
import { Product } from "./productsApi.slice";

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
	status: OrderStatusType;
	promoCode?: string;
	cancellationReason?: string;
}

export interface OrderProduct {
	orderProductId: string;
	orderId: string;
	productId: string;
	quantity: number;
}

interface CreateOrderInput {
	userId: string;
	locationX: number;
	locationY: number;
	address: string;
	deliveryTime: string;
	paymentMethod: string;
	status: OrderStatusType;
	promoCodeId?: string;
}

export interface CreateOrderWithProductsInput {
	order: CreateOrderInput;
	orderProducts: {
		productId: string;
		quantity: number;
	}[];
}

export interface OrderDetails {
	order: Order;
	orderProducts: {
		sellerName: string;
		sellerTableNo: number;
		product: Product;
		quantity: number;
	}[];
	marketName: string;
	client: User;
	market: Market;
	shipper: Shipper | null;
	agent: Agent | null;
}

export type OrderStatusType =
	| "IDLE"
	| "PROCESSING"
	| "PROCESSED"
	| "COLLECTING"
	| "DELIVERING"
	| "DELIVERED"
	| "CANCELED";

interface UpdateOrderStatusInput {
	agentId?: string;
	orderId: string;
	status: Order["status"];
	cancellationReason?: string;
}

export const ordersApi = createApi({
	reducerPath: "ordersApi",
	baseQuery: fetchBaseQuery({ baseUrl: `${ENV.API_URL}` }),
	endpoints: (builder) => ({
		createOrderWithProducts: builder.mutation<
			void,
			CreateOrderWithProductsInput
		>({
			query: (order) => ({
				url: "/orders/",
				method: "POST",
				body: order,
			}),
		}),
		getOrdersByUserId: builder.query<Order[], string>({
			query: (userId) => `/users/${userId}/orders`,
		}),
		getOrderProductsByOrderId: builder.query<OrderProduct[], string>({
			query: (orderId) => `/orders/${orderId}/order-products`,
		}),
		getOrderDetailsById: builder.query<OrderDetails, string>({
			query: (orderId) => `/orders/${orderId}/details`,
		}),
		updateOrderStatus: builder.mutation<
			Partial<Order>,
			UpdateOrderStatusInput
		>({
			query: ({ orderId, agentId, status, cancellationReason }) => ({
				url: `/orders/${orderId}/status`,
				method: "PUT",
				body: { agentId, status, cancellationReason }, // <-- Updated body
			}),
			invalidatesTags: (_result, _error, { orderId }) => [
				{ type: "Order", id: orderId },
			],
		}),
	}),
	tagTypes: ["Order"],
});

export const {
	useCreateOrderWithProductsMutation,
	useGetOrdersByUserIdQuery,
	useUpdateOrderStatusMutation,
	useGetOrderProductsByOrderIdQuery,
	useGetOrderDetailsByIdQuery,
} = ordersApi;

export default ordersApi;
