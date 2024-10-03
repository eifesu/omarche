import { getOrdersByUserId } from "@/services/user.service";
import { Hono } from "hono";

const userHandler = new Hono();

userHandler.get("/:userId/orders", async (c) => {
	const { userId } = c.req.param();
	const orders = await getOrdersByUserId(userId);
	return c.json(orders);
});

export default userHandler;
