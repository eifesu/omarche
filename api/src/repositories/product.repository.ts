import { Product } from "@prisma/client";
import prisma from "@prisma/index";

export async function selectProductById(productId: string) {
	const product = await prisma.product.findUnique({
		where: {
			productId,
		},
		include: {
			seller: true,
		},
	});
	return product;
}

export async function selectProductsBySellerId(sellerId: string) {
	const products = await prisma.product.findMany({
		where: {
			sellerId,
		},
	});
	return products;
}

export async function updateProductById(
	productId: string,
	data: Partial<Product>
) {
	const updatedProduct = await prisma.product.update({
		where: {
			productId,
		},
		data,
		include: {
			seller: true,
		},
	});
	return updatedProduct;
}
