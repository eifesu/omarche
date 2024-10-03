import { ENV } from "@/config/constants";
import { OrderDetailsWithParticipants } from "@/features/(client)/redux/ordersApi.slice";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export interface Shipper {
	shipperId: string;
	marketId: string;
	email: string;
	firstName: string;
	lastName: string;
	phone: string;
	pictureUrl?: string;
	createdAt: string;
	updatedAt: string;
}

export const shippersApi = createApi({
	reducerPath: "shippersApi",
	baseQuery: fetchBaseQuery({ baseUrl: `${ENV.API_URL}/shippers` }),
	endpoints: (builder) => ({
		fetchShipperById: builder.query<Shipper, string>({
			query: (shipperId) => ({
				url: `/${shipperId}`,
				method: "GET",
			}),
		}),
		getAssignedOrder: builder.query<
			OrderDetailsWithParticipants | null,
			string
		>({
			query: (shipperId) => ({
				url: `/${shipperId}/assigned-order`,
				method: "GET",
			}),
		}),
	}),
});

export const { useFetchShipperByIdQuery, useGetAssignedOrderQuery } =
	shippersApi;

export default shippersApi;
