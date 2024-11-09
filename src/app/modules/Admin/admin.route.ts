import express, { NextFunction, RequestHandler } from "express";
import { AdminController } from "./admin.controller";

import { AnyZodObject, Schema, ZodSchema, z } from "zod";
import { validateRequest } from "../../middlewares/validateRequest";
import { AdminValidationSchema } from "./admin.validation";
const router = express.Router();

router.get("/", AdminController.getAllFromDb);
router.get("/:id", AdminController.getByIdFromDb);
router.patch(
  "/:id",
  validateRequest(AdminValidationSchema.update),
  AdminController.updateIntoDb
);
router.delete("/:id", AdminController.deleteFromDb);
router.delete("/soft/:id", AdminController.softDeleteFromDb);

export const adminRoutes = router;
