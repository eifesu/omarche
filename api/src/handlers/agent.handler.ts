import { Hono } from "hono";
import prisma from "@prisma/index";
import { z } from "zod";
import { zValidator } from "@hono/zod-validator";
import { Prisma } from "@prisma/client";

const agentHandler = new Hono();

// Create agent
const CreateAgentDTO = z.object({
	firstName: z.string(),
	lastName: z.string(),
	email: z.string().email(),
	password: z.string(),
	phone: z.string(),
	marketId: z.string().uuid(),
});

agentHandler.post("/", zValidator("json", CreateAgentDTO), async (c) => {
	const agentData = c.req.valid("json");

	try {
		const hashedPassword = await Bun.password.hash(agentData.password);
		const newAgent = await prisma.agent.create({
			data: {
				...agentData,
				password: hashedPassword,
			},
		});

		return c.json({ ...newAgent, password: undefined }, 201);
	} catch (error) {
		if (error instanceof Prisma.PrismaClientKnownRequestError) {
			if (error.code === "P2002") {
				return c.json(
					{ error: "An agent with this email already exists" },
					400
				);
			}
		}
		return c.json({ error: "Failed to create agent" }, 500);
	}
});

// Get all agents
agentHandler.get("/", async (c) => {
	const agents = await prisma.agent.findMany();
	return c.json(agents);
});

// Get agent by id
agentHandler.get("/:agentId", async (c) => {
	const { agentId } = c.req.param();
	const agent = await prisma.agent.findUnique({
		where: { agentId },
	});

	if (!agent) {
		return c.json({ error: "Agent not found" }, 404);
	}

	return c.json(agent);
});

// Update agent
const UpdateAgentDTO = z.object({
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

agentHandler.put("/:agentId", zValidator("json", UpdateAgentDTO), async (c) => {
	const { agentId } = c.req.param();
	const updateData = c.req.valid("json");

	try {
		const updatedAgent = await prisma.agent.update({
			where: { agentId },
			data: updateData,
		});
		return c.json(updatedAgent);
	} catch (error) {
		return c.json({ error: "Failed to update agent" }, 500);
	}
});

// Delete agent
agentHandler.delete("/:agentId", async (c) => {
	const { agentId } = c.req.param();

	try {
		await prisma.agent.delete({
			where: { agentId },
		});
		return c.json({ message: "Agent deleted successfully" });
	} catch (error) {
		return c.json({ error: "Failed to delete agent" }, 500);
	}
});

export default agentHandler;
