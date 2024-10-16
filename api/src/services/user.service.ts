import {
	selectAllUsers,
	selectUserById,
	updateUserById,
	deleteUserById,
} from "@/repositories/user.repository";
import { Order, User } from "@prisma/client";
import { selectOrdersByUserId } from "@/repositories/order.repository";

export async function getAllUsers(): Promise<User[]> {
	return selectAllUsers();
}

export async function getUserById(userId: string): Promise<User | null> {
	return selectUserById(userId);
}

export async function updateUser(
	userId: string,
	data: Partial<User>
): Promise<User> {
	const existingUser = await selectUserById(userId);
	if (!existingUser) {
		throw new Error("User not found");
	}

	return updateUserById(userId, data);
}

export async function deleteUser(userId: string): Promise<void> {
	const existingUser = await selectUserById(userId);
	if (!existingUser) {
		throw new Error("User not found");
	}

	await deleteUserById(userId);
}

export async function getOrdersByUserId(userId: string): Promise<Order[]> {
	const orders = await selectOrdersByUserId(userId);
	return orders;
}
