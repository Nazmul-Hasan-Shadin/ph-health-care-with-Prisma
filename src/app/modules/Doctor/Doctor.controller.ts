import { Request, Response } from "express";
import catchAsync from "../../../shared/catchAsync";
import { DoctorServices } from "./doctor.services";
import sendResponse from "../../../shared/sendResponse";
import pick from "../../../shared/pick";
import { doctorFilterableFields, doctorSearchableFields } from "./doctor.const";

const getAllDoctor = catchAsync(async (req, res) => {
  const filters = pick(req.query, doctorFilterableFields);
  const options = pick(req.query, doctorSearchableFields);

  console.log('filters',filters);
  

  const result = await DoctorServices.getAllDoctorFromDb(filters, options);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Doctors retrieval successfully",
    meta: result.meta,
    data: result.data,
  });
});
const getByIdFromDB = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await DoctorServices.getByIdFromDB(id);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Doctor retrieval successfully",
    data: result,
  });
});

const updateDoctor = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;

  const result = await DoctorServices.updateDoctorIntoDb(id, req.body);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Doctor data updated!",
    data: result,
  });
});

export const DoctorCOntroller = {
  updateDoctor,
  getAllDoctor,
  getByIdFromDB,
};
