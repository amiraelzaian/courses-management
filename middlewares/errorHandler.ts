import type { ErrorRequestHandler } from "express";
import { Prisma } from "../generated/prisma/client.js";
import { ApiError } from "../utils/apiError.js";

export const errorHandler: ErrorRequestHandler = (err, _req, res, next) => {
  if (res.headersSent) {
    return next(err);
  }

  // 1. Your own errors
  if (err instanceof ApiError) {
    return res.status(err.statusCode).json({
      success: false,
      status: err.status,
      message: err.message,
    });
  }

  // 2. Invalid or empty JSON body (from express.json())
  if (err?.type === "entity.parse.failed") {
    return res.status(400).json({
      success: false,
      status: "fail",
      message: "Invalid or empty JSON body",
    });
  }

  // 3. Known Prisma errors
  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    switch (err.code) {
      case "P2002": {
        const target = err.meta?.["target"];
        const fields = Array.isArray(target) ? target.join(", ") : undefined;
        return res.status(409).json({
          success: false,
          status: "fail",
          message: fields ? `${fields} already exists` : "Duplicate value",
        });
      }
      case "P2025":
        return res.status(404).json({
          success: false,
          status: "fail",
          message: "Record not found",
        });
      case "P2003":
        return res.status(409).json({
          success: false,
          status: "fail",
          message: "Invalid reference or record has related data",
        });
    }
  }

  // 4. Prisma validation error (wrong type, unknown field)
  if (err instanceof Prisma.PrismaClientValidationError) {
    return res.status(400).json({
      success: false,
      status: "fail",
      message: "Invalid data sent to the database",
    });
  }

  // 5. Anything else
  console.error(err);

  return res.status(500).json({
    success: false,
    status: "error",
    message: "Internal Server Error",
  });
};