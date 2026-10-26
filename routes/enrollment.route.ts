import express from 'express'
import { validate } from '../middlewares/validate.js'
import { courseIdParamSchema } from '../validators/enrollment.validator.js'
import { createEnrollment, deleteEnrollment, getAllEnrollments, getEnrollment, updateEnrollment } from "../controllers/enrollment.controller.js"
import { createEnrollmentSchema, enrollmentIdParamsSchema, updateEnrollmentSchema } from '../validators/enrollment.validator.js'


export const router = express.Router({ mergeParams: true })


router.route("/").post(validate(courseIdParamSchema, "params"), validate(createEnrollmentSchema), createEnrollment)
    .get(validate(courseIdParamSchema, "params"), getAllEnrollments)



router.route("/:id").get(validate(enrollmentIdParamsSchema, "params"), getEnrollment)
    .patch(validate(enrollmentIdParamsSchema, "params"), validate(updateEnrollmentSchema), updateEnrollment)
    .delete(validate(enrollmentIdParamsSchema, "params"), deleteEnrollment)






