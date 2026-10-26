import { z } from "zod";


export const LessonIdParamsSchema = z.object({
    id: z.uuid("Invalid lesson id"),
    sectionId: z.uuid("Invalid section id"),
    courseId: z.uuid("Invalid course id"),

});
export const CourseSectionIdPramsSchema = z.object({
    sectionId: z.uuid("Invalid section id"),
    courseId: z.uuid("Invalid course id"),

});

export const createLessonSchema = z.object({
    title: z.string().trim().min(2, "Title must be at least 2 characters"),
    order: z.number().int().min(1),
    content: z.string().min(10, 'Lessont must be at least 10'),

});

export const updateLessonSchema = createLessonSchema.partial();

export type CreateLessonInput = z.infer<typeof createLessonSchema>;
export type UpdateLessonInput = z.infer<typeof updateLessonSchema>;