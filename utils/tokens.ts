

import jwt from "jsonwebtoken";
import crypto from "node:crypto";
import type { Role } from "../generated/prisma/client.js"


export interface AccessPayload {
    sub: string;
    role: Role;
}

const accessSecret = process.env["JWT_ACCESS_SECRET"]!;
const refreshSecret = process.env["JWT_REFRESH_SECRET"]!;

export const signAccessToken = (payload: AccessPayload): string =>
    jwt.sign(payload, accessSecret, { expiresIn: "15m" });

export const signRefreshToken = (userId: string): string =>
    jwt.sign({ sub: userId }, refreshSecret, { expiresIn: "7d" })

export const verifyAccessToken = (token: string): AccessPayload =>
    jwt.verify(token, accessSecret) as unknown as AccessPayload;

export const verifyRefreshToken = (token: string): { sub: string } =>
    jwt.verify(token, refreshSecret) as unknown as { sub: string }


export const hashToken = (token: string): string =>
    crypto.createHash("sha256").update(token).digest("hex")