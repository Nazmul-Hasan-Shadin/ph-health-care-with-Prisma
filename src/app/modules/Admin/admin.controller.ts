import { NextFunction, Request, RequestHandler, Response } from "express";
import { AdminServices } from "./admin.service";
import pick from "../../../shared/pick";
import { adminFilterableFields } from "./admin.const";
import sendResponse from "../../../shared/sendResponse";
import catchAsync from "../../../shared/catchAsync";

const getAllFromDb = catchAsync(async (req, res, next) => {
  const filters = pick(req.query, adminFilterableFields);
  const options = pick(req.query, ["limit", "page", "sortBy", "sortOrder"]);

  console.log(options, "filaters");

  const result = await AdminServices.getAllFromDb(filters, options);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Admin Retrived succesful",
    meta: result.meta,
    data: result.data,
  });
});

const getByIdFromDb = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;

  const result = await AdminServices.getByIdFromDb(id);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Admin data fetch by id",
    data: result,
  });
});

const updateIntoDb = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;

  const result = await AdminServices.updateIntoDb(id, req.body);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Admin updated succesful",

    data: result,
  });
});

const deleteFromDb = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { id } = req.params;
  try {
    const result = await AdminServices.deleteFormDb(id);
    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Admin deleted succesful",

      data: result,
    });
  } catch (error) {
    next(error);
  }
};

const softDeleteFromDb = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { id } = req.params;
  try {
    const result = await AdminServices.softDeleteFromDb(id);
    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Admin delted succesful",

      data: result,
    });
  } catch (error) {
    next(error);
  }
};

export const AdminController = {
  getAllFromDb,
  getByIdFromDb,
  updateIntoDb,
  deleteFromDb,
  softDeleteFromDb,
};
