import { Hono } from "hono";
import { getProductById } from "@/services/product.service";
import { updateProduct } from "@/services/product.service";
import { z } from "zod";
import { zValidator } from "@hono/zod-validator";
import { Decimal } from "@prisma/client/runtime/library";

const UpdateProductDTO = z.object({
	name: z.string().optional(),
	description: z.string().optional(),
	unit: z.string().optional(),
	isInStock: z.boolean().optional(),
	amount: z.number().optional(),
	price: z
		.number()
		.transform((value) => new Decimal(value))
		.optional(),
	category: z.enum(["Légumes", "Fruits", "Viande", "Poisson"]).optional(),
	pictureUrl: z.array(z.string().url()).optional(),
});

const productHandler = new Hono();

productHandler.get("/:productId", async (c) => {
	const { productId } = c.req.param();
	const product = await getProductById(productId);
	return c.json(product);
});

productHandler.put(
	"/:productId",
	zValidator("json", UpdateProductDTO),
	async (c) => {
		const { productId } = c.req.param();
		let updateData = c.req.valid("json");

		try {
			const updatedProduct = await updateProduct(productId, updateData);
			return c.json(updatedProduct);
		} catch (error) {
			if (
				error instanceof Error &&
				error.message === "Ce produit n'existe pas"
			) {
				return c.text("Ce produit n'existe pas", 404);
			}
			return c.text("Une erreur est survenue", 500);
		}
	}
);

export default productHandler;
