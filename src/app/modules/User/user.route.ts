import express, { NextFunction, Request, Response } from "express";
import { userController } from "./user.controller";
import { jwtHelpers } from "../../../helpers/jwtHelpers";
import { Secret } from "jsonwebtoken";
import { visitEachChild } from "typescript";
import auth from "../../middlewares/auth";
import { UserRole } from "@prisma/client";
import multer from "multer";
import path from "path";
import { fileUploader } from "../../../helpers/fileUploader";
import { userValidation } from "./user.validation";
import { validateRequest } from "../../middlewares/validateRequest";

const router = express.Router();

router.get("/", userController.getAllFromDb);

router.get("/me", auth(UserRole.ADMIN,UserRole.DOCTOR,UserRole.PATIENT),userController.getMyProfile);

router.post(
  "/create-admin",
  auth(UserRole.ADMIN, UserRole.SUPER_ADMIN),
  fileUploader.upload.single("file"),

  (req: Request, res: Response, next: NextFunction) => {
    req.body = userValidation.createAdmin.parse(JSON.parse(req.body.data));

    return userController.createAdmin(req, res, next);
  }
);

router.post(
  "/create-doctor",
  auth(UserRole.ADMIN, UserRole.SUPER_ADMIN),
  fileUploader.upload.single("file"),

  (req: Request, res: Response, next: NextFunction) => {
    req.body = userValidation.createDoctor.parse(JSON.parse(req.body.data));

    return userController.createDoctor(req, res, next);
  }
);

router.post(
  "/create-patient",
  fileUploader.upload.single("file"),

  (req: Request, res: Response, next: NextFunction) => {
    req.body = userValidation.createPatient.parse(JSON.parse(req.body.data));
    return userController.createPatient(req, res, next);
  }
);

router.patch(
  "/update-my-profile",
  auth(UserRole.SUPER_ADMIN,UserRole.ADMIN,UserRole.DOCTOR,UserRole.PATIENT),
  fileUploader.upload.single("file"),

  (req: Request, res: Response, next: NextFunction) => {

    req.body=JSON.parse(req.body.data)

    return userController.updateMyProfile(req, res, next);
  },

);

export const userRoutes = router;
