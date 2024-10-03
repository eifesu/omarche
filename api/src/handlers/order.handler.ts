import { Hono } from "hono";
import {
	getOrderDetailsById,
	postOrder,
	putOrderStatusById,
} from "@/services/order.service";
import { z } from "zod";
import { zValidator } from "@hono/zod-validator";
import { updateOrderById } from "@/repositories/order.repository";

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
	status: StatusDTO,
	cancellationReason: z.string().optional(), // <-- Added field
});

const PostOrderDTO = z.object({
	order: InsertOrderDTO,
	orderProducts: z.array(InsertOrderProductDTO),
});

const orderHandler = new Hono();

orderHandler.post("/", zValidator("json", PostOrderDTO), async (c) => {
	const body = c.req.valid("json");
	const result = await postOrder(body);
	return c.json(result);
});

orderHandler.put("/:id", zValidator("json", InsertOrderDTO), async (c) => {
	const { id } = c.req.param();
	const body = c.req.valid("json");
	const result = await updateOrderById(id, body);
	return c.json(result);
});

orderHandler.put(
	"/:id/status",
	zValidator("json", UpdateOrderStatusDTO),
	async (c) => {
		const { id } = c.req.param();
		const body = c.req.valid("json");
		const { status, cancellationReason } = body;
		const result = await putOrderStatusById({
			orderId: id,
			status,
			cancellationReason,
		});
		return c.json(result);
	}
);

orderHandler.get("/:id", async (c) => {
	const { id } = c.req.param();
	try {
		const orderDetails = await getOrderDetailsById(id);
		return c.json(orderDetails);
	} catch (error) {
		if (error instanceof Error) {
			return c.json({ error: error.message }, 404);
		}
		return c.json({ error: "An unexpected error occurred" }, 500);
	}
});

export default orderHandler;
