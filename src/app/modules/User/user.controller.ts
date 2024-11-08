import { Response, Request } from "express";
import { userServices } from "./user.services";

const createAdmin = async (req: Request, res: Response) => {
  //   console.log(req.body);
  try {
    const result = await userServices.createAdmin(req.body.data);
    res.status(200).json({
      success: true,
      message: "Admin created successfuly!",
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

export const userController = {
  createAdmin,
};
