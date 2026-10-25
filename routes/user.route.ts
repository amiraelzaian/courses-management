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

export const router = express.Router();

router
    .route("/")
    .post(validate(createUserSchema), createUser)
    .get(getAllUsers);

router
    .route("/:id")
    .get(validate(userIdParamSchema, "params"), getUserById)
    .patch(
        validate(userIdParamSchema, "params"),
        validate(updateUserSchema),
        updateUser
    )
    .delete(validate(userIdParamSchema, "params"), deleteUser);