import { selectProductById } from "@/repositories/product.repository";
import { selectProductsBySellerId } from "@/repositories/product.repository";
import { updateProductById } from "@/repositories/product.repository";
import { Product } from "@prisma/client";

export async function getProductById(productId: string) {
	return selectProductById(productId);
}

export async function updateProduct(productId: string, data: Partial<Product>) {
	const existingProduct = await getProductById(productId);
	if (!existingProduct) {
		throw new Error("Ce produit n'existe pas");
	}

	const updatedProduct = await updateProductById(productId, data);
	return updatedProduct;
}
