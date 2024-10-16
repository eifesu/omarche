import {
	selectAllShippers,
	selectShipperById,
	updateShipperById,
	deleteShipperById,
} from "@/repositories/shipper.repository";
import { Shipper } from "@prisma/client";

export async function getAllShippers(): Promise<Shipper[]> {
	return selectAllShippers();
}

export async function getShipperById(
	shipperId: string
): Promise<Shipper | null> {
	return selectShipperById(shipperId);
}

export async function updateShipper(
	shipperId: string,
	data: Partial<Shipper>
): Promise<Shipper> {
	const existingShipper = await selectShipperById(shipperId);
	if (!existingShipper) {
		throw new Error("Shipper not found");
	}

	const updatedShipper = await updateShipperById(shipperId, data);
	return updatedShipper;
}

export async function deleteShipper(shipperId: string): Promise<void> {
	const existingShipper = await selectShipperById(shipperId);
	if (!existingShipper) {
		throw new Error("Shipper not found");
	}

	await deleteShipperById(shipperId);
}
