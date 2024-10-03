import { Hono } from "hono";
import {
	getAllMarkets,
	getSellersFromMarketById,
	getOrdersByMarketId,
} from "@/services/market.service";

const marketHandler = new Hono();

marketHandler.get("/", async (c) => {
	const markets = await getAllMarkets();
	return c.json(markets);
});

marketHandler.get("/:marketId/sellers", async (c) => {
	const { marketId } = c.req.param();
	const sellers = await getSellersFromMarketById(marketId);
	return c.json(sellers);
});

marketHandler.get("/:marketId/orders", async (c) => {
	const { marketId } = c.req.param();
	const orders = await getOrdersByMarketId(marketId);
	return c.json(orders);
});

export default marketHandler;
