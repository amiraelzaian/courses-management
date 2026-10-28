import express from "express";
import { validate } from "../middlewares/validate.js";

import {
    courseIdParamsSchema,
    sectionIdParamsSchema,
    createSectionSchema,
    updateSectionSchema,
} from "../validators/section.validator.js";

import {
    createSection,
    deleteSection,
    getAllSections,
    getSection,
    updateSection,
} from "../controllers/section.controller.js";

import { router as lessonRouter } from "./lesson.route.js";
import { authenticate, authorize } from "../middlewares/auth.js";
import { Role } from "../generated/prisma/enums.js";

export const router = express.Router({ mergeParams: true });

router.use("/:sectionId/lessons", lessonRouter);

router
    .route("/")
    .post(authenticate, authorize(Role.ADMIN, Role.INSTRUCTOR),
        validate(courseIdParamsSchema, "params"),
        validate(createSectionSchema),
        createSection
    )
    .get(
        validate(courseIdParamsSchema, "params"),
        getAllSections
    );

router
    .route("/:id")
    .get(validate(sectionIdParamsSchema, "params"), getSection)
    .patch(authenticate, authorize(Role.ADMIN, Role.INSTRUCTOR),
        validate(sectionIdParamsSchema, "params"),
        validate(updateSectionSchema),
        updateSection
    )
    .delete(authenticate, authorize(Role.ADMIN, Role.INSTRUCTOR),
        validate(sectionIdParamsSchema, "params"), deleteSection);