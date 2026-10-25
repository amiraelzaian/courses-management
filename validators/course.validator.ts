import { z } from 'zod'
import { Level } from '../generated/prisma/enums.js'


export const CreateCourseSchema = z.object({
    title: z.string().trim().min(3, "Title is must be at least 3 characters"),
    description: z.string().trim().min(10, "Descrition is must be at least 10 characters"),
    price: z.number().min(0, "Price can not be negative"),
    level: z.enum(Level),
    isPublished: z.boolean().optional(),
    instructorId: z.uuid("Invalid instructor id"),
    categoryId: z.uuid("Invalid category id"),
})


export const updateCourseSchema = CreateCourseSchema.partial();

export const courseIdParamSchema = z.object({
    id: z.uuid("Invalid course id")
})

export type CreateCourseInput = z.infer<typeof CreateCourseSchema>
export type UpdateCourseInput = z.infer<typeof updateCourseSchema>







