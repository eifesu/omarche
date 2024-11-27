import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

export type PromoCodeType = "PERCENTAGE" | "FIXED";

export interface PromoCode {
	promoCodeId: string;
	code: string;
	expiration: string;
	discountType: PromoCodeType;
	amount: number;
	createdAt: Date;
	updatedAt: Date;
}

export interface CreatePromoCodeDTO {
	code: string;
	expiration: string;
	discountType: PromoCodeType;
	amount: number;
}

export interface UpdatePromoCodeDTO {
	code?: string;
	expiration?: string;
	discountType?: PromoCodeType;
	amount?: number;
}

export const promoCodeApi = createApi({
	reducerPath: "promoCodeApi",
	baseQuery: fetchBaseQuery({ baseUrl: `${API_URL}/` }),
	tagTypes: ["PromoCode"],
	endpoints: (builder) => ({
		getAllPromoCodes: builder.query<PromoCode[], void>({
			query: () => "promocodes/",
			providesTags: ["PromoCode"],
		}),

		getPromoCodeById: builder.query<PromoCode, string>({
			query: (promoCodeId) => `promocodes/${promoCodeId}`,
			providesTags: ["PromoCode"],
		}),

		validatePromoCode: builder.mutation<PromoCode, { code: string }>({
			query: (data) => ({
				url: "promocodes/validate",
				method: "POST",
				body: data,
			}),
			invalidatesTags: ["PromoCode"],
		}),

		createPromoCode: builder.mutation<PromoCode, CreatePromoCodeDTO>({
			query: (newPromoCode) => ({
				url: "promocodes/",
				method: "POST",
				body: newPromoCode,
			}),
			invalidatesTags: ["PromoCode"],
		}),

		updatePromoCode: builder.mutation<
			PromoCode,
			{ promoCodeId: string; updateData: UpdatePromoCodeDTO }
		>({
			query: ({ promoCodeId, updateData }) => ({
				url: `promocodes/${promoCodeId}`,
				method: "PUT",
				body: updateData,
			}),
			invalidatesTags: ["PromoCode"],
		}),

		deletePromoCode: builder.mutation<{ message: string }, string>({
			query: (promoCodeId) => ({
				url: `promocodes/${promoCodeId}`,
				method: "DELETE",
			}),
			invalidatesTags: ["PromoCode"],
		}),
	}),
});

export const {
	useGetAllPromoCodesQuery,
	useGetPromoCodeByIdQuery,
	useValidatePromoCodeMutation,
	useCreatePromoCodeMutation,
	useUpdatePromoCodeMutation,
	useDeletePromoCodeMutation,
} = promoCodeApi;
