import { Request } from "express";
import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import { SpecialitiesServices } from "./specialities.services";

const insertIntoDb = catchAsync(async (req, res) => {
  const result = await SpecialitiesServices.insertIntoDb(req);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "speciality created  successful",
    data: result,
  });
});

const getAllSpecialitiees = catchAsync(async (req, res, next) => {
  const result = await SpecialitiesServices.getAllSpecialitiesFromDb();

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "specaliti are Retrived succesful",
    data: result,
  });
});

const deleteSpecialitiees = catchAsync(async (req, res, next) => {
  const result = await SpecialitiesServices.deleteSpecialitiesFromDb(
    req.params.id
  );

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "specality is Dleeted succesfull",
    data: result,
  });
});

export const SpecialitiesController = {
  insertIntoDb,
  getAllSpecialitiees,
  deleteSpecialitiees,
};
