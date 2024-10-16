import {
	selectProductById,
	selectAllProducts,
	insertProduct,
	updateProductById,
	deleteProductById,
} from "@/repositories/product.repository";
import { Product } from "@prisma/client";

export async function getProductById(productId: string) {
	return selectProductById(productId);
}

export async function getAllProducts() {
	return selectAllProducts();
}

export async function createProduct(
	data: Omit<Product, "productId" | "createdAt" | "updatedAt">
) {
	return insertProduct(data);
}

export async function updateProduct(productId: string, data: Partial<Product>) {
	const existingProduct = await getProductById(productId);
	if (!existingProduct) {
		throw new Error("Ce produit n'existe pas");
	}

	const updatedProduct = await updateProductById(productId, data);
	return updatedProduct;
}

export async function deleteProduct(productId: string) {
	const existingProduct = await getProductById(productId);
	if (!existingProduct) {
		throw new Error("Ce produit n'existe pas");
	}

	await deleteProductById(productId);
}
