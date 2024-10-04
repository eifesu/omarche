import { Hono } from "hono";
import {
	getAllMarkets,
	getSellersFromMarketById,
	getOrdersByMarketId,
	updateMarket,
	createMarket,
	getMarketById,
} from "@/services/market.service";
import { z } from "zod";
import { zValidator } from "@hono/zod-validator";

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

const UpdateMarketDTO = z.object({
	name: z.string().optional(),
	latitude: z.number().optional(),
	longitude: z.number().optional(),
	isActive: z.boolean().optional(),
	pictureUrl: z.string().url().optional(),
});

marketHandler.put(
	"/:marketId",
	zValidator("json", UpdateMarketDTO),
	async (c) => {
		const { marketId } = c.req.param();
		const updateData = c.req.valid("json");

		try {
			const updatedMarket = await updateMarket(marketId, updateData);
			return c.json(updatedMarket);
		} catch (error) {
			if (
				error instanceof Error &&
				error.message === "Market not found"
			) {
				return c.json({ error: "Ce marché n'existe pas" }, 404);
			}
			return c.json({ error: "Une erreur est survenue" }, 500);
		}
	}
);

marketHandler.post(
	"/",
	zValidator(
		"json",
		z.object({
			name: z.string(),
			latitude: z.number(),
			longitude: z.number(),
			pictureUrl: z.string().url().optional(),
		})
	),
	async (c) => {
		const data = c.req.valid("json");
		try {
			const newMarket = await createMarket(data);
			return c.json(newMarket, 201);
		} catch (error) {
			return c.json(
				{
					error: "Une erreur est survenue lors de la création du marché",
				},
				500
			);
		}
	}
);

marketHandler.get("/:marketId", async (c) => {
	const { marketId } = c.req.param();
	try {
		const market = await getMarketById(marketId);
		return c.json(market);
	} catch (error) {
		if (error instanceof Error && error.message === "Market not found") {
			return c.json({ error: "Ce marché n'existe pas" }, 404);
		}
		return c.json({ error: "Une erreur est survenue" }, 500);
	}
});

export default marketHandler;
