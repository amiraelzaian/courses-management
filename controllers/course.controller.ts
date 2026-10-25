import { prisma } from "../prisma.js";
import { ApiError } from "../utils/apiError.js";
import type { Request, Response, NextFunction } from "express";
import { CreateCourseInput } from "../validators/course.validator.js";


export const createCourse = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const { title, description, level, isPublished, instructorId, categoryId, price } = req.body as CreateCourseInput;

    const course = await prisma.course.create({
        data: {
            title,
            description,
            level,
            isPublished,
            instructorId,
            categoryId,
            price
        },
        include: {
            instructor: { select: { id: true, name: true, email: true } },
            category: { select: { id: true, name: true } },
        },
    })

    res.status(201).json({
        success: true,
        message: "course created successfully",
        data: course,
    });

}

export const getAllCourses = async (
    _req: Request,
    res: Response
): Promise<void> => {
    const courses = await prisma.course.findMany({
        orderBy: { createdAt: "desc" },
    });

    res.status(200).json({
        success: true,
        message: "courses retrieved successfully",
        count: courses.length,
        data: courses,
    });
};

export const getCourse = async (
    req: Request,
    res: Response
): Promise<void> => {
    const id = String(req.params["id"]);

    const course = await prisma.course.findUnique({ where: { id } });

    if (!course) {
        throw new ApiError("course not found", 404);
    }

    res.status(200).json({
        success: true,
        message: "course retrieved successfully",
        data: course,
    });
};

export const updateCourse = async (
    req: Request,
    res: Response
): Promise<void> => {
    const id = String(req.params["id"]);


    const course = await prisma.course.update({
        where: { id },
        data: { ...req.body },
    });

    res.status(200).json({
        success: true,
        message: "course updated successfully",
        data: course,
    });
};

export const deleteCourse = async (
    req: Request,
    res: Response
): Promise<void> => {
    const id = String(req.params["id"]);

    await prisma.course.delete({ where: { id } });

    res.status(204).send();
};