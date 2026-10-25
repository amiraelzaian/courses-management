import { z } from "zod";
import { Role } from "../generated/prisma/client.js";

export const createUserSchema = z.object({
    name: z.string().trim().min(2, "Name must be at least 2 characters"),
    email: z.string().trim().toLowerCase().pipe(z.email("Invalid email")),
    password: z.string().min(6, "Password must be at least 6 characters"),
    role: z.enum(Role).optional(),
});

export const updateUserSchema = createUserSchema
    .omit({ password: true })
    .partial();

export const userIdParamSchema = z.object({
    id: z.uuid("Invalid user id"),
});

export type CreateUserInput = z.infer<typeof createUserSchema>;
export type UpdateUserInput = z.infer<typeof updateUserSchema>;