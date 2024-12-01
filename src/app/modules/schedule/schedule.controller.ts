import { Request } from "express";
import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import { ScheduleService } from "./schedule.services";
import pick from "../../../shared/pick";
import { IAuthUser } from "../../interfaces/common";

const insertIntoDb = catchAsync(async (req, res) => {
  const result = await ScheduleService.insertIntoDb(req.body);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Scedule created  successful",
    data: result,
  });
});

const getAllFromDb = catchAsync(async (req:Request & {user?:IAuthUser}, res) => {

  const user=req.user
  const filters = pick(req.query, ["startDate", "endDate"]);
  const options = pick(req.query, ["limit", "page", "sortBy", "sortOrder"]);
  const result = await ScheduleService.getAllFromDB(filters, options,user);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Scedule fetched  successful",
    data: result,
  });
});

export const ScheduleController = {
  insertIntoDb,
  getAllFromDb,
};
