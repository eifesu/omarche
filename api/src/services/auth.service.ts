import { ENV } from "@/config/constants";
import {
	insertAdmin,
	insertAgent,
	insertShipper,
	insertUser,
	selectAdminByEmail,
	selectAgentByPhone,
	selectShipperByPhone,
	selectUserByPhone,
} from "../repositories/auth.repository";
import jwt from "jsonwebtoken";
import { Admin, Agent, area_code, Shipper, User } from "@prisma/client";
import AppError from "@/utils/AppError";

export type LoginDTO = {
	phone: string;
	password: string;
};

export async function postLoginUser(params: LoginDTO): Promise<{
	data: User;
	token: string;
}> {
	try {
		let user = await selectUserByPhone(params.phone);
		if (!user) {
			throw new AppError("Téléphone/mot de passe incorrect", 401, new Error("User not found"));
		}

		const isMatch = await Bun.password.verify(
			params.password,
			user.password
		);
		if (!isMatch) {
			throw new AppError("Téléphone/mot de passe incorrect", 401, new Error("Invalid password"));
		}

		const token = jwt.sign({ userId: user.userId }, ENV.JWT_SECRET, {
			expiresIn: ENV.JWT_EXPIRES_IN,
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
			phone: params.phone,
			password: password,
			firstName: params.firstName,
			lastName: params.lastName,
			address: params.address,
		});
	} catch (error) {
		if (error instanceof AppError) throw error;
		throw new AppError("Erreur lors de l'inscription", 500, error as Error);
	}
}

export type AgentLoginDTO = {
	phone: string;
	password: string;
};

export type AgentRegisterDTO = {
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
			phone: params.phone,
			password: hashedPassword,
			firstName: params.firstName,
			lastName: params.lastName,
			marketId: params.marketId,
		});
		return { ...agent, password: "" };
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
		let agent = await selectAgentByPhone(params.phone);
		if (!agent) {
			throw new AppError("Téléphone/mot de passe incorrect", 401, new Error("Agent not found"));
		}

		const isMatch = await Bun.password.verify(
			params.password,
			agent.password
		);
		if (!isMatch) {
			throw new AppError("Téléphone/mot de passe incorrect", 401, new Error("Invalid password"));
		}

		const token = jwt.sign({ agentId: agent.agentId }, ENV.JWT_SECRET, {
			expiresIn: ENV.JWT_EXPIRES_IN,
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
	phone: string;
	password: string;
};

export type ShipperRegisterDTO = {
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
			phone: params.phone,
			password: hashedPassword,
			firstName: params.firstName,
			lastName: params.lastName,
			marketId: params.marketId,
		});
		return { ...shipper, password: "" };
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
		let shipper = await selectShipperByPhone(params.phone);
		if (!shipper) {
			throw new AppError("Téléphone/mot de passe incorrect", 401, new Error("Shipper not found"));
		}

		const isMatch = await Bun.password.verify(
			params.password,
			shipper.password
		);
		if (!isMatch) {
			throw new AppError("Téléphone/mot de passe incorrect", 401, new Error("Invalid password"));
		}

		const token = jwt.sign(
			{ shipperId: shipper.shipperId },
			ENV.JWT_SECRET,
			{
				expiresIn: ENV.JWT_EXPIRES_IN,
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

export type AdminLoginDTO = {
	email: string;
	password: string;
};

export type AdminRegisterDTO = {
	email: string;
	password: string;
	areaCode: area_code;
};

export async function postLoginAdmin(params: AdminLoginDTO): Promise<{
	data: Admin;
	token: string;
}> {
	try {
		const admin = await selectAdminByEmail(params.email);
		if (!admin) {
			throw new AppError("E-mail/mot de passe incorrect", 401, new Error("Admin not found"));
		}

		const isMatch = await Bun.password.verify(
			params.password,
			admin.password
		);
		if (!isMatch) {
			throw new AppError("E-mail/mot de passe incorrect", 401, new Error("Invalid password"));
		}

		const token = jwt.sign({ adminId: admin.adminId }, ENV.JWT_SECRET, {
			expiresIn: ENV.JWT_EXPIRES_IN,
		});

		return {
			data: { ...admin, password: "" },
			token: token,
		};
	} catch (error) {
		if (error instanceof AppError) throw error;
		throw new AppError("Erreur lors de la connexion", 500, error as Error);
	}
}

export async function postRegisterAdmin(params: AdminRegisterDTO): Promise<Admin> {
	try {
		const hashedPassword = await Bun.password.hash(params.password);
		const admin = await insertAdmin({
			email: params.email,
			password: hashedPassword,
			areaCode: params.areaCode,
		});
		return admin;
	} catch (error) {
		if (error instanceof AppError) throw error;
		throw new AppError("Erreur lors de l'enregistrement", 500, error as Error);
	}
}
