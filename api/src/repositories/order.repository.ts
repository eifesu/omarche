import prisma from "@prisma/index";
import { Order } from "@prisma/client";

export type InsertOrderDTO = {
	userId: string;
	locationX: number;
	locationY: number;
	address: string;
	deliveryTime: string;
	paymentMethod: string;
	status:
		| "IDLE"
		| "PROCESSING"
		| "DELIVERING"
		| "COLLECTING"
		| "DELIVERED"
		| "CANCELED"
		| "PROCESSED";
	promoCodeId?: string;
};

export type InsertOrderProductDTO = {
	productId: string;
	quantity: number;
};

export async function insertOrder(order: InsertOrderDTO) {
	const newOrder = await prisma.order.create({
		data: order,
	});
	return newOrder;
}

export async function insertOrderProducts(
	orderProduct: InsertOrderProductDTO,
	orderId: string
) {
	const newOrderProduct = await prisma.orderProducts.create({
		data: {
			...orderProduct,
			orderId,
		},
	});
	return newOrderProduct;
}

export async function selectOrdersByUserId(userId: string) {
	const orders = await prisma.order.findMany({
		where: {
			userId,
		},
	});
	return orders;
}

export async function selectOrderById(orderId: string) {
	const order = await prisma.order.findUnique({
		where: {
			orderId,
		},
	});
	return order;
}

export async function selectOrderProductsByOrderId(orderId: string) {
	const orderProducts = await prisma.orderProducts.findMany({
		where: {
			orderId,
		},
	});
	return orderProducts;
}

export async function updateOrderById(orderId: string, order: InsertOrderDTO) {
	const updatedOrder = await prisma.order.update({
		where: {
			orderId,
		},
		data: order,
	});
	return updatedOrder;
}

export async function selectOrdersByMarketId(
	marketId: string
): Promise<Order[]> {
	const orders = await prisma.order.findMany({
		where: {
			orderProducts: {
				some: {
					products: {
						seller: {
							marketId: marketId,
						},
					},
				},
			},
		},
		include: {
			orderProducts: {
				include: {
					products: {
						include: {
							seller: true,
						},
					},
				},
			},
		},
	});
	return orders;
}

export type UpdateOrderStatusInput = {
	orderId: string;
	status: Order["status"];
	cancellationReason?: string;
};

export async function updateOrderStatusById(
	orderId: string,
	status: Order["status"],
	cancellationReason?: string
) {
	const data: Partial<Order> = { status };
	if (status === "CANCELED" && cancellationReason) {
		data.cancellationReason = cancellationReason;
	}

	const updatedOrder = await prisma.order.update({
		where: {
			orderId,
		},
		data,
	});
	return updatedOrder;
}

export async function selectOrderDetailsById(orderId: string) {
	const orderDetails = await prisma.order.findUnique({
		where: { orderId },
		include: {
			users: true,
			shipper: true,
			orderProducts: {
				include: {
					products: {
						include: {
							seller: {
								include: {
									market: true,
								},
							},
						},
					},
				},
			},
		},
	});
	return orderDetails;
}

export async function selectAllOrders() {
	const orders = await prisma.order.findMany({
		include: {
			users: true,
			shipper: true,
			orderProducts: {
				include: {
					products: {
						include: {
							seller: {
								include: {
									market: true,
								},
							},
						},
					},
				},
			},
		},
	});
	return orders;
}

export async function deleteOrderById(orderId: string) {
	const deletedOrder = await prisma.order.delete({
		where: {
			orderId,
		},
	});
	return deletedOrder;
}
