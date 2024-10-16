import {
	selectAllPromoCodes,
	selectPromoCodeById,
	insertPromoCode,
	updatePromoCodeById,
	deletePromoCodeById,
	selectPromoCodeByCode,
} from "@/repositories/promocode.repository";
import { PromoCode } from "@prisma/client";

export async function getAllPromoCodes() {
	return selectAllPromoCodes();
}

export async function getPromoCodeById(promoCodeId: string) {
	return selectPromoCodeById(promoCodeId);
}

export async function createPromoCode(
	data: Omit<PromoCode, "promoCodeId" | "createdAt" | "updatedAt">
) {
	return insertPromoCode(data);
}

export async function updatePromoCode(
	promoCodeId: string,
	data: Partial<PromoCode>
) {
	const existingPromoCode = await getPromoCodeById(promoCodeId);
	if (!existingPromoCode) {
		throw new Error("Code promo invalide");
	}

	const updatedPromoCode = await updatePromoCodeById(promoCodeId, data);
	return updatedPromoCode;
}

export async function deletePromoCode(promoCodeId: string) {
	const existingPromoCode = await getPromoCodeById(promoCodeId);
	if (!existingPromoCode) {
		throw new Error("Code promo invalide");
	}

	await deletePromoCodeById(promoCodeId);
}

export async function validatePromoCode(code: string) {
	const promoCode = await selectPromoCodeByCode(code);
	if (!promoCode || new Date(promoCode.expiration) < new Date()) {
		throw new Error("Code promo invalide ou expiré");
	}
	return promoCode;
}
