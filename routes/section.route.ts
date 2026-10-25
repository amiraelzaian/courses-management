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

export const router = express.Router({ mergeParams: true });

router
    .route("/")
    .post(
        validate(courseIdParamsSchema, "params"),
        validate(createSectionSchema),
        createSection
    )
    .get(validate(courseIdParamsSchema, "params"), getAllSections);

router
    .route("/:id")
    .get(validate(sectionIdParamsSchema, "params"), getSection)
    .patch(
        validate(sectionIdParamsSchema, "params"),
        validate(updateSectionSchema),
        updateSection
    )
    .delete(validate(sectionIdParamsSchema, "params"), deleteSection);