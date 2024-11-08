import { Request, Response } from "express";
import { AdminServices } from "./admin.service";
import pick from "../../../shared/pick";
import { adminFilterableFields } from "./admin.const";

const getAllFromDb = async (req: Request, res: Response) => {
  try {
    const filters = pick(req.query, adminFilterableFields);
    const options = pick(req.query, ["limit", "page", "sortBy", "sortOrder"]);

    console.log(options, "filaters");

    const result = await AdminServices.getAllFromDb(filters, options);

    res.status(200).json({
      success: true,
      message: "Admin Retrived successful",
      meta: result.meta,
      data: result.data,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.name || "something went wrong",
      error: error,
    });
  }
};

const getByIdFromDb = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const result = await AdminServices.getByIdFromDb(id);

    res.status(200).json({
      success: true,
      message: "Admin Retrived  by id  successful",

      data: result,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.name || "something went wrong",
      error: error,
    });
  }
};

const updateIntoDb = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const result = await AdminServices.updateIntoDb(id, req.body);

    res.status(200).json({
      success: true,
      message: "Admin data updated",

      data: result,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.name || "something went wrong",
      error: error,
    });
  }
};

const deleteFromDb = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const result = await AdminServices.deleteFormDb(id);
    res.status(200).json({
      success: true,
      message: "Admin deleted ",
      data: result,
    });
  } catch (error) {}
};

const softDeleteFromDb = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const result = await AdminServices.softDeleteFromDb(id);
    res.status(200).json({
      success: true,
      message: "Admin deleted ",
      data: result,
    });
  } catch (error) {
    res.status(404).json({
      success: false,
      message: "errror ",
      data: error,
    });
  }
};

export const AdminController = {
  getAllFromDb,
  getByIdFromDb,
  updateIntoDb,
  deleteFromDb,
  softDeleteFromDb,
};
