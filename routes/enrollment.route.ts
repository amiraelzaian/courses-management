import express from 'express'
import { validate } from '../middlewares/validate.js'
import { courseIdParamSchema } from '../validators/enrollment.validator.js'
import { createEnrollment, deleteEnrollment, getAllEnrollments, getEnrollment, updateEnrollment } from "../controllers/enrollment.controller.js"
import { createEnrollmentSchema, enrollmentIdParamsSchema, updateEnrollmentSchema } from '../validators/enrollment.validator.js'
import { authenticate, authorize } from '../middlewares/auth.js'
import { Role } from '../generated/prisma/enums.js'


export const router = express.Router({ mergeParams: true })


router.route("/").post(authenticate, authorize(Role.ADMIN), validate(courseIdParamSchema, "params"), validate(createEnrollmentSchema), createEnrollment)
    .get(authenticate, authorize(Role.ADMIN, Role.INSTRUCTOR), validate(courseIdParamSchema, "params"), getAllEnrollments)



router.route("/:id").get(validate(enrollmentIdParamsSchema, "params"), getEnrollment)
    .patch(authenticate, authorize(Role.ADMIN, Role.INSTRUCTOR), validate(enrollmentIdParamsSchema, "params"), validate(updateEnrollmentSchema), updateEnrollment)
    .delete(authenticate, authorize(Role.ADMIN, Role.INSTRUCTOR), validate(enrollmentIdParamsSchema, "params"), deleteEnrollment)






