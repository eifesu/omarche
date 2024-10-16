import { ENV } from "@/config/constants";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export type PromoCode = {
	promoCodeId: string;
	code: string;
	expiration: string;
	discountType: "PERCENTAGE" | "FIXED";
	amount: number;
};

export type CreatePromoCodeDTO = Omit<PromoCode, "promoCodeId">;
export type UpdatePromoCodeDTO = Partial<CreatePromoCodeDTO>;

export const promoCodeApi = createApi({
	reducerPath: "promoCodeApi",
	baseQuery: fetchBaseQuery({ baseUrl: `${ENV.API_URL}/promocodes` }),
	tagTypes: ["PromoCode"],
	endpoints: (builder) => ({
		fetchPromoCodes: builder.query<PromoCode[], void>({
			query: () => ({
				url: "/",
				method: "GET",
			}),
			providesTags: ["PromoCode"],
		}),
		fetchPromoCodeById: builder.query<PromoCode, string>({
			query: (promoCodeId) => ({
				url: `/${promoCodeId}`,
				method: "GET",
			}),
			providesTags: (_result, _error, promoCodeId) => [
				{ type: "PromoCode", id: promoCodeId },
			],
		}),
		createPromoCode: builder.mutation<PromoCode, CreatePromoCodeDTO>({
			query: (body) => ({
				url: "/",
				method: "POST",
				body,
			}),
			invalidatesTags: ["PromoCode"],
		}),
		updatePromoCodeById: builder.mutation<
			PromoCode,
			{ promoCodeId: string; data: UpdatePromoCodeDTO }
		>({
			query: ({ promoCodeId, data }) => ({
				url: `/${promoCodeId}`,
				method: "PUT",
				body: data,
			}),
			invalidatesTags: (_result, _error, { promoCodeId }) => [
				{ type: "PromoCode", id: promoCodeId },
			],
		}),
		deletePromoCodeById: builder.mutation<void, string>({
			query: (promoCodeId) => ({
				url: `/${promoCodeId}`,
				method: "DELETE",
			}),
			invalidatesTags: (_result, _error, promoCodeId) => [
				{ type: "PromoCode", id: promoCodeId },
			],
		}),
		validatePromoCode: builder.mutation<PromoCode, string>({
			query: (code) => ({
				url: "/validate",
				method: "POST",
				body: { code },
			}),
		}),
	}),
});

export const {
	useFetchPromoCodesQuery,
	useFetchPromoCodeByIdQuery,
	useCreatePromoCodeMutation,
	useUpdatePromoCodeByIdMutation,
	useDeletePromoCodeByIdMutation,
	useValidatePromoCodeMutation,
} = promoCodeApi;
