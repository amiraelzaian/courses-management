import { z } from "zod";

// Params: /courses/:courseId/enrollments
export const courseIdParamSchema = z.object({
    courseId: z.uuid("Invalid course id")
})

// Params: /courses/:courseId/enrollments/:id
export const enrollmentIdParamsSchema = z.object({
    courseId: z.uuid("Invalid course id"),
    id: z.uuid("Invalid enrollment id"),
});

// Create: userId in the body is TEMPORARY (until auth is added)
export const createEnrollmentSchema = z.object({
    userId: z.uuid("Invalid user id"),
    progress: z
        .number()
        .min(0, "Progress cannot be less than 0")
        .max(100, "Progress cannot be more than 100").optional()
});

// Update: only progress can change (0 to 100)
export const updateEnrollmentSchema = createEnrollmentSchema.partial();

export type CreateEnrollmentInput = z.infer<typeof createEnrollmentSchema>;
export type UpdateEnrollmentInput = z.infer<typeof updateEnrollmentSchema>;









