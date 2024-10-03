import {
	getProductsBySellerId,
	getSellerById,
	updateSeller,
} from "@/services/seller.service";
import { Hono } from "hono";
import { z } from "zod";
import { zValidator } from "@hono/zod-validator";

const sellerHandler = new Hono();

sellerHandler.get("/:sellerId/products", async (c) => {
	const { sellerId } = c.req.param();
	const products = await getProductsBySellerId(sellerId);
	return c.json(products);
});

sellerHandler.get("/:sellerId", async (c) => {
	const { sellerId } = c.req.param();
	const seller = await getSellerById(sellerId);
	return c.json(seller);
});

const UpdateSellerDTO = z.object({
	firstName: z.string().optional(),
	lastName: z.string().optional(),
	pictureUrl: z.string().url().optional(),
	gender: z.enum(["M", "F"]).optional(),
	tableNumber: z.number().optional(),
	isActive: z.boolean().optional(),
});

sellerHandler.put(
	"/:sellerId",
	zValidator("json", UpdateSellerDTO),
	async (c) => {
		const { sellerId } = c.req.param();
		const updateData = c.req.valid("json");

		try {
			const updatedSeller = await updateSeller(sellerId, updateData);
			return c.json(updatedSeller);
		} catch (error) {
			if (
				error instanceof Error &&
				error.message === "Seller not found"
			) {
				return c.text("Ce vendeur n'existe pas", 404);
			}
			return c.text("Une erreur est survenue", 500);
		}
	}
);

export default sellerHandler;
