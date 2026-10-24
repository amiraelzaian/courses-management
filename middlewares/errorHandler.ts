
import type { ErrorRequestHandler } from "express";
import { ApiError } from "../utils/apiError.js";

export const errorHandler: ErrorRequestHandler = (
  err,
  req,
  res,
  next
) => {
  if (res.headersSent) {
    return next(err);
  }

  if (err instanceof ApiError) {
    return res.status(err.statusCode).json({
      success: false,
      status: err.status,
      message: err.message,
    });
  }

  console.error(err);

  return res.status(500).json({
    success: false,
    status: "error",
    message: "Internal Server Error",
  });
};
