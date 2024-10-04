import {
	insertMarket,
	selectAllMarkets,
	selectMarketById,
	updateMarketById,
} from "@/repositories/market.repository";
import { selectSellersFromMarketById } from "@/repositories/seller.repository";
import { getOrderById, OrderDTO } from "./order.service";
import { selectOrdersByMarketId } from "@/repositories/order.repository";
import { Market } from "@prisma/client";

export async function getAllMarkets() {
	return selectAllMarkets();
}

export async function getSellersFromMarketById(marketId: string) {
	return selectSellersFromMarketById(marketId);
}

export async function getOrdersByMarketId(
	marketId: string
): Promise<OrderDTO[]> {
	const orders = await selectOrdersByMarketId(marketId);
	console.log(orders);
	const ordersDTO = await Promise.all(
		orders.map((order) => getOrderById(order.orderId))
	);
	return ordersDTO;
}

export async function updateMarket(marketId: string, data: Partial<Market>) {
	const updatedMarket = await updateMarketById(marketId, data);
	return updatedMarket;
}

export async function createMarket(data: {
	name: string;
	latitude: number;
	longitude: number;
	pictureUrl?: string;
}) {
	const newMarket = await insertMarket(data);
	return newMarket;
}

export async function getMarketById(marketId: string) {
	const market = await selectMarketById(marketId);
	if (!market) {
		throw new Error("Market not found");
	}
	return market;
}
