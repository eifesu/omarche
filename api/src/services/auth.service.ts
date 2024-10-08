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
			throw new Error("E-mail/mot de passe incorrect");
		}

		const isMatch = await Bun.password.verify(
			params.password,
			user.password
		);
		if (!isMatch) {
			throw new Error("E-mail/mot de passe incorrect");
		}

		const token = jwt.sign({ userID: user.userId }, ENV.JWT_SECRET, {
			expiresIn: "1h",
		});

		return {
			data: { ...user, password: "" },
			token: token,
		};
	} catch (error) {
		const err = error as Error;
		throw new Error(err.message);
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
		console.error(error);
		const err = error as Error;
		throw new Error(err.message);
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
		const err = error as Error;
		throw new Error(err.message);
	}
}

export async function postLoginAgent(params: AgentLoginDTO): Promise<{
	data: Agent;
	token: string;
}> {
	try {
		let agent = await selectAgentByEmail(params.email); // Implement getAgentByEmail function
		if (!agent) {
			throw new Error("E-mail/mot de passe incorrect");
		}

		const isMatch = await Bun.password.verify(
			params.password,
			agent.password
		);
		if (!isMatch) {
			throw new Error("E-mail/mot de passe incorrect");
		}

		const token = jwt.sign({ agentID: agent.agentId }, ENV.JWT_SECRET, {
			expiresIn: "1h",
		});

		return {
			data: { ...agent, password: "" },
			token: token,
		};
	} catch (error) {
		const err = error as Error;
		throw new Error(err.message);
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
		const err = error as Error;
		throw new Error(err.message);
	}
}

export async function postLoginShipper(params: ShipperLoginDTO): Promise<{
	data: Shipper;
	token: string;
}> {
	try {
		let shipper = await selectShipperByEmail(params.email);
		if (!shipper) {
			throw new Error("E-mail/mot de passe incorrect");
		}

		const isMatch = await Bun.password.verify(
			params.password,
			shipper.password
		);
		if (!isMatch) {
			throw new Error("E-mail/mot de passe incorrect");
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
		const err = error as Error;
		throw new Error(err.message);
	}
}
