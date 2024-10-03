import prisma from "@prisma/index";
import { Seller } from "@prisma/client";

export async function selectSellersFromMarketById(marketId: string) {
	const sellers = await prisma.seller.findMany({
		where: {
			marketId,
		},
		include: {
			products: true,
		},
	});
	return sellers;
}

export async function selectSellerById(sellerId: string) {
	const seller = await prisma.seller.findUnique({
		where: {
			sellerId,
		},
		include: {
			market: true,
		},
	});
	return seller;
}

export async function updateSellerById(
	sellerId: string,
	data: Partial<Seller>
) {
	const updatedSeller = await prisma.seller.update({
		where: {
			sellerId,
		},
		data,
	});
	return updatedSeller;
}
