import prisma from "@prisma/index";
import { User } from "@prisma/client";

export async function selectAllUsers(): Promise<User[]> {
	return prisma.user.findMany();
}

export async function selectUserById(userId: string): Promise<User | null> {
	return prisma.user.findUnique({
		where: { userId },
	});
}

export async function updateUserById(
	userId: string,
	data: Partial<User>
): Promise<User> {
	return prisma.user.update({
		where: { userId },
		data,
	});
}

export async function deleteUserById(userId: string): Promise<void> {
	await prisma.user.delete({
		where: { userId },
	});
}
