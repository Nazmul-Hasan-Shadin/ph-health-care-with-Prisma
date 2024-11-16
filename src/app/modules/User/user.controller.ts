import { Response, Request } from "express";
import { userServices } from "./user.services";
import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";

const createAdmin = catchAsync(async (req: Request, res: Response) => {


  const result = await userServices.createAdmin(req);

  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "Admin created successfuly!",
    data: result,
  });
});

export const userController = {
  createAdmin,
};
