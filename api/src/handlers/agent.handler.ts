import { Hono } from "hono";
import prisma from "@prisma/index";
import { z } from "zod";
import { zValidator } from "@hono/zod-validator";
import { Prisma } from "@prisma/client";
import AppError from "@/utils/AppError";
import { CreateAgentDTO, UpdateAgentDTO } from "@shared/types/api/agent.types";

const agentHandler = new Hono();

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
        throw new AppError(
          "Un agent avec cet email existe déjà",
          400,
          error
        );
      }
    }
    throw new AppError(
      "Erreur lors de la création de l'agent",
      500,
      error as Error
    );
  }
});

// Get all agents
agentHandler.get("/", async (c) => {
  try {
    const agents = await prisma.agent.findMany({});
    return c.json(agents);
  } catch (error) {
    throw new AppError(
      "Erreur lors de la récupération des agents",
      500,
      error as Error
    );
  }
});

// Get agent by id
agentHandler.get("/:agentId", async (c) => {
  const { agentId } = c.req.param();
  const agent = await prisma.agent.findUnique({
    where: { agentId },
  });

  if (!agent) {
    throw new AppError(
      "Agent non trouvé",
      404,
      new Error("Agent not found")
    );
  }

  return c.json(agent);
});

agentHandler.get("/:agentId/orders", async (c) => {
  const { agentId } = c.req.param();
  try {
    const orders = await prisma.order.findMany({
      where: { agentId },
    });
    return c.json(orders);
  } catch (error) {
    throw new AppError(
      "Erreur lors de la récupération des commandes de l'agent",
      500,
      error as Error
    );
  }
});

// Update agent

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
    console.error("Error updating agent:", error);
    throw new AppError(
      "Erreur lors de la mise à jour de l'agent",
      500,
      error as Error
    );
  }
});

// Delete agent
agentHandler.delete("/:agentId", async (c) => {
  const { agentId } = c.req.param();

  try {
    await prisma.agent.delete({
      where: { agentId },
    });
    return c.json({ message: "Agent supprimé avec succès" });
  } catch (error) {
    throw new AppError(
      "Erreur lors de la suppression de l'agent",
      500,
      error as Error
    );
  }
});

export default agentHandler;
