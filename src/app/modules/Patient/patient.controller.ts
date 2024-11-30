import { Request, Response } from "express";
import catchAsync from "../../../shared/catchAsync";
import { patientFilterableFields } from "./patient.const";
import pick from "../../../shared/pick";
import { PatientService } from "./patient.services";
import sendResponse from "../../../shared/sendResponse";

const getAllFromDB = catchAsync(async (req: Request, res: Response) => {
  const filters = pick(req.query, patientFilterableFields);
  const options = pick(req.query, ["limit", "page", "sortBy", "sortOrder"]);

  const result = await PatientService.getAllFromDB(filters, options);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Patient retrieval successfully",
    meta: result.meta,
    data: result.data,
  });
});

const getByIdFromDB = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await PatientService.getByIdFromDB(id);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Patient retrieval successfully",
    data: result,
  });
});

const updatePatient = catchAsync(async (req: Request, res: Response) => {
  const result = await PatientService.updatePatientIntoDb(req.params.id,req.body);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Patient updatepost successfully",
    data: result,
  });
});

 
const deleteFromDB=catchAsync(async(req:Request,res:Response)=>{

  const {id}=req.params;
  const result= await PatientService.deleteFromDb(id);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Patient deleted successfully",
    data: result,
  });
})

export const PatientController = {
  getAllFromDB,
  getByIdFromDB,
  updatePatient,
  deleteFromDB
};
