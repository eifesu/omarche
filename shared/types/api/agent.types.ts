import { z } from 'zod';

export const AgentSchema = z.object({
    agentId: z.string().uuid(),
    firstName: z.string(),
    lastName: z.string(),
    email: z.string().email(),
    phone: z.string(),
    marketId: z.string().uuid(),
    createdAt: z.date(),
    updatedAt: z.date()
});

// Create Agent DTO
export const CreateAgentDTO = z.object({
    firstName: z.string(),
    lastName: z.string(),
    email: z.string().email(),
    password: z.string(),
    phone: z.string(),
    marketId: z.string().uuid(),
});

// Update Agent DTO
export const UpdateAgentDTO = z.object({
    firstName: z.string().optional(),
    lastName: z.string().optional(),
    email: z.string().email().optional(),
    phone: z.string().optional(),
    marketId: z.string().uuid().optional(),
});

// Type definitions
export type Agent = z.infer<typeof AgentSchema>;
export type CreateAgent = z.infer<typeof CreateAgentDTO>;
export type UpdateAgent = z.infer<typeof UpdateAgentDTO>;
