import express from "express";
import { createUser } from "../controllers/user.controller.js";

export const router = express.Router();

router.post("/", (req, res, next) => {
  console.log("POST /api/v1/users route reached");
  next();
}, createUser);