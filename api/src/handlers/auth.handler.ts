import { Hono } from "hono";
import {
	postLoginUser,
	postRegisterUser,
	postLoginAgent,
	postRegisterAgent,
	postLoginShipper,
	postRegisterShipper,
	postLoginAdmin,
	postRegisterAdmin,
} from "../services/auth.service";
import { z } from "zod";
import { zValidator } from "@hono/zod-validator";

const UserLoginDTO = z.object({
	phone: z.string(),
	password: z.string(),
});

const UserRegisterDTO = z.object({
	phone: z.string(),
	password: z.string(),
	firstName: z.string(),
	lastName: z.string(),
	address: z.string(),
});

const AgentLoginDTO = z.object({
	phone: z.string(),
	password: z.string(),
});

const AgentRegisterDTO = z.object({
	phone: z.string(),
	password: z.string(),
	firstName: z.string(),
	lastName: z.string(),
	marketId: z.string().uuid(),
});

const ShipperLoginDTO = z.object({
	phone: z.string(),
	password: z.string(),
});

const ShipperRegisterDTO = z.object({
	phone: z.string(),
	password: z.string(),
	firstName: z.string(),
	lastName: z.string(),
	marketId: z.string().uuid(),
});

const AdminLoginDTO = z.object({
	email: z.string(),
	password: z.string(),
});

const AdminRegisterDTO = z.object({
	email: z.string(),
	password: z.string(),
	areaCode: z.string(),
});

const authHandler = new Hono();

authHandler.post("/user/login", zValidator("json", UserLoginDTO), async (c) => {
	const { phone, password } = c.req.valid("json");
	const body = await postLoginUser({ phone, password });
	return c.json(body);
});

authHandler.post(
	"/user/register",
	zValidator("json", UserRegisterDTO),
	async (c) => {
		const { phone, password, firstName, lastName, address } =
			c.req.valid("json");
		await postRegisterUser({
			phone,
			password,
			firstName,
			lastName,
			address,
		});
		return c.json("Enregistrement réussi");
	}
);

authHandler.post(
	"/agent/login",
	zValidator("json", AgentLoginDTO),
	async (c) => {
		const { phone, password } = c.req.valid("json");
		const body = await postLoginAgent({ phone, password });
		return c.json(body);
	}
);

authHandler.post(
	"/agent/register",
	zValidator("json", AgentRegisterDTO),
	async (c) => {
		const { phone, password, firstName, lastName, marketId } =
			c.req.valid("json");
		const body = await postRegisterAgent({
			phone,
			password,
			firstName,
			lastName,
			marketId,
		});
		return c.json(body);
	}
);

authHandler.post(
	"/shipper/login",
	zValidator("json", ShipperLoginDTO),
	async (c) => {
		const { phone, password } = c.req.valid("json");
		const body = await postLoginShipper({ phone, password });
		return c.json(body);
	}
);

authHandler.post(
	"/shipper/register",
	zValidator("json", ShipperRegisterDTO),
	async (c) => {
		const { phone, password, firstName, lastName, marketId } =
			c.req.valid("json");
		const body = await postRegisterShipper({
			phone,
			password,
			firstName,
			lastName,
			marketId,
		});
		return c.json(body);
	}
);

authHandler.post("/admin/login", zValidator("json", AdminLoginDTO), async (c) => {
	const data = await c.req.json();
	const response = await postLoginAdmin(data);
	return c.json(response);
});

authHandler.post("/admin/register", zValidator("json", AdminRegisterDTO), async (c) => {
	const data = await c.req.json();
	const response = await postRegisterAdmin(data);
	return c.json(response);
});


export default authHandler;
