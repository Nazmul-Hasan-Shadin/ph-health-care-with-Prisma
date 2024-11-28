import { Response, Request } from "express";
import { userServices } from "./user.services";
import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import pick from "../../../shared/pick";
import { userFilterableFields } from "./user.const";
import { IAuthUser } from "../../interfaces/common";

const createAdmin = catchAsync(async (req: Request, res: Response) => {
  const result = await userServices.createAdmin(req);

  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "Admin created successfuly!",
    data: result,
  });
});

const createDoctor = catchAsync(async (req: Request, res: Response) => {
  const result = await userServices.createDoctor(req);

  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "Doctor created successfuly!",
    data: result,
  });
});

const createPatient = catchAsync(async (req: Request, res: Response) => {
  const result = await userServices.createPatient(req);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Patient Created successfuly!",
    data: result,
  });
});

const getAllFromDb = catchAsync(async (req, res, next) => {
  const filters = pick(req.query, userFilterableFields);
  const options = pick(req.query, ["limit", "page", "sortBy", "sortOrder"]);

  console.log(options, "filaters");

  const result = await userServices.getAllFromDb(filters, options);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "users are Retrived succesful",
    meta: result.meta,
    data: result.data,
  });
});

const changeProfileStatus = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await userServices.changeProfileStatus(id, req.body);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Users profile status changed!",
    data: result,
  });
});

const getMyProfile = catchAsync(async (req: Request, res: Response) => {
  const user = req.user;

  const result = await userServices.getMyProfile(user);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "My profile data fetched!",
    data: result,
  });
});

const updateMyProfile = catchAsync(async (req: Request & {user?:IAuthUser}, res: Response) => {
  const user = req.user;
  console.log(req.file);
  

  const result = await userServices.updateMyProfile(user as IAuthUser,req);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "My profile updated!",
    data: result,
  });
});

export const userController = {
  createAdmin,
  createDoctor,
  createPatient,
  getAllFromDb,
  changeProfileStatus,
  getMyProfile,
  updateMyProfile,
};
