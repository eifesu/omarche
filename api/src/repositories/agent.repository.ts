import prisma from "@prisma/index";
import { Agent } from "@prisma/client";

export async function selectAllAgents(): Promise<Agent[]> {
	return prisma.agent.findMany();
}

export async function selectAgentById(agentId: string): Promise<Agent | null> {
	return prisma.agent.findUnique({
		where: { agentId },
	});
}

export async function updateAgentById(
	agentId: string,
	data: Partial<Agent>
): Promise<Agent> {
	return prisma.agent.update({
		where: { agentId },
		data,
	});
}

export async function deleteAgentById(agentId: string): Promise<void> {
	await prisma.agent.delete({
		where: { agentId },
	});
}
