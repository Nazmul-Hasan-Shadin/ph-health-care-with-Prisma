import { Request, Response } from "express";
import catchAsync from "../../../shared/catchAsync";

import sendResponse from "../../../shared/sendResponse";
import { DoctorScheduleServices } from "./doctorSchedule.services";
import { IAuthUser } from "../../interfaces/common";
import pick from "../../../shared/pick";

const insertIntoDb = catchAsync(
  async (req: Request & { user?: IAuthUser }, res: Response) => {
    const user = req.user;

    const result = await DoctorScheduleServices.insertIntoDb(user, req.body);

    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Doctor Schedule created successfully",
      data: result,
    });
  }
);

const getMySchedule = catchAsync(
  async (req: Request & { user?: IAuthUser }, res) => {
    const user = req.user;
    const filters = pick(req.query, ["startDate", "endDate", "isBooked"]);
    const options = pick(req.query, ["limit", "page", "sortBy", "sortOrder"]);
    const result = await DoctorScheduleServices.getMySchedule(
      filters,
      options,
      user
    );

    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "MyScedule fetched  successful",
      data: result,
    });
  }
);
const deleteFromDb = catchAsync(
  async (req: Request & { user?: IAuthUser }, res) => {
    const user = req.user;

    const {id}=req.params
    const result = await DoctorScheduleServices.deleteFromDb(user as IAuthUser,id);

    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "MyScedule Deleted  successful",
      data: result,
    });
  }
);

export const DoctorShceduleController = {
  insertIntoDb,
  getMySchedule,
  deleteFromDb,
};
