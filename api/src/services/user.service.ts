import { selectOrdersByUserId } from "@/repositories/order.repository";
import { getOrderById, OrderDTO } from "./order.service";

export async function getOrdersByUserId(userId: string): Promise<OrderDTO[]> {
	const orders = await selectOrdersByUserId(userId);
	const ordersDTO = await Promise.all(
		orders.map(async (order) => {
			return getOrderById(order.orderId);
		})
	);
	return ordersDTO;
}
