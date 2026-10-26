import type { Request, Response } from "express";
import { Prisma } from "../generated/prisma/client.js";
import { prisma } from "../prisma.js";
import { ApiError } from "../utils/apiError.js";

import type { CreateLessonInput, UpdateLessonInput } from "../validators/lesson.validator.js";

export const createLesson = async (req: Request, res: Response): Promise<void> => {
    //const courseId = String(req.params["courseId"]);
    const sectionId = String(req.params["sectionId"]);
    const { title, order, content } = req.body as CreateLessonInput;

    const lesson = await prisma.lesson.create({
        data: { title, order, content, sectionId },
    });

    res.status(201).json({
        success: true,
        message: "lesson created successfully",
        data: lesson,
    });
};

export const getAllLessons = async (req: Request, res: Response): Promise<void> => {
    const sectionId = String(req.params["sectionId"]);

    const lessons = await prisma.lesson.findMany({
        where: { sectionId },
        orderBy: { order: "asc" },
    });

    res.status(200).json({
        success: true,
        message: "lessons retrieved successfully",
        count: lessons.length,
        data: lessons,
    });
};

export const getLesson = async (req: Request, res: Response): Promise<void> => {
    const sectionId = String(req.params["sectionId"]);
    const id = String(req.params["id"]);

    const lesson = await prisma.lesson.findFirst({
        where: { id, sectionId },

    });

    if (!lesson) throw new ApiError("lesson not found", 404);

    res.status(200).json({
        success: true,
        message: "lesson retrieved successfully",
        data: lesson,
    });
};

export const updateLesson = async (req: Request, res: Response): Promise<void> => {
    const sectionId = String(req.params["sectionId"]);
    const id = String(req.params["id"]);
    const { title, order, content } = req.body as UpdateLessonInput;

    const data: Prisma.LessonUncheckedUpdateManyInput = {};
    if (title !== undefined) data.title = title;
    if (order !== undefined) data.order = order;
    if (content !== undefined) data.content = content;

    const result = await prisma.lesson.updateMany({
        where: { id, sectionId },
        data,
    });

    if (result.count === 0) throw new ApiError("lesson not found", 404);

    const lesson = await prisma.lesson.findUnique({ where: { id } });

    res.status(200).json({
        success: true,
        message: "lesson updated successfully",
        data: lesson,
    });
};

export const deleteLesson = async (req: Request, res: Response): Promise<void> => {
    const sectionId = String(req.params["sectionId"]);
    const id = String(req.params["id"]);

    const result = await prisma.lesson.deleteMany({ where: { id, sectionId } });

    if (result.count === 0) throw new ApiError("lesson not found", 404);

    res.status(204).send();
};