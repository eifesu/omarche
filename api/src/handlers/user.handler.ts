import { Hono } from "hono";
import { z } from "zod";
import { zValidator } from "@hono/zod-validator";
import {
	getAllUsers,
	getUserById,
	updateUser,
	deleteUser,
	getOrdersByUserId,
} from "@/services/user.service";
import AppError from "@/utils/AppError";
import { getGiftCardByUserId } from "@/services/giftcard.service";

const userHandler = new Hono();

// GET all users
userHandler.get("/", async (c) => {
	try {
		const users = await getAllUsers();
		return c.json(users);
	} catch (error) {
		throw new AppError(
			"Erreur lors de la récupération des utilisateurs",
			500,
			error as Error
		);
	}
});

// GET user by ID
userHandler.get("/:userId", async (c) => {
	const { userId } = c.req.param();
	try {
		const user = await getUserById(userId);
		if (!user) {
			throw new AppError(
				"Cet utilisateur n'existe pas",
				404,
				new Error("User not found")
			);
		}
		return c.json(user);
	} catch (error) {
		if (error instanceof AppError) {
			throw error;
		}
		throw new AppError("Une erreur est survenue", 500, error as Error);
	}
});

const UpdateUserDTO = z.object({
	firstName: z.string().optional(),
	lastName: z.string().optional(),
	email: z.string().email().optional(),
	password: z.string().optional(),
	city: z.string().optional(),
	address: z.string().optional(),
	phone: z.string().optional(),
});

// PUT update a user
userHandler.put("/:userId", zValidator("json", UpdateUserDTO), async (c) => {
	const { userId } = c.req.param();
	const updateData = c.req.valid("json");

	try {
		const updatedUser = await updateUser(userId, updateData);
		return c.json(updatedUser);
	} catch (error) {
		if (
			error instanceof Error &&
			error.message === "Cet utilisateur n'existe pas"
		) {
			throw new AppError("Cet utilisateur n'existe pas", 404, error);
		}
		throw new AppError(
			"Une erreur est survenue lors de la mise à jour de l'utilisateur",
			500,
			error as Error
		);
	}
});

// DELETE a user
userHandler.delete("/:userId", async (c) => {
	const { userId } = c.req.param();

	try {
		await deleteUser(userId);
		return c.json({ message: "Utilisateur supprimé avec succès" });
	} catch (error) {
		if (
			error instanceof Error &&
			error.message === "Cet utilisateur n'existe pas"
		) {
			throw new AppError("Cet utilisateur n'existe pas", 404, error);
		}
		throw new AppError(
			"Une erreur est survenue lors de la suppression de l'utilisateur",
			500,
			error as Error
		);
	}
});

userHandler.get("/:userId/orders", async (c) => {
	const { userId } = c.req.param();
	try {
		const orders = await getOrdersByUserId(userId);
		return c.json(orders);
	} catch (error) {
		throw new AppError(
			"Une erreur est survenue lors de la récupération des commandes de l'utilisateur",
			500,
			error as Error
		);
	}
});

userHandler.get("/:userId/gift-card", async (c) => {
	const { userId } = c.req.param();
	try {
		const giftCard = await getGiftCardByUserId(userId);
		return c.json(giftCard);
	} catch (error) {
		throw new AppError(
			"Une erreur est survenue lors de la récupération de la carte de fidélité de l'utilisateur",
			500,
			error as Error
		);
	}
});

export default userHandler;
