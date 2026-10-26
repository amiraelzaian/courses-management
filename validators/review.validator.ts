import { z } from "zod";

export const courseIdParamsSchema = z.object({
    courseId: z.uuid("Invalid course id"),
});

export const reviewIdParamsSchema = z.object({
    courseId: z.uuid("Invalid course id"),
    id: z.uuid("Invalid section id"),
});

// int that conroller we will enter the user id manually untill add auth layer
export const createReviewSchema = z.object({
    rating: z.int().min(0, 'rating must be at least 0').max(5, 'rating must be at least 5'),
    comment: z.string().optional(),
    userId: z.uuid("Invalid user id")

});

export const updateReviewSchema = createReviewSchema.partial();

export type CreateReviewInput = z.infer<typeof createReviewSchema>;
export type UpdateReviewInput = z.infer<typeof updateReviewSchema>;