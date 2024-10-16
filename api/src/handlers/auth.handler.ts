import { Hono } from "hono";
import {
	postLoginUser,
	postRegisterUser,
	postLoginAgent,
	postRegisterAgent,
	postLoginShipper,
	postRegisterShipper,
} from "../services/auth.service";
import { z } from "zod";
import { zValidator } from "@hono/zod-validator";

const UserLoginDTO = z.object({
	email: z.string(),
	password: z.string(),
});

const UserRegisterDTO = z.object({
	email: z.string(),
	password: z.string(),
	firstName: z.string(),
	lastName: z.string(),
	address: z.string(),
	phone: z.string(),
});

const AgentLoginDTO = z.object({
	email: z.string(),
	password: z.string(),
});

const AgentRegisterDTO = z.object({
	email: z.string(),
	password: z.string(),
	firstName: z.string(),
	lastName: z.string(),
	phone: z.string(),
	marketId: z.string().uuid(),
});

const ShipperLoginDTO = z.object({
	email: z.string(),
	password: z.string(),
});

const ShipperRegisterDTO = z.object({
	email: z.string(),
	password: z.string(),
	firstName: z.string(),
	lastName: z.string(),
	phone: z.string(),
	marketId: z.string().uuid(),
});

const authHandler = new Hono();

authHandler.post("/user/login", zValidator("json", UserLoginDTO), async (c) => {
	const { email, password } = c.req.valid("json");
	const body = await postLoginUser({ email, password });
	return c.json(body);
});

authHandler.post(
	"/user/register",
	zValidator("json", UserRegisterDTO),
	async (c) => {
		const { email, password, firstName, lastName, address, phone } =
			c.req.valid("json");
		await postRegisterUser({
			email,
			password,
			firstName,
			lastName,
			address,
			phone,
		});
		return c.json("Enregistrement réussi");
	}
);

authHandler.post(
	"/agent/login",
	zValidator("json", AgentLoginDTO),
	async (c) => {
		const { email, password } = c.req.valid("json");
		const body = await postLoginAgent({ email, password });
		return c.json(body);
	}
);

authHandler.post(
	"/agent/register",
	zValidator("json", AgentRegisterDTO),
	async (c) => {
		const { email, password, firstName, lastName, phone, marketId } =
			c.req.valid("json");
		await postRegisterAgent({
			email,
			password,
			firstName,
			lastName,
			phone,
			marketId,
		});
		return c.json("Enregistrement réussi");
	}
);

authHandler.post(
	"/shipper/login",
	zValidator("json", ShipperLoginDTO),
	async (c) => {
		const { email, password } = c.req.valid("json");
		const body = await postLoginShipper({ email, password });
		return c.json(body);
	}
);

authHandler.post(
	"/shipper/register",
	zValidator("json", ShipperRegisterDTO),
	async (c) => {
		const { email, password, firstName, lastName, phone, marketId } =
			c.req.valid("json");
		await postRegisterShipper({
			email,
			password,
			firstName,
			lastName,
			phone,
			marketId,
		});
		return c.json("Enregistrement réussi");
	}
);

export default authHandler;
