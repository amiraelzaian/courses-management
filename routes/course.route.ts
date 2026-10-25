import express from 'express'
import { validate } from "../middlewares/validate.js"
import { courseIdParamSchema, CreateCourseSchema, updateCourseSchema } from '../validators/course.validator.js';
import { createCourse, deleteCourse, getAllCourses, getCourse, updateCourse } from '../controllers/course.controller.js';
export const router = express.Router();




router.route('/').post(validate(CreateCourseSchema), createCourse)
    .get(getAllCourses)

router.route('/:id').get(validate(courseIdParamSchema, "params"), getCourse)
    .patch(validate(courseIdParamSchema, 'params'), validate(updateCourseSchema), updateCourse)
    .delete(validate(courseIdParamSchema, "params"), deleteCourse)

