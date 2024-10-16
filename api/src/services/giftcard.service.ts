import {
	selectAllGiftCards,
	selectGiftCardById,
	insertGiftCard,
	updateGiftCardById,
	deleteGiftCardById,
	selectGiftCardByUserId,
} from "@/repositories/giftcard.repository";
import { GiftCard } from "@prisma/client";

export async function getAllGiftCards() {
	return selectAllGiftCards();
}

export async function getGiftCardById(giftCardId: string) {
	return selectGiftCardById(giftCardId);
}

export async function assignGiftCardToUser(giftCardId: string, userId: string) {
	return updateGiftCardById(giftCardId, { userId });
}

export async function createGiftCard(
	data: Omit<GiftCard, "giftCardId" | "createdAt" | "updatedAt">
) {
	return insertGiftCard(data);
}

export async function updateGiftCard(
	giftCardId: string,
	data: Partial<GiftCard>
) {
	const existingGiftCard = await getGiftCardById(giftCardId);
	if (!existingGiftCard) {
		throw new Error("GiftCard not found");
	}

	const updatedGiftCard = await updateGiftCardById(giftCardId, data);
	return updatedGiftCard;
}

export async function deleteGiftCard(giftCardId: string) {
	const existingGiftCard = await getGiftCardById(giftCardId);
	if (!existingGiftCard) {
		throw new Error("GiftCard not found");
	}

	await deleteGiftCardById(giftCardId);
}

export async function getGiftCardByUserId(userId: string) {
	return selectGiftCardByUserId(userId);
}
