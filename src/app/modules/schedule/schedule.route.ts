import express, { NextFunction, Request, Response } from "express";
import { ScheduleController } from "./schedule.controller";
import auth from "../../middlewares/auth";
import { UserRole } from "@prisma/client";


const router = express.Router();

 router.get('/',auth(UserRole.DOCTOR),ScheduleController.getAllFromDb)
router.post('/',auth(UserRole.SUPER_ADMIN,UserRole.ADMIN),ScheduleController.insertIntoDb)

export const ScheduleRoutes = router;
