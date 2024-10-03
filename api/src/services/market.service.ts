import { selectAllMarkets } from "@/repositories/market.repository";
import { selectSellersFromMarketById } from "@/repositories/seller.repository";
import { getOrderById, OrderDTO } from "./order.service";
import { selectOrdersByMarketId } from "@/repositories/order.repository";

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
