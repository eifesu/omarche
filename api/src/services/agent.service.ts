import {
	selectAllAgents,
	selectAgentById,
	updateAgentById,
	deleteAgentById,
} from "@/repositories/agent.repository";
import { Agent } from "@prisma/client";
import AppError from "@/utils/AppError";

export async function getAllAgents(): Promise<Agent[]> {
	try {
		return await selectAllAgents();
	} catch (error) {
		throw new AppError("Erreur lors de la récupération des agents", 500, error as Error);
	}
}

export async function getAgentById(agentId: string): Promise<Agent | null> {
	try {
		const agent = await selectAgentById(agentId);
		if (!agent) {
			throw new AppError("Agent introuvable", 404, new Error(`Agent with ID ${agentId} not found`));
		}
		return agent;
	} catch (error) {
		if (error instanceof AppError) throw error;
		throw new AppError("Erreur lors de la récupération de l'agent", 500, error as Error);
	}
}

export async function updateAgent(
	agentId: string,
	data: Partial<Agent>
): Promise<Agent> {
	try {
		const existingAgent = await selectAgentById(agentId);
		if (!existingAgent) {
			throw new AppError("Agent introuvable", 404, new Error(`Agent with ID ${agentId} not found`));
		}

		const updatedAgent = await updateAgentById(agentId, data);
		return updatedAgent;
	} catch (error) {
		if (error instanceof AppError) throw error;
		throw new AppError("Erreur lors de la mise à jour de l'agent", 500, error as Error);
	}
}

export async function deleteAgent(agentId: string): Promise<void> {
	try {
		const existingAgent = await selectAgentById(agentId);
		if (!existingAgent) {
			throw new AppError("Agent introuvable", 404, new Error(`Agent with ID ${agentId} not found`));
		}

		await deleteAgentById(agentId);
	} catch (error) {
		if (error instanceof AppError) throw error;
		throw new AppError("Erreur lors de la suppression de l'agent", 500, error as Error);
	}
}
