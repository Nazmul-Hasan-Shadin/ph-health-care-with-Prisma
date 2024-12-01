import express, { NextFunction, Request, Response } from "express";

import auth from "../../middlewares/auth";
import { UserRole } from "@prisma/client";
import { AppointmentController } from "./Appointment.controller";


const router = express.Router();

 router.post('/',auth(UserRole.PATIENT),AppointmentController.createAppointment)

export const AppointmentRoutes = router;
