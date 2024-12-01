import { Request } from "express";
import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import { ScheduleService } from "./schedule.services";


const insertIntoDb = catchAsync(async (req, res) => {
  const result = await ScheduleService.insertIntoDb(req.body);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Scedule created  successful",
    data: result,
  });
});


export const ScheduleController = {
  insertIntoDb,

};
