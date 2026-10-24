import express from "express";
import { createUser, deleteUser, getAllUsers, getUserById, updateUser } from "../controllers/user.controller.js";

export const router = express.Router();

router.route('/').post(createUser).get(getAllUsers)

router.route('/:id').get(getUserById).patch(updateUser).delete(deleteUser)