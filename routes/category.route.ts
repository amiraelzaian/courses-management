import express from "express";

import { validate } from "../middlewares/validate.js";

import { createCategory, deleteCategory, getAllCategories, getCategory, updateCategory } from "../controllers/category.controller.js";
import { categoryIdParamSchema, createCategorySchema, updateCategorySchema } from "../validators/category.validator.js";
import { authenticate, authorize } from '../middlewares/auth.js'
import { Role } from "../generated/prisma/enums.js";

export const router = express.Router();

router
    .route("/")
    .post(authenticate, authorize(Role.ADMIN), validate(createCategorySchema), createCategory)
    .get(getAllCategories);

router
    .route("/:id")
    .get(validate(categoryIdParamSchema, "params"), getCategory)
    .patch(
        authenticate, authorize(Role.ADMIN),
        validate(categoryIdParamSchema, "params"),
        validate(updateCategorySchema),
        updateCategory
    )
    .delete(authenticate, authorize(Role.ADMIN), validate(categoryIdParamSchema, "params"), deleteCategory);