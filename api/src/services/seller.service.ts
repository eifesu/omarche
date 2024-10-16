import { selectProductsBySellerId } from "@/repositories/product.repository";
import {
	selectSellerById,
	updateSellerById,
	selectAllSellers,
	insertSeller,
	deleteSellerById,
} from "@/repositories/seller.repository";
import { Seller } from "@prisma/client";

export async function getProductsBySellerId(sellerId: string) {
	return selectProductsBySellerId(sellerId);
}

export async function getSellerById(sellerId: string) {
	return selectSellerById(sellerId);
}

export async function updateSeller(sellerId: string, data: Partial<Seller>) {
	const existingSeller = await selectSellerById(sellerId);
	if (!existingSeller) {
		throw new Error("Ce vendeur n'existe pas");
	}

	const updatedSeller = await updateSellerById(sellerId, data);
	return updatedSeller;
}

export async function getAllSellers() {
	return selectAllSellers();
}

export async function createSeller(
	data: Omit<Seller, "sellerId" | "createdAt" | "updatedAt" | "isActive">
) {
	const newSeller = await insertSeller({ ...data, isActive: true });
	return newSeller;
}

export async function deleteSeller(sellerId: string) {
	const existingSeller = await selectSellerById(sellerId);
	if (!existingSeller) {
		throw new Error("Ce vendeur n'existe pas");
	}

	await deleteSellerById(sellerId);
}
