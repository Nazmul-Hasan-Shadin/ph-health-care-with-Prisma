import express, { NextFunction, Request, Response } from "express";
import { userController } from "./user.controller";
import { jwtHelpers } from "../../../helpers/jwtHelpers";
import config from "../../../config";
import { Secret } from "jsonwebtoken";
import { visitEachChild } from "typescript";
import auth from "../../middlewares/auth";
import { UserRole } from "@prisma/client";

const router = express.Router();

router.post(
  "/",
  auth(UserRole, UserRole.SUPER_ADMIN),
  userController.createAdmin
);

export const userRoutes = router;
