import type { Request, Response } from "express";
import bcrypt from "bcryptjs";
import { prisma } from "../prisma.js";
import { ApiError } from "../utils/apiError.js";
import {
    signAccessToken,
    signRefreshToken,
    verifyRefreshToken,
    hashToken,
} from "../utils/tokens.js";
import type { LoginInput } from "../validators/auth.validator.js";
import type { Role } from "../generated/prisma/enums.js";

const REFRESH_MS = 7 * 24 * 60 * 60 * 1000;

const cookieOptions = {
    httpOnly: true,
    secure: process.env["NODE_ENV"] === "production",
    sameSite: "strict" as const,
    maxAge: REFRESH_MS,
    path: "/api/v1/auth",
};


const issueTokens = async (userId: string, role: Role, res: Response) => {
    const accessToken = signAccessToken({ sub: userId, role });
    const refreshToken = signRefreshToken(userId);

    await prisma.refreshToken.create({
        data: {
            tokenHash: hashToken(refreshToken),
            userId,
            expiresAt: new Date(Date.now() + REFRESH_MS),
        }
    })

    res.cookie("refreshToken", refreshToken, cookieOptions);
    return accessToken
}


export const login = async (req: Request, res: Response): Promise<void> => {
    const { email, password } = req.body as LoginInput;

    const user = await prisma.user.findUnique({ where: { email } });
    const valid = user && (await bcrypt.compare(password, user.password));
    if (!user || !valid) throw new ApiError("Invalid email or password", 401);

    const accessToken = await issueTokens(user.id, user.role, res);

    res.status(200).json({
        success: true,
        message: "Logged in successfully",
        accessToken,
    })

}

export const refresh = async (req: Request, res: Response): Promise<void> => {
    const token = req.cookies?.['refreshToken'] as string | undefined;
    if (!token) throw new ApiError("Refress Token missing", 401);

    let userId: string;
    try {
        userId = verifyRefreshToken(token).sub;
    } catch {
        throw new ApiError("Invalid or expired refresh token", 401);
    }


    const stored = await prisma.refreshToken.findUnique({
        where: { tokenHash: hashToken(token) },
        include: { user: true },
    })

    if (!stored || stored.expiresAt < new Date()) {
        throw new ApiError("Invalid or expired refresh token", 401);
    }
    //rotation : delete the old one , issue a new pair

    await prisma.refreshToken.delete({ where: { id: stored?.id } });
    const accessToken = await issueTokens(userId, stored.user.role, res);

    res.status(200).json({ success: true, accessToken })


}

export const logout = async (req: Request, res: Response): Promise<void> => {
    const token = req.cookies?.["refreshToken"] as string | undefined;
    if (token) {
        await prisma.refreshToken.deleteMany({ where: { tokenHash: hashToken(token) } })
    }
    res.clearCookie("refreshToken", { path: "/api/v1/auth" });
    res.status(204).send();
}