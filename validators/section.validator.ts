import { z } from "zod";

export const courseIdParamsSchema = z.object({
    courseId: z.uuid("Invalid course id"),
});

export const sectionIdParamsSchema = z.object({
    courseId: z.uuid("Invalid course id"),
    id: z.uuid("Invalid section id"),
});

export const createSectionSchema = z.object({
    title: z.string().trim().min(2, "Title must be at least 2 characters"),
    order: z.number().int().min(1),
});

export const updateSectionSchema = createSectionSchema.partial();

export type CreateSectionInput = z.infer<typeof createSectionSchema>;
export type UpdateSectionInput = z.infer<typeof updateSectionSchema>;