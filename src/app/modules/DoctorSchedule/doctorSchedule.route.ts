import express from "express";
import { DoctorShceduleController } from "./doctorSchedule.controller";
import auth from "../../middlewares/auth";
import { UserRole } from "@prisma/client";

const router = express.Router();
router.get(
  "/my-schedule",
  auth(UserRole.DOCTOR),
  DoctorShceduleController.getMySchedule
);

router.post("/", auth(UserRole.DOCTOR), DoctorShceduleController.insertIntoDb);
router.delete(
  "/:id",
  auth(UserRole.DOCTOR),
  DoctorShceduleController.deleteFromDb
);

export const DoctroScheduleRoutes = router;
