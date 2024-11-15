import express, { NextFunction, RequestHandler } from "express";
import { AdminController } from "./admin.controller";

import { AnyZodObject, Schema, ZodSchema, z } from "zod";
import { validateRequest } from "../../middlewares/validateRequest";
import { AdminValidationSchema } from "./admin.validation";
import auth from "../../middlewares/auth";
import { UserRole } from "@prisma/client";
const router = express.Router();

router.get(
  "/",
  auth(UserRole.SUPER_ADMIN, UserRole.ADMIN),
  AdminController.getAllFromDb
);
router.get("/:id", AdminController.getByIdFromDb);
router.patch(
  "/:id",
  auth(UserRole.SUPER_ADMIN, UserRole.ADMIN),

  validateRequest(AdminValidationSchema.update),
  AdminController.updateIntoDb
);
router.delete(
  "/:id",
  auth(UserRole.SUPER_ADMIN, UserRole.ADMIN),
  AdminController.deleteFromDb
);
router.delete(
  "/soft/:id",
  auth(UserRole.SUPER_ADMIN, UserRole.ADMIN),
  AdminController.softDeleteFromDb
);

export const adminRoutes = router;
