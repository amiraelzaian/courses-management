
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
    omit: {
      password: true,
    },
  });


  res.status(201).json({
    success: true,
    message: "User created successfully",
    data: newUser,
  });
};
