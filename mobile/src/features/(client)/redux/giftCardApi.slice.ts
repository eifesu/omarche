import { ENV } from "@/config/constants";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export type GiftCard = {
	giftCardId: string;
	code: string;
	amount: number;
	isUsed: boolean;
	expirationDate: string;
	userId: string;
};

export type CreateGiftCardDTO = Omit<GiftCard, "giftCardId" | "isUsed">;
export type UpdateGiftCardDTO = Partial<CreateGiftCardDTO>;

export const giftCardApi = createApi({
	reducerPath: "giftCardApi",
	baseQuery: fetchBaseQuery({ baseUrl: `${ENV.API_URL}/giftcards` }),
	tagTypes: ["GiftCard"],
	endpoints: (builder) => ({
		fetchGiftCards: builder.query<GiftCard[], void>({
			query: () => ({
				url: "/",
				method: "GET",
			}),
			providesTags: ["GiftCard"],
		}),
		fetchGiftCardById: builder.query<GiftCard, string>({
			query: (giftCardId) => ({
				url: `/${giftCardId}`,
				method: "GET",
			}),
			providesTags: (_result, _error, giftCardId) => [
				{ type: "GiftCard", id: giftCardId },
			],
		}),
		createGiftCard: builder.mutation<GiftCard, CreateGiftCardDTO>({
			query: (body) => ({
				url: "/",
				method: "POST",
				body,
			}),
			invalidatesTags: ["GiftCard"],
		}),
		updateGiftCardById: builder.mutation<
			GiftCard,
			{ giftCardId: string; data: UpdateGiftCardDTO }
		>({
			query: ({ giftCardId, data }) => ({
				url: `/${giftCardId}`,
				method: "PUT",
				body: data,
			}),
			invalidatesTags: (_result, _error, { giftCardId }) => [
				{ type: "GiftCard", id: giftCardId },
			],
		}),
		deleteGiftCardById: builder.mutation<void, string>({
			query: (giftCardId) => ({
				url: `/${giftCardId}`,
				method: "DELETE",
			}),
			invalidatesTags: (_result, _error, giftCardId) => [
				{ type: "GiftCard", id: giftCardId },
			],
		}),
		assignGiftCardToUser: builder.mutation<
			GiftCard,
			{ giftCardId: string; userId: string }
		>({
			query: ({ giftCardId, userId }) => ({
				url: `/${giftCardId}/assign`,
				method: "POST",
				body: { userId },
			}),
		}),
		validateGiftCard: builder.mutation<GiftCard, string>({
			query: (code) => ({
				url: "/validate",
				method: "POST",
				body: { code },
			}),
		}),
	}),
});

export const {
	useFetchGiftCardsQuery,
	useFetchGiftCardByIdQuery,
	useCreateGiftCardMutation,
	useUpdateGiftCardByIdMutation,
	useDeleteGiftCardByIdMutation,
	useValidateGiftCardMutation,
	useAssignGiftCardToUserMutation,
} = giftCardApi;

export default giftCardApi;
