import { Agent, Shipper, User } from "@prisma/client";
import prisma from "@prisma/index";

export async function selectUserByEmail(email: string): Promise<User | null> {
	return await prisma.user.findFirst({
		where: {
			email,
		},
	});
}

export async function insertUser(params: {
	email: string;
	password: string;
	firstName: string;
	lastName: string;
	address: string;
	phone: string;
}): Promise<User> {
	return await prisma.user.create({
		data: {
			email: params.email,
			password: params.password,
			firstName: params.firstName,
			lastName: params.lastName,
			address: params.address,
			phone: params.phone,
		},
	});
}
export async function selectAgentByEmail(email: string): Promise<Agent | null> {
	return await prisma.agent.findFirst({
		where: {
			email,
		},
	});
}
export async function insertAgent(params: {
	email: string;
	password: string;
	firstName: string;
	lastName: string;
	phone: string;
	marketId: string;
}): Promise<Agent> {
	return await prisma.agent.create({
		data: {
			email: params.email,
			password: params.password,
			firstName: params.firstName,
			lastName: params.lastName,
			phone: params.phone,
			marketId: params.marketId,
		},
	});
}

export async function selectShipperByEmail(
	email: string
): Promise<Shipper | null> {
	return await prisma.shipper.findFirst({
		where: {
			email,
		},
	});
}

export async function insertShipper(params: {
	email: string;
	password: string;
	firstName: string;
	lastName: string;
	phone: string;
	marketId: string;
}): Promise<Shipper> {
	return await prisma.shipper.create({
		data: {
			email: params.email,
			password: params.password,
			firstName: params.firstName,
			lastName: params.lastName,
			phone: params.phone,
			marketId: params.marketId,
		},
	});
}
