
import express from "express";
import { DoctorCOntroller } from "./Doctor.controller";

const router=express.Router()


router.patch('/:id',

  DoctorCOntroller.updateDoctor


)

export const DoctorRoutes=router