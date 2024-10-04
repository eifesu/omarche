import {
	selectAllAgents,
	selectAgentById,
	updateAgentById,
	deleteAgentById,
} from "@/repositories/agent.repository";
import { Agent } from "@prisma/client";

export async function getAllAgents(): Promise<Agent[]> {
	return selectAllAgents();
}

export async function getAgentById(agentId: string): Promise<Agent | null> {
	return selectAgentById(agentId);
}

export async function updateAgent(
	agentId: string,
	data: Partial<Agent>
): Promise<Agent> {
	const existingAgent = await selectAgentById(agentId);
	if (!existingAgent) {
		throw new Error("Agent not found");
	}

	const updatedAgent = await updateAgentById(agentId, data);
	return updatedAgent;
}

export async function deleteAgent(agentId: string): Promise<void> {
	const existingAgent = await selectAgentById(agentId);
	if (!existingAgent) {
		throw new Error("Agent not found");
	}

	await deleteAgentById(agentId);
}
