import { z } from 'zod';

// Base login schema that's shared between all roles
const BaseLoginDTO = z.object({
    email: z.string().email(),
    password: z.string().min(6),
});

// Base register schema that's shared between all roles
const BaseRegisterDTO = BaseLoginDTO.extend({
    firstName: z.string(),
    lastName: z.string(),
    phone: z.string(),
});

// User DTOs
export const UserLoginDTO = BaseLoginDTO;
export const UserRegisterDTO = BaseRegisterDTO.extend({
    address: z.string(),
});

// Agent DTOs
export const AgentLoginDTO = BaseLoginDTO;
export const AgentRegisterDTO = BaseRegisterDTO.extend({
    marketId: z.string().uuid(),
});

// Shipper DTOs
export const ShipperLoginDTO = BaseLoginDTO;
export const ShipperRegisterDTO = BaseRegisterDTO.extend({
    vehicleType: z.string(),
    vehiclePlate: z.string(),
});

// Admin DTOs
export const AdminLoginDTO = BaseLoginDTO;
export const AdminRegisterDTO = BaseRegisterDTO;

// Response types
export const AuthResponseSchema = z.object({
    token: z.string(),
    user: z.object({
        id: z.string(),
        email: z.string().email(),
        firstName: z.string(),
        lastName: z.string(),
        role: z.enum(['USER', 'AGENT', 'SHIPPER', 'ADMIN']),
    }),
});

// Type definitions
export type UserLogin = z.infer<typeof UserLoginDTO>;
export type UserRegister = z.infer<typeof UserRegisterDTO>;
export type AgentLogin = z.infer<typeof AgentLoginDTO>;
export type AgentRegister = z.infer<typeof AgentRegisterDTO>;
export type ShipperLogin = z.infer<typeof ShipperLoginDTO>;
export type ShipperRegister = z.infer<typeof ShipperRegisterDTO>;
export type AdminLogin = z.infer<typeof AdminLoginDTO>;
export type AdminRegister = z.infer<typeof AdminRegisterDTO>;
export type AuthResponse = z.infer<typeof AuthResponseSchema>;
