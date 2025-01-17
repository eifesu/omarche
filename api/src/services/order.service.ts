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
	UpdateOrderDTO,
} from "@/repositories/order.repository";
import { selectProductById } from "@/repositories/product.repository";
import { selectSellerById } from "@/repositories/seller.repository";
import {
	Agent,
	area_code,
	Market,
	Order,
	OrderProducts,
	Product,
	Shipper,
	User,
} from "@prisma/client";
import prisma from "@prisma/index";
import AppError from "@/utils/AppError";

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
	} catch (error) {
		throw new AppError("Erreur lors de la création de la commande", 500, error as Error);
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
	try {
		const order = await selectOrderById(orderId);
		if (!order) {
			throw new AppError("Commande introuvable", 404, new Error(`Order with ID ${orderId} not found`));
		}

		const orderProducts = await selectOrderProductsByOrderId(order.orderId);
		const products = await Promise.all(
			orderProducts.map(async (orderProduct) => {
				const product = await selectProductById(orderProduct.productId);
				if (!product) {
					throw new AppError("Produit introuvable", 404, new Error(`Product with ID ${orderProduct.productId} not found`));
				}
				return {
					product,
					quantity: orderProduct.quantity,
					sellerTableNo: product.seller.tableNumber,
					sellerName: product.seller.firstName,
				};
			})
		);

		const seller = await selectSellerById(products[0].product.sellerId);
		if (!seller) {
			throw new AppError("Vendeur introuvable", 404, new Error(`Seller with ID ${products[0].product.sellerId} not found`));
		}

		return {
			order,
			orderProducts: products,
			marketName: seller.market.name,
		};
	} catch (error) {
		if (error instanceof AppError) throw error;
		throw new AppError("Erreur lors de la récupération de la commande", 500, error as Error);
	}
}

export async function putOrderById(orderId: string, order: UpdateOrderDTO) {
	try {
		const existingOrder = await selectOrderById(orderId);
		if (!existingOrder) {
			throw new AppError("Commande introuvable", 404, new Error(`Order with ID ${orderId} not found`));
		}

		const updatedOrder = await updateOrderById(orderId, order);
		return updatedOrder;
	} catch (error) {
		if (error instanceof AppError) throw error;
		throw new AppError("Erreur lors de la mise à jour de la commande", 500, error as Error);
	}
}

export async function getOrdersByMarketId(marketId: string): Promise<OrderDTO[]> {
	try {
		const orders = await selectOrdersByMarketId(marketId);
		const ordersDTO = await Promise.all(
			orders.map((order) => getOrderById(order.orderId))
		);
		return ordersDTO;
	} catch (error) {
		if (error instanceof AppError) throw error;
		throw new AppError("Erreur lors de la récupération des commandes du marché", 500, error as Error);
	}
}

export async function putOrderStatusById(input: UpdateOrderStatusInput) {
	try {
		const { type, userId, orderId, status, cancellationReason } = input;
		const order = await selectOrderById(orderId);
		if (!order) {
			throw new AppError("Commande introuvable", 404, new Error(`Order with ID ${orderId} not found`));
		}

		const updatedOrder = await updateOrderStatusById({
			type,
			userId,
			orderId,
			status,
			cancellationReason,
		});
		return updatedOrder;
	} catch (error) {
		if (error instanceof AppError) throw error;
		throw new AppError("Erreur lors de la mise à jour du statut de la commande", 500, error as Error);
	}
}


export async function getOrderDetailsById(orderId: string): Promise<
	OrderDTO & {
		client: User;
		market: Market;
		shipper: Shipper | null;
		agent: Agent | null;
	}
> {
	try {
		const orderDetails = await selectOrderDetailsById(orderId);
		if (!orderDetails) {
			throw new AppError("Commande introuvable", 404, new Error(`Order with ID ${orderId} not found`));
		}

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
	} catch (error) {
		if (error instanceof AppError) throw error;
		throw new AppError("Erreur lors de la récupération des détails de la commande", 500, error as Error);
	}
}

export async function getAllOrders(areaCode?: area_code): Promise<OrderDTO[]> {
	try {
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
	} catch (error) {
		throw new AppError("Erreur lors de la récupération des commandes", 500, error as Error);
	}
}

export async function deleteOrderByIds(orderId: string) {
	try {
		const deletedOrder = await deleteOrderById(orderId);
		if (!deletedOrder) {
			throw new AppError("Commande introuvable", 404, new Error(`Order with ID ${orderId} not found`));
		}
		return deletedOrder;
	} catch (error) {
		if (error instanceof AppError) throw error;
		throw new AppError("Erreur lors de la suppression de la commande", 500, error as Error);
	}
}

export async function getOrdersByUserId(userId: string): Promise<Order[]> {
	try {
		const orders = await selectOrdersByUserId(userId);
		return orders;
	} catch (error) {
		throw new AppError("Erreur lors de la récupération des commandes de l'utilisateur", 500, error as Error);
	}
}

export async function getOrderProductsByOrderId(
	orderId: string
): Promise<OrderProducts[]> {
	try {
		const orderProducts = await selectOrderProductsByOrderId(orderId);
		if (!orderProducts || orderProducts.length === 0) {
			throw new AppError("Produits de commande introuvables", 404, new Error(`No products found for order ${orderId}`));
		}
		return orderProducts;
	} catch (error) {
		if (error instanceof AppError) throw error;
		throw new AppError("Erreur lors de la récupération des produits de la commande", 500, error as Error);
	}
}
