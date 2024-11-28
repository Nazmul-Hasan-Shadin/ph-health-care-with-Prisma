import { Request, Response } from "express";
import catchAsync from "../../../shared/catchAsync";
import { DoctorServices } from "./doctor.services";
import sendResponse from "../../../shared/sendResponse";


const updateDoctor=catchAsync(async(req:Request,res:Response)=>{
    const {id}=req.params;

    const result=await DoctorServices.updateDoctorIntoDb(id,req.body)

    sendResponse(res,{
        statusCode:200,
        success:true,
        message:"Doctor data updated!",
        data:result
    })
})

export const DoctorCOntroller={
    updateDoctor
}