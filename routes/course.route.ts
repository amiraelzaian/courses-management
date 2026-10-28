import express from "express";
import { validate } from "../middlewares/validate.js";
import {
    courseIdParamSchema,
    CreateCourseSchema,
    updateCourseSchema,
} from "../validators/course.validator.js";
import {
    createCourse,
    deleteCourse,
    getAllCourses,
    getCourse,
    updateCourse,
} from "../controllers/course.controller.js";


import { router as sectionRouter } from "./section.route.js";
import { router as enrollment } from "./enrollment.route.js";
import { router as review } from "./review.route.js";
import { authenticate, authorize } from "../middlewares/auth.js";
import { Role } from "../generated/prisma/enums.js";

export const router = express.Router();

// /api/v1/courses/:courseId/route/...
router.use("/:courseId/sections", sectionRouter);
router.use("/:courseId/enrollments", enrollment);
router.use("/:courseId/reviews", review);

router
    .route("/")
    .post(authenticate, authorize(Role.ADMIN, Role.INSTRUCTOR), validate(CreateCourseSchema), createCourse)
    .get(getAllCourses);

router
    .route("/:id")
    .get(validate(courseIdParamSchema, "params"), getCourse)
    .patch(
        authenticate, authorize(Role.ADMIN, Role.INSTRUCTOR),
        validate(courseIdParamSchema, "params"),
        validate(updateCourseSchema),
        updateCourse
    )
    .delete(authenticate, authorize(Role.ADMIN, Role.INSTRUCTOR), validate(courseIdParamSchema, "params"), deleteCourse);