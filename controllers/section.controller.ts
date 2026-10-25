import type { Request, Response } from "express";
import { Prisma } from "../generated/prisma/client.js";
import { prisma } from "../prisma.js";
import { ApiError } from "../utils/apiError.js";
import type {
    CreateSectionInput,
    UpdateSectionInput,
} from "../validators/section.validator.js";

export const createSection = async (req: Request, res: Response): Promise<void> => {
    const courseId = String(req.params["courseId"]);
    const { title, order } = req.body as CreateSectionInput;

    const section = await prisma.section.create({
        data: { title, order, courseId },
    });

    res.status(201).json({
        success: true,
        message: "Section created successfully",
        data: section,
    });
};

export const getAllSections = async (req: Request, res: Response): Promise<void> => {
    const courseId = String(req.params["courseId"]);

    const sections = await prisma.section.findMany({
        where: { courseId },
        orderBy: { order: "asc" },
    });

    res.status(200).json({
        success: true,
        message: "Sections retrieved successfully",
        count: sections.length,
        data: sections,
    });
};

export const getSection = async (req: Request, res: Response): Promise<void> => {
    const courseId = String(req.params["courseId"]);
    const id = String(req.params["id"]);

    const section = await prisma.section.findFirst({
        where: { id, courseId },
        include: { lessons: { orderBy: { order: "asc" } } },
    });

    if (!section) throw new ApiError("Section not found", 404);

    res.status(200).json({
        success: true,
        message: "Section retrieved successfully",
        data: section,
    });
};

export const updateSection = async (req: Request, res: Response): Promise<void> => {
    const courseId = String(req.params["courseId"]);
    const id = String(req.params["id"]);
    const { title, order } = req.body as UpdateSectionInput;

    const data: Prisma.SectionUncheckedUpdateManyInput = {};
    if (title !== undefined) data.title = title;
    if (order !== undefined) data.order = order;

    const result = await prisma.section.updateMany({
        where: { id, courseId },
        data,
    });

    if (result.count === 0) throw new ApiError("Section not found", 404);

    const section = await prisma.section.findUnique({ where: { id } });

    res.status(200).json({
        success: true,
        message: "Section updated successfully",
        data: section,
    });
};

export const deleteSection = async (req: Request, res: Response): Promise<void> => {
    const courseId = String(req.params["courseId"]);
    const id = String(req.params["id"]);

    const result = await prisma.section.deleteMany({ where: { id, courseId } });

    if (result.count === 0) throw new ApiError("Section not found", 404);

    res.status(204).send();
};