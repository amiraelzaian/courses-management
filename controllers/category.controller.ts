import type { Request, Response } from "express";
import { prisma } from "../prisma.js";
import { ApiError } from "../utils/apiError.js";
import type {
    CreateCategoryInput,
    UpdateCategoryInput,
} from "../validators/category.validator.js";

export const createCategory = async (
    req: Request,
    res: Response
): Promise<void> => {
    const { name } = req.body as CreateCategoryInput;

    const category = await prisma.category.create({ data: { name } });

    res.status(201).json({
        success: true,
        message: "Category created successfully",
        data: category,
    });
};

export const getAllCategories = async (
    _req: Request,
    res: Response
): Promise<void> => {
    const categories = await prisma.category.findMany({
        orderBy: { createdAt: "desc" },
    });

    res.status(200).json({
        success: true,
        message: "Categories retrieved successfully",
        count: categories.length,
        data: categories,
    });
};

export const getCategory = async (
    req: Request,
    res: Response
): Promise<void> => {
    const id = String(req.params["id"]);

    const category = await prisma.category.findUnique({ where: { id } });

    if (!category) {
        throw new ApiError("Category not found", 404);
    }

    res.status(200).json({
        success: true,
        message: "Category retrieved successfully",
        data: category,
    });
};

export const updateCategory = async (
    req: Request,
    res: Response
): Promise<void> => {
    const id = String(req.params["id"]);
    const { name } = req.body as UpdateCategoryInput;

    const category = await prisma.category.update({
        where: { id },
        data: { ...(name !== undefined && { name }) },
    });

    res.status(200).json({
        success: true,
        message: "Category updated successfully",
        data: category,
    });
};

export const deleteCategory = async (
    req: Request,
    res: Response
): Promise<void> => {
    const id = String(req.params["id"]);

    await prisma.category.delete({ where: { id } });

    res.status(204).send();
};