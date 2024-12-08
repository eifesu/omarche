import { Hono } from "hono";
import {
	getAllOrders,
	getOrderDetailsById,
	postOrder,
	putOrderStatusById,
	deleteOrderByIds,
	putOrderById,
	getOrderProductsByOrderId,
} from "@/services/order.service";
import { z } from "zod";
import { zValidator } from "@hono/zod-validator";
import AppError from "@/utils/AppError";

const StatusDTO = z.enum([
	"IDLE",
	"PROCESSING",
	"PROCESSED",
	"COLLECTING",
	"DELIVERING",
	"DELIVERED",
	"CANCELED",
]);

const InsertOrderDTO = z.object({
	userId: z.string(),
	locationX: z.number(),
	locationY: z.number(),
	address: z.string(),
	deliveryTime: z.string(),
	paymentMethod: z.string(),
	promoCodeId: z.string().uuid().optional(),
	status: StatusDTO,
});

const InsertOrderProductDTO = z.object({
	productId: z.string(),
	quantity: z.number(),
});

const UpdateOrderStatusDTO = z.object({
	type: z.enum(["agent", "shipper", "admin"]),
	userId: z.string().uuid(),
	status: StatusDTO,
	cancellationReason: z.string().optional()
});

const PostOrderDTO = z.object({
	order: InsertOrderDTO,
	orderProducts: z.array(InsertOrderProductDTO),
});

const UpdateOrderDTO = z.object({
	locationX: z.number().optional(),
	locationY: z.number().optional(),
	agentId: z.string().uuid().optional(),
	shipperId: z.string().uuid().optional(),
	address: z.string().optional(),
	deliveryTime: z.string().optional(),
	paymentMethod: z.string().optional(),
	promoCodeId: z.string().uuid().optional(),
	status: StatusDTO.optional(),
	cancellationReason: z.string().optional(),
});

const orderHandler = new Hono();

// Create (POST) a new order
orderHandler.post("/", zValidator("json", PostOrderDTO), async (c) => {
	const body = c.req.valid("json");
	try {
		const result = await postOrder(body);
		return c.json(result, 201);
	} catch (error) {
		throw new AppError(
			"Erreur lors de la création de la commande",
			500,
			error as Error
		);
	}
});

// Read (GET) all orders
orderHandler.get("/", async (c) => {
	try {
		const orders = await getAllOrders();
		return c.json(orders);
	} catch (error) {
		throw new AppError(
			"Erreur lors de la récupération des commandes",
			500,
			error as Error
		);
	}
});

// Read (GET) a specific order by ID
orderHandler.get("/:id", async (c) => {
	const { id } = c.req.param();
	try {
		const orderDetails = await getOrderDetailsById(id);
		return c.json(orderDetails);
	} catch (error) {
		if (
			error instanceof Error &&
			error.message === "Cette commande n'existe pas"
		) {
			throw new AppError("Cette commande n'existe pas", 404, error);
		}
		throw new AppError("Une erreur est survenue", 500, error as Error);
	}
});

// Update (PUT) an entire order
orderHandler.put("/:id", zValidator("json", UpdateOrderDTO), async (c) => {
	const { id } = c.req.param();
	const body = c.req.valid("json");
	try {
		const result = await putOrderById(id, body);
		return c.json(result);
	} catch (error) {
		if (
			error instanceof Error &&
			error.message === "Cette commande n'existe pas"
		) {
			throw new AppError("Cette commande n'existe pas", 404, error);
		}
		throw new AppError("Une erreur est survenue", 500, error as Error);
	}
});

// Update (PUT) order status
orderHandler.put(
	"/:id/status",
	zValidator("json", UpdateOrderStatusDTO),
	async (c) => {
		const { id } = c.req.param();
		const body = c.req.valid("json");
		const { type, userId, status, cancellationReason } = body;
		try {
			const result = await putOrderStatusById({
				type,
				userId,
				orderId: id,
				status,
				cancellationReason,
			});
			return c.json(result);
		} catch (error) {
			if (
				error instanceof Error &&
				error.message === "Cette commande n'existe pas"
			) {
				throw new AppError("Cette commande n'existe pas", 404, error);
			}
			throw new AppError("Une erreur est survenue", 500, error as Error);
		}
	}
);

// Delete (DELETE) an order
orderHandler.delete("/:id", async (c) => {
	const { id } = c.req.param();
	try {
		await deleteOrderByIds(id);
		return c.json({ message: "Commande supprimée avec succès" }, 200);
	} catch (error) {
		if (
			error instanceof Error &&
			error.message === "Cette commande n'existe pas"
		) {
			throw new AppError("Cette commande n'existe pas", 404, error);
		}
		throw new AppError("Une erreur est survenue", 500, error as Error);
	}
});

orderHandler.get("/:id/order-products", async (c) => {
	const { id } = c.req.param();
	try {
		const orderProducts = await getOrderProductsByOrderId(id);
		return c.json(orderProducts);
	} catch (error) {
		throw new AppError("Une erreur est survenue", 500, error as Error);
	}
});

orderHandler.get("/:id/details", async (c) => {
	const { id } = c.req.param();
	try {
		const orderDetails = await getOrderDetailsById(id);
		return c.json(orderDetails);
	} catch (error) {
		throw new AppError("Une erreur est survenue", 500, error as Error);
	}
});

export default orderHandler;
