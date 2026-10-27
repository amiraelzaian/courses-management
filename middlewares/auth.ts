import type { Request, Response, NextFunction } from "express";
import { ApiError } from "../utils/apiError.js";
import { verifyAccessToken } from "../utils/tokens.js";
import type { Role } from "../generated/prisma/client.js";


declare module "express-serve-static-core" {
    interface Request {
        user?: {
            id: string;
            role: Role;
        }
    }
}

export const authenticate = (req: Request, res: Response, next: NextFunction): void => {
    const header = req.headers.authorization;
    if (!header?.startsWith("Bearer ")) {
        throw new ApiError("Authentication required", 401);
    }

    try {
        const payload = verifyAccessToken(header.slice(7));
        req.user = {
            id: payload.sub, role: payload.role
        }
        next();
    } catch {
        throw new ApiError("Invalid or expired access token", 401)
    }

}


export const authorize = (...roles: Role[]) => (req: Request, res: Response, next: NextFunction): void => {
    if (!req.user || !roles.includes(req.user.role)) {
        throw new ApiError("You do not have permissin", 403);
    }
    next();
}














