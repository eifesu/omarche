import { Hono } from "hono";
import { z } from "zod";
import { zValidator } from "@hono/zod-validator";
import {
	getAllShippers,
	getShipperById,
	updateShipper,
	deleteShipper,
} from "@/services/shipper.service";
import AppError from "@/utils/AppError";

const shipperHandler = new Hono();

// Get all shippers
shipperHandler.get("/", async (c) => {
	try {
		const shippers = await getAllShippers();
		return c.json(shippers);
	} catch (error) {
		throw new AppError(
			"Erreur lors de la récupération des livreurs",
			500,
			error as Error
		);
	}
});

// Get shipper by id
shipperHandler.get("/:shipperId", async (c) => {
	const { shipperId } = c.req.param();
	try {
		const shipper = await getShipperById(shipperId);
		if (!shipper) {
			throw new AppError(
				"Ce livreur n'existe pas",
				404,
				new Error("Shipper not found")
			);
		}
		return c.json(shipper);
	} catch (error) {
		if (error instanceof AppError) {
			throw error;
		}
		throw new AppError("Une erreur est survenue", 500, error as Error);
	}
});

// Update shipper
const UpdateShipperDTO = z.object({
	firstName: z.string().optional(),
	lastName: z.string().optional(),
	password: z
		.string()
		.optional()
		.transform((val) => (val ? Bun.password.hash(val) : undefined)),
	email: z.string().email().optional(),
	phone: z.string().optional(),
	pictureUrl: z.string().url().optional(),
	isOnline: z.boolean().optional(),
});

shipperHandler.put(
	"/:shipperId",
	zValidator("json", UpdateShipperDTO),
	async (c) => {
		const { shipperId } = c.req.param();
		const updateData = c.req.valid("json");

		try {
			const updatedShipper = await updateShipper(shipperId, updateData);
			return c.json(updatedShipper);
		} catch (error) {
			if (
				error instanceof Error &&
				error.message === "Ce livreur n'existe pas"
			) {
				throw new AppError("Ce livreur n'existe pas", 404, error);
			}
			throw new AppError("Une erreur est survenue", 500, error as Error);
		}
	}
);

// Delete shipper
shipperHandler.delete("/:shipperId", async (c) => {
	const { shipperId } = c.req.param();

	try {
		await deleteShipper(shipperId);
		return c.json({ message: "Livreur supprimé avec succès" });
	} catch (error) {
		if (
			error instanceof Error &&
			error.message === "Ce livreur n'existe pas"
		) {
			throw new AppError("Ce livreur n'existe pas", 404, error);
		}
		throw new AppError("Une erreur est survenue", 500, error as Error);
	}
});

export default shipperHandler;
