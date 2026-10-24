import { prisma } from "../prisma.js";
import { ApiError } from "../utils/apiError.js";
import bcrypt from "bcryptjs";
import type { Request, Response, NextFunction } from "express";

export const createUser = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    const { name, email, password, role } = req.body;

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await prisma.user.create({
        data: {
            name,
            email,
            password: hashedPassword,
            role,
        },
        omit: { password: true },
    });

    res.status(201).json({
        success: true,
        message: "User created successfully",
        data: newUser,
    });
};

export const getAllUsers = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    const users = await prisma.user.findMany({
        omit: { password: true },
        orderBy: { createdAt: "desc" },
    });
    if (users.length === 0) {
        return next(new ApiError("No users found", 404))
    }
    res.status(200).json({
        success: true,
        message: "Users retrieved successfully",
        count: users.length,
        data: users,
    });
};

export const getUserById = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    const id = String(req.params["id"]);

    const user = await prisma.user.findUnique({
        where: { id },
        omit: { password: true },
    });

    if (!user) {
        return next(new ApiError("User not found", 404));
    }

    res.status(200).json({
        success: true,
        message: "User retrieved successfully",
        data: user,
    });
};

export const updateUser = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    const id = String(req.params["id"]);


    try {
        const user = await prisma.user.update({
            where: { id },
            data: req.body,
            omit: { password: true },
        });

        res.status(200).json({
            success: true,
            message: "User updated successfully",
            data: user,
        });
    } catch (error: Error | any) {

        if (error.code === "P2025") {
            return next(new ApiError("User not found", 404));
        }


        next(error);
    }
};

export const deleteUser = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    const id = String(req.params["id"]);


    try {
        const user = await prisma.user.delete({
            where: { id },

        });

        res.status(204).send()
    } catch (error: Error | any) {

        if (error.code === "P2025") {
            return next(new ApiError("User not found", 404));
        }


        next(error);
    }
};