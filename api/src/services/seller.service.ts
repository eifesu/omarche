import { selectProductsBySellerId } from "@/repositories/product.repository";
import {
	selectSellerById,
	updateSellerById,
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
