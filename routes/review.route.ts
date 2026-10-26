import express from "express";
import { validate } from "../middlewares/validate.js";

import { createReview, deleteReview, getAllReviews, getReview, updateReview } from "../controllers/review.controller.js"
import { courseIdParamsSchema, createReviewSchema, reviewIdParamsSchema, updateReviewSchema } from "../validators/review.validator.js";


export const router = express.Router({ mergeParams: true });


router
    .route("/")
    .post(
        validate(courseIdParamsSchema, "params"),
        validate(createReviewSchema),
        createReview
    )
    .get(
        validate(courseIdParamsSchema, "params"),
        getAllReviews
    );

router
    .route("/:id")
    .get(validate(reviewIdParamsSchema, "params"), getReview)
    .patch(
        validate(reviewIdParamsSchema, "params"),
        validate(updateReviewSchema),
        updateReview
    )
    .delete(validate(reviewIdParamsSchema, "params"), deleteReview);