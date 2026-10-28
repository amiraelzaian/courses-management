import express from "express";
import {
    createUser,
    getAllUsers,
    getUserById,
    updateUser,
    deleteUser,
} from "../controllers/user.controller.js";
import { validate } from "../middlewares/validate.js";
import {
    createUserSchema,
    updateUserSchema,
    userIdParamSchema,
} from "../validators/user.validator.js";
import { Role } from "../generated/prisma/enums.js";
import { authenticate, authorize } from "../middlewares/auth.js";

export const router = express.Router();

router
    .route("/")
    .post(authenticate, authorize(Role.ADMIN), validate(createUserSchema), createUser)
    .get(authenticate, authorize(Role.ADMIN), getAllUsers);

router
    .route("/:id")
    .get(authenticate, authorize(Role.ADMIN, Role.ADMIN), validate(userIdParamSchema, "params"), getUserById)
    .patch(
        authenticate, authorize(Role.ADMIN, Role.INSTRUCTOR),
        validate(userIdParamSchema, "params"),
        validate(updateUserSchema),
        updateUser
    )
    .delete(authenticate, authorize(Role.ADMIN, Role.INSTRUCTOR), validate(userIdParamSchema, "params"), deleteUser);