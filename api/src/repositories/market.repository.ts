import prisma from "@prisma/index";

export async function selectAllMarkets() {
	const markets = await prisma.market.findMany();
	return markets;
}
