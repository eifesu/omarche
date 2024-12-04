import { ENV } from "@/config/constants";
import {
	insertAgent,
	insertShipper,
	insertUser,
	selectAgentByEmail,
	selectShipperByEmail,
	selectUserByEmail,
} from "../repositories/auth.repository";
import jwt from "jsonwebtoken";
import { Agent, Shipper, User } from "@prisma/client";
import AppError from "@/utils/AppError";

export type LoginDTO = {
	email: string;
	password: string;
};

export async function postLoginUser(params: LoginDTO): Promise<{
	data: User;
	token: string;
}> {
	try {
		let user = await selectUserByEmail(params.email);
		if (!user) {
			throw new AppError("E-mail/mot de passe incorrect", 401, new Error("User not found"));
		}

		const isMatch = await Bun.password.verify(
			params.password,
			user.password
		);
		if (!isMatch) {
			throw new AppError("E-mail/mot de passe incorrect", 401, new Error("Invalid password"));
		}

		const token = jwt.sign({ userID: user.userId }, ENV.JWT_SECRET, {
			expiresIn: "1h",
		});

		return {
			data: { ...user, password: "" },
			token: token,
		};
	} catch (error) {
		if (error instanceof AppError) throw error;
		throw new AppError("Erreur lors de la connexion", 500, error as Error);
	}
}

export type RegisterDTO = {
	email: string;
	password: string;
	firstName: string;
	lastName: string;
	address: string;
	phone: string;
};

export async function postRegisterUser(params: RegisterDTO): Promise<void> {
	try {
		const password = await Bun.password.hash(params.password);
		await insertUser({
			email: params.email,
			password: password,
			firstName: params.firstName,
			lastName: params.lastName,
			address: params.address,
			phone: params.phone,
		});
	} catch (error) {
		if (error instanceof AppError) throw error;
		throw new AppError("Erreur lors de l'inscription", 500, error as Error);
	}
}

export type AgentLoginDTO = {
	email: string;
	password: string;
};

export type AgentRegisterDTO = {
	email: string;
	password: string;
	firstName: string;
	lastName: string;
	phone: string;
	marketId: string;
};

export async function postRegisterAgent(
	params: AgentRegisterDTO
): Promise<Agent> {
	try {
		const hashedPassword = await Bun.password.hash(params.password);
		const agent = await insertAgent({
			email: params.email,
			password: hashedPassword,
			firstName: params.firstName,
			lastName: params.lastName,
			phone: params.phone,
			marketId: params.marketId,
		});
		return agent;
	} catch (error) {
		if (error instanceof AppError) throw error;
		throw new AppError("Erreur lors de l'inscription de l'agent", 500, error as Error);
	}
}

export async function postLoginAgent(params: AgentLoginDTO): Promise<{
	data: Agent;
	token: string;
}> {
	try {
		let agent = await selectAgentByEmail(params.email);
		if (!agent) {
			throw new AppError("E-mail/mot de passe incorrect", 401, new Error("Agent not found"));
		}

		const isMatch = await Bun.password.verify(
			params.password,
			agent.password
		);
		if (!isMatch) {
			throw new AppError("E-mail/mot de passe incorrect", 401, new Error("Invalid password"));
		}

		const token = jwt.sign({ agentID: agent.agentId }, ENV.JWT_SECRET, {
			expiresIn: "1h",
		});

		return {
			data: { ...agent, password: "" },
			token: token,
		};
	} catch (error) {
		if (error instanceof AppError) throw error;
		throw new AppError("Erreur lors de la connexion de l'agent", 500, error as Error);
	}
}

export type ShipperLoginDTO = {
	email: string;
	password: string;
};

export type ShipperRegisterDTO = {
	email: string;
	password: string;
	firstName: string;
	lastName: string;
	phone: string;
	marketId: string;
};

export async function postRegisterShipper(
	params: ShipperRegisterDTO
): Promise<Shipper> {
	try {
		const hashedPassword = await Bun.password.hash(params.password);
		const shipper = await insertShipper({
			email: params.email,
			password: hashedPassword,
			firstName: params.firstName,
			lastName: params.lastName,
			phone: params.phone,
			marketId: params.marketId,
		});
		return shipper;
	} catch (error) {
		if (error instanceof AppError) throw error;
		throw new AppError("Erreur lors de l'inscription du livreur", 500, error as Error);
	}
}

export async function postLoginShipper(params: ShipperLoginDTO): Promise<{
	data: Shipper;
	token: string;
}> {
	try {
		let shipper = await selectShipperByEmail(params.email);
		if (!shipper) {
			throw new AppError("E-mail/mot de passe incorrect", 401, new Error("Shipper not found"));
		}

		const isMatch = await Bun.password.verify(
			params.password,
			shipper.password
		);
		if (!isMatch) {
			throw new AppError("E-mail/mot de passe incorrect", 401, new Error("Invalid password"));
		}

		const token = jwt.sign(
			{ shipperID: shipper.shipperId },
			ENV.JWT_SECRET,
			{
				expiresIn: "1h",
			}
		);

		return {
			data: { ...shipper, password: "" },
			token: token,
		};
	} catch (error) {
		if (error instanceof AppError) throw error;
		throw new AppError("Erreur lors de la connexion du livreur", 500, error as Error);
	}
}
