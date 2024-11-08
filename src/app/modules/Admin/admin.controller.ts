import { Request, Response } from "express";
import { AdminServices } from "./admin.service";

const pick = (obj, keys) => {
  const finalObje = {};
  for (const key of keys) {
    if (obj && Object.hasOwnProperty.call(obj, key)) {
      finalObje[key] = obj[key];
    }
  }

  return finalObje;
};

const getAllFromDb = async (req: Request, res: Response) => {
  try {
    const filters = pick(req.query, ["name", "email", "searchTerm"]);
    const result = await AdminServices.getAllFromDb(filters);

    res.status(200).json({
      success: true,
      message: "Admin Retrived successful",
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

export const AdminController = {
  getAllFromDb,
};
