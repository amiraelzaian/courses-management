

import express from 'express'
import { validate } from '../middlewares/validate.js';
import { LessonIdParamsSchema, CourseSectionIdPramsSchema } from "../validators/lesson.validator.js"
import { createLesson, deleteLesson, getAllLessons, getLesson, updateLesson } from "../controllers/lesson.controller.js"

export const router = express.Router({ mergeParams: true });


router.route('/')
    .post(
        validate(CourseSectionIdPramsSchema, "params"),
        createLesson
    )
    .get(
        validate(CourseSectionIdPramsSchema, "params"),
        getAllLessons
    );

router.route('/:id')
    .get(validate(LessonIdParamsSchema, "params"), getLesson)
    .patch(validate(LessonIdParamsSchema, "params"), updateLesson)
    .delete(validate(LessonIdParamsSchema, "params"), deleteLesson);