

import express from 'express'
import { validate } from '../middlewares/validate.js';
import { LessonIdParamsSchema, CourseSectionIdPramsSchema } from "../validators/lesson.validator.js"
import { createLesson, deleteLesson, getAllLessons, getLesson, updateLesson } from "../controllers/lesson.controller.js"
import { Role } from '../generated/prisma/enums.js';
import { authenticate, authorize } from '../middlewares/auth.js';

export const router = express.Router({ mergeParams: true });


router.route('/')
    .post(authenticate, authorize(Role.ADMIN, Role.INSTRUCTOR),
        validate(CourseSectionIdPramsSchema, "params"),
        createLesson
    )
    .get(
        validate(CourseSectionIdPramsSchema, "params"),
        getAllLessons
    );

router.route('/:id')
    .get(validate(LessonIdParamsSchema, "params"), getLesson)
    .patch(authenticate, authorize(Role.ADMIN, Role.INSTRUCTOR), validate(LessonIdParamsSchema, "params"), updateLesson)
    .delete(authenticate, authorize(Role.ADMIN, Role.INSTRUCTOR), validate(LessonIdParamsSchema, "params"), deleteLesson);