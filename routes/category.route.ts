import express from "express";

import { validate } from "../middlewares/validate.js";

import { createCategory, deleteCategory, getAllCategories, getCategory, updateCategory } from "../controllers/category.controller.js";
import { categoryIdParamSchema, createCategorySchema, updateCategorySchema } from "../validators/category.validator.js";

export const router = express.Router();

router
    .route("/")
    .post(validate(createCategorySchema), createCategory)
    .get(getAllCategories);

router
    .route("/:id")
    .get(validate(categoryIdParamSchema, "params"), getCategory)
    .patch(
        validate(categoryIdParamSchema, "params"),
        validate(updateCategorySchema),
        updateCategory
    )
    .delete(validate(categoryIdParamSchema, "params"), deleteCategory);