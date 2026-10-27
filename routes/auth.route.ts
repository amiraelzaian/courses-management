import express from "express";
import { validate } from "../middlewares/validate.js";
import { loginSchema } from "../validators/auth.validator.js";
import { login, refresh, logout } from "../controllers/auth.controller.js";

export const router = express.Router();

router.post("/login", validate(loginSchema), login);
router.post("/refresh", refresh);
router.post("/logout", logout);