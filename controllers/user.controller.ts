import type { Request, Response } from "express";
import bcrypt from "bcryptjs";
import { prisma } from "../prisma.js";
import { ApiError } from "../utils/apiError.js";
import type {
    CreateUserInput,
    UpdateUserInput,
} from "../validators/user.validator.js";

export const createUser = async (
    req: Request,
    res: Response
): Promise<void> => {
    const { name, email, password, role } = req.body as CreateUserInput;

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await prisma.user.create({
        data: {
            name,
            email,
            password: hashedPassword,
            ...(role !== undefined && { role }),
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
    _req: Request,
    res: Response
): Promise<void> => {
    const users = await prisma.user.findMany({
        omit: { password: true },
        orderBy: { createdAt: "desc" },
    });

    res.status(200).json({
        success: true,
        message: "Users retrieved successfully",
        count: users.length,
        data: users,
    });
};

export const getUserById = async (
    req: Request,
    res: Response
): Promise<void> => {
    const id = String(req.params["id"]);

    const user = await prisma.user.findUnique({
        where: { id },
        omit: { password: true },
    });

    if (!user) {
        throw new ApiError("User not found", 404);
    }

    res.status(200).json({
        success: true,
        message: "User retrieved successfully",
        data: user,
    });
};

export const updateUser = async (
    req: Request,
    res: Response
): Promise<void> => {
    const id = String(req.params["id"]);
    const { name, email, role } = req.body as UpdateUserInput;

    const user = await prisma.user.update({
        where: { id },
        data: {
            ...(name !== undefined && { name }),
            ...(email !== undefined && { email }),
            ...(role !== undefined && { role }),
        },
        omit: { password: true },
    });

    res.status(200).json({
        success: true,
        message: "User updated successfully",
        data: user,
    });
};

export const deleteUser = async (
    req: Request,
    res: Response
): Promise<void> => {
    const id = String(req.params["id"]);

    await prisma.user.delete({ where: { id } });

    res.status(204).send();
};