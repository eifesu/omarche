import prisma from "@prisma/index";
import { Order } from "@prisma/client";
import { getOrderDetailsById } from "./order.service";

export async function getCurrentOrderForShipper(shipperId: string) {
	const currentOrder = await prisma.order.findFirst({
		where: {
			shipperId: shipperId,
			status: {
				in: ["PROCESSED", "COLLECTING", "DELIVERING"],
			},
		},
		orderBy: {
			updatedAt: "desc",
		},
	});

	if (!currentOrder) {
		return null;
	}

	return getOrderDetailsById(currentOrder.orderId);
}
