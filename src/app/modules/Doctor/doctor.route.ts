
import express from "express";
import { DoctorCOntroller } from "./Doctor.controller";

const router=express.Router()
 
router.get('/',DoctorCOntroller.getAllDoctor)
router.get('/:id',DoctorCOntroller.getByIdFromDB)

router.patch('/:id',

  DoctorCOntroller.updateDoctor


)
 



export const DoctorRoutes=router