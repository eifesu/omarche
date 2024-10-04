import prisma from "@prisma/index";
import { Market } from "@prisma/client";

export async function selectAllMarkets() {
	const markets = await prisma.market.findMany();
	return markets;
}

export async function updateMarketById(
	marketId: string,
	data: Partial<Market>
) {
	const updatedMarket = await prisma.market.update({
		where: {
			marketId,
		},
		data,
	});
	return updatedMarket;
}

export async function insertMarket(data: {
	name: string;
	latitude: number;
	longitude: number;
	pictureUrl?: string;
}) {
	const newMarket = await prisma.market.create({
		data,
	});
	return newMarket;
}

export async function selectMarketById(marketId: string) {
	const market = await prisma.market.findUnique({
		where: {
			marketId,
		},
	});
	return market;
}
