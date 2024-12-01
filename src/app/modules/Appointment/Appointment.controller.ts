import { Request } from "express";
import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import { AppointmentServices } from "./appointment.services";
import { IAuthUser } from "../../interfaces/common";

const createAppointment = catchAsync(async (req:Request & {user?:IAuthUser}, res) => {
    const user=req.user
  const result = await AppointmentServices.createAppointment(user as IAuthUser ,req.body);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Appointment created  successful",
    data: result,
  });
});

export const AppointmentController = {
  createAppointment,
};
