import { Hono } from "hono";
import prisma from "@prisma/index";
import { z } from "zod";
import { zValidator } from "@hono/zod-validator";
import { Prisma } from "@prisma/client";
import { password } from "bun";

const shipperHandler = new Hono();

// Create shipper
const CreateShipperDTO = z.object({
	firstName: z.string(),
	lastName: z.string(),
	email: z.string().email(),
	password: z.string(),
	phone: z.string(),
	marketId: z.string().uuid(),
});

shipperHandler.post("/", zValidator("json", CreateShipperDTO), async (c) => {
	const shipperData = c.req.valid("json");

	try {
		const hashedPassword = await Bun.password.hash(shipperData.password);
		const newShipper = await prisma.shipper.create({
			data: {
				...shipperData,
				password: hashedPassword,
			},
		});

		return c.json({ ...newShipper, password: undefined }, 201);
	} catch (error) {
		if (error instanceof Prisma.PrismaClientKnownRequestError) {
			if (error.code === "P2002") {
				return c.json(
					{ error: "A shipper with this email already exists" },
					400
				);
			}
		}
		return c.json({ error: "Failed to create shipper" }, 500);
	}
});

// Get all shippers
shipperHandler.get("/", async (c) => {
	const shippers = await prisma.shipper.findMany();
	return c.json(shippers);
});

// Get shipper by id
shipperHandler.get("/:shipperId", async (c) => {
	const { shipperId } = c.req.param();
	const shipper = await prisma.shipper.findUnique({
		where: { shipperId },
	});

	if (!shipper) {
		return c.json({ error: "Shipper not found" }, 404);
	}

	return c.json(shipper);
});

// Update shipper
const UpdateShipperDTO = z.object({
	firstName: z.string().optional(),
	lastName: z.string().optional(),
	password: z
		.string()
		.optional()
		.transform((val) => (val ? Bun.password.hashSync(val) : undefined)),
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
			const updatedShipper = await prisma.shipper.update({
				where: { shipperId },
				data: updateData,
			});
			return c.json(updatedShipper);
		} catch (error) {
			return c.json({ error: "Failed to update shipper" }, 500);
		}
	}
);

// Delete shipper
shipperHandler.delete("/:shipperId", async (c) => {
	const { shipperId } = c.req.param();

	try {
		await prisma.shipper.delete({
			where: { shipperId },
		});
		return c.json({ message: "Shipper deleted successfully" });
	} catch (error) {
		return c.json({ error: "Failed to delete shipper" }, 500);
	}
});

export default shipperHandler;
