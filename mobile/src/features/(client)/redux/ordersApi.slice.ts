import { ENV } from "@/config/constants";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { ProductDetails } from "./productsApi.slice";
import { User } from "@/features/auth/redux/user.api";
import { Shipper } from "@/features/auth/redux/shipper.api";
import { Agent } from "@/features/auth/redux/agent.api";
import { Market } from "./marketsApi.slice";

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

export interface OrderDetails {
	order: Order;
	orderProducts: {
		product: ProductDetails;
		quantity: number;
		sellerName: string;
		sellerTableNo: number;
	}[];
	marketName: string;
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

export interface OrderDetailsWithParticipants extends OrderDetails {
	client: User;
	market: Market;
	shipper: Shipper | null;
	agent: Agent | null;
}

export const ordersApi = createApi({
	reducerPath: "ordersApi",
	baseQuery: fetchBaseQuery({ baseUrl: `${ENV.API_URL}/orders` }),
	endpoints: (builder) => ({
		createOrderWithProducts: builder.mutation<
			void,
			CreateOrderWithProductsInput
		>({
			query: (order) => ({
				url: "/",
				method: "POST",
				body: order,
			}),
		}),
		getOrdersByUserId: builder.query<OrderDetails[], string>({
			query: (userId) => `/user/${userId}`,
		}),
		updateOrderStatus: builder.mutation<
			OrderDetails,
			UpdateOrderStatusInput
		>({
			query: ({ orderId, agentId, status, cancellationReason }) => ({
				url: `/${orderId}/status`,
				method: "PUT",
				body: { agentId, status, cancellationReason }, // <-- Updated body
			}),
			invalidatesTags: (_result, _error, { orderId }) => [
				{ type: "Order", id: orderId },
			],
		}),
		getOrderDetailsById: builder.query<
			OrderDetailsWithParticipants,
			string
		>({
			query: (orderId) => `/${orderId}`,
		}),
	}),
	tagTypes: ["Order"],
});

export const {
	useCreateOrderWithProductsMutation,
	useGetOrdersByUserIdQuery,
	useUpdateOrderStatusMutation,
	useGetOrderDetailsByIdQuery,
} = ordersApi;

export default ordersApi;
