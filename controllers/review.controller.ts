import type { Request, Response } from "express";
import { Prisma } from "../generated/prisma/client.js";
import { prisma } from "../prisma.js";
import { ApiError } from "../utils/apiError.js";

import type { CreateReviewInput, UpdateReviewInput } from "../validators/review.validator.js";

export const createReview = async (req: Request, res: Response): Promise<void> => {
    const courseId = String(req.params["courseId"]);
    const { rating, comment, userId } = req.body as CreateReviewInput;

    const review = await prisma.review.create({
        data: { rating, comment, courseId, userId },
    });

    res.status(201).json({
        success: true,
        message: "Reivew created successfully",
        data: review,
    });
};

export const getAllReviews = async (req: Request, res: Response): Promise<void> => {
    const courseId = String(req.params["courseId"]);

    const reviews = await prisma.review.findMany({
        where: { courseId },
        orderBy: { rating: "asc" },
    });

    res.status(200).json({
        success: true,
        message: "Reviews retrieved successfully",
        count: reviews.length,
        data: reviews,
    });
};

export const getReview = async (req: Request, res: Response): Promise<void> => {
    const courseId = String(req.params["courseId"]);
    const id = String(req.params["id"]);

    const review = await prisma.review.findFirst({
        where: { id, courseId },

    });

    if (!review) throw new ApiError("review not found", 404);

    res.status(200).json({
        success: true,
        message: "review retrieved successfully",
        data: review,
    });
};

export const updateReview = async (req: Request, res: Response): Promise<void> => {
    const courseId = String(req.params["courseId"]);
    const id = String(req.params["id"]);
    const { rating, comment, userId } = req.body as UpdateReviewInput;

    const data: Prisma.ReviewUncheckedUpdateManyInput = {};
    if (rating !== undefined) data.rating = rating;
    if (comment !== undefined) data.comment = comment;
    if (userId !== undefined) data.userId = userId;

    const result = await prisma.review.updateMany({
        where: { id, courseId, userId },
        data,
    });

    if (result.count === 0) throw new ApiError("review not found", 404);

    const review = await prisma.review.findUnique({ where: { id } });

    res.status(200).json({
        success: true,
        message: "review updated successfully",
        data: review,
    });
};

export const deleteReview = async (req: Request, res: Response): Promise<void> => {
    const courseId = String(req.params["courseId"]);
    const id = String(req.params["id"]);
    // we will add user id soon when add auth

    const result = await prisma.review.deleteMany({ where: { id, courseId } });

    if (result.count === 0) throw new ApiError("review not found", 404);

    res.status(204).send();
};