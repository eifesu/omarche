import {
	insertOrder,
	InsertOrderDTO,
	insertOrderProducts,
	InsertOrderProductDTO,
	selectOrderProductsByOrderId,
	selectOrderById,
	updateOrderById,
	selectOrdersByMarketId,
	updateOrderStatusById,
	UpdateOrderStatusInput,
	selectOrderDetailsById,
	selectAllOrders,
	deleteOrderById,
	selectOrdersByUserId,
} from "@/repositories/order.repository";
import { selectProductById } from "@/repositories/product.repository";
import { selectSellerById } from "@/repositories/seller.repository";
import {
	Agent,
	Market,
	Order,
	OrderProducts,
	Product,
	Shipper,
	User,
} from "@prisma/client";
import prisma from "@prisma/index";

export async function postOrder(data: {
	order: InsertOrderDTO;
	orderProducts: InsertOrderProductDTO[];
}) {
	try {
		const order = await insertOrder(data.order);
		const orderProducts = await Promise.all(
			data.orderProducts.map((orderProduct) =>
				insertOrderProducts(orderProduct, order.orderId)
			)
		);

		return { order, orderProducts };
	} catch (e) {
		console.log(e);
	}
}

export type OrderDTO = {
	order: Order;
	orderProducts: {
		sellerName: string;
		sellerTableNo: number;
		product: Product;
		quantity: number;
	}[];
	marketName: string;
};

export async function getOrderById(orderId: string): Promise<OrderDTO> {
	const order = await selectOrderById(orderId);
	if (!order) throw new Error("Cette commande n'existe pas");
	const orderProducts = await selectOrderProductsByOrderId(order.orderId);
	const products = await Promise.all(
		orderProducts.map(async (orderProduct) => {
			const product = await selectProductById(orderProduct.productId);
			if (!product) throw new Error("Ce produit n'existe pas");
			return {
				product,
				quantity: orderProduct.quantity,
				sellerTableNo: product.seller.tableNumber,
				sellerName: product.seller.firstName,
			};
		})
	);
	const seller = await selectSellerById(products[0].product.sellerId);
	if (!seller) throw new Error("Ce vendeur n'existe pas");
	return {
		order,
		orderProducts: products,
		marketName: seller.market.name,
	};
}

export async function putOrderById(orderId: string, order: InsertOrderDTO) {
	const updatedOrder = await updateOrderById(orderId, order);
	return updatedOrder;
}

export async function getOrdersByMarketId(
	marketId: string
): Promise<OrderDTO[]> {
	const orders = await selectOrdersByMarketId(marketId);
	const ordersDTO = await Promise.all(
		orders.map((order) => getOrderById(order.orderId))
	);
	return ordersDTO;
}

export async function putOrderStatusById(input: UpdateOrderStatusInput) {
	const { orderId, status, cancellationReason } = input;
	const updatedOrder = await updateOrderStatusById(
		orderId,
		status,
		cancellationReason
	);
	return updatedOrder;
}

export async function getOrderDetailsById(orderId: string): Promise<
	OrderDTO & {
		client: User;
		market: Market;
		shipper: Shipper | null;
		agent: Agent | null;
	}
> {
	const orderDetails = await selectOrderDetailsById(orderId);
	if (!orderDetails) throw new Error("Cette commande n'existe pas");

	const agent = await prisma.agent.findFirst({
		where: {
			marketId: orderDetails.orderProducts[0].products.seller.marketId,
		},
	});

	const market = orderDetails.orderProducts[0].products.seller.market;

	return {
		order: orderDetails,
		orderProducts: orderDetails.orderProducts.map((op) => ({
			product: op.products,
			quantity: op.quantity,
			sellerName: op.products.seller.firstName,
			sellerTableNo: op.products.seller.tableNumber,
		})),
		marketName: market.name,
		client: orderDetails.users,
		market: market,
		shipper: orderDetails.shipper,
		agent: agent,
	};
}

export async function getAllOrders(): Promise<OrderDTO[]> {
	const orders = await selectAllOrders();
	const ordersDTO = orders.map((order) => ({
		order,
		orderProducts: order.orderProducts.map((op) => ({
			product: op.products,
			quantity: op.quantity,
			sellerName: op.products.seller.firstName,
			sellerTableNo: op.products.seller.tableNumber,
		})),
		marketName: order.orderProducts[0]?.products.seller.market.name || "",
		client: order.users,
		market: order.orderProducts[0]?.products.seller.market,
		shipper: order.shipper,
	}));
	return ordersDTO;
}

export async function deleteOrderByIds(orderId: string) {
	const deletedOrder = await deleteOrderById(orderId);
	if (!deletedOrder) {
		throw new Error("Order not found");
	}
	return deletedOrder;
}

export async function getOrdersByUserId(userId: string): Promise<Order[]> {
	const orders = await selectOrdersByUserId(userId);
	return orders;
}

export async function getOrderProductsByOrderId(
	orderId: string
): Promise<OrderProducts[]> {
	const orderProducts = await selectOrderProductsByOrderId(orderId);
	return orderProducts;
}
