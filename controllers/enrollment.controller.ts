import type { Request, Response } from "express";
import { ApiError } from "../utils/apiError.js";
import { prisma } from "../prisma.js";
import type {
    CreateEnrollmentInput,
    UpdateEnrollmentInput,
} from "../validators/enrollment.validator.js";

export const createEnrollment = async (
    req: Request,
    res: Response
): Promise<void> => {
    const { userId } = req.body as CreateEnrollmentInput;
    const courseId = String(req.params["courseId"]);

    const enrollment = await prisma.enrollment.create({
        data: { userId, courseId },
    });

    res.status(201).json({
        success: true,
        message: "Enrollment created successfully",
        data: enrollment,
    });
};

export const getAllEnrollments = async (
    req: Request,
    res: Response
): Promise<void> => {
    const courseId = String(req.params["courseId"]);

    const enrollments = await prisma.enrollment.findMany({
        where: { courseId },
        orderBy: { createdAt: "desc" },
    });

    res.status(200).json({
        success: true,
        message: "Enrollments retrieved successfully",
        count: enrollments.length,
        data: enrollments,
    });
};

export const getEnrollment = async (
    req: Request,
    res: Response
): Promise<void> => {
    const courseId = String(req.params["courseId"]);
    const id = String(req.params["id"]);

    const enrollment = await prisma.enrollment.findFirst({
        where: { id, courseId },
    });

    if (!enrollment) {
        throw new ApiError("Enrollment not found", 404);
    }

    res.status(200).json({
        success: true,
        message: "Enrollment retrieved successfully",
        data: enrollment,
    });
};

export const updateEnrollment = async (
    req: Request,
    res: Response
): Promise<void> => {
    const courseId = String(req.params["courseId"]);
    const id = String(req.params["id"]);
    const { progress } = req.body as UpdateEnrollmentInput;


    const result = await prisma.enrollment.updateMany({
        where: { id, courseId },
        data: { progress }
    });

    if (result.count === 0) throw new ApiError("Enrollment not found", 404);

    const enrollment = await prisma.enrollment.findUnique({ where: { id } });

    res.status(200).json({
        success: true,
        message: "Enrollment updated successfully",
        data: enrollment,
    });
};

export const deleteEnrollment = async (
    req: Request,
    res: Response
): Promise<void> => {
    const courseId = String(req.params["courseId"]);
    const id = String(req.params["id"]);

    const result = await prisma.enrollment.deleteMany({
        where: { id, courseId },
    });

    if (result.count === 0) throw new ApiError("Enrollment not found", 404);

    res.status(204).send();
};