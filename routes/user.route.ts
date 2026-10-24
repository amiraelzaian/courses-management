import express from "express";
import { createUser } from "../controllers/user.controller.js";

export const router = express.Router();

router.route("/").post(createUser);