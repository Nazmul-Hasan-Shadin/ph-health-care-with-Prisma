import { NextFunction, Request, Response } from "express";
import { jwtHelpers } from "../../helpers/jwtHelpers";
import { Secret } from "jsonwebtoken";

import AppError from "../Errors/AppError";
import config from "../../config";

const auth = (...roles: string[]) => {
  return async (req: Request & {user?:any}, res: Response, next: NextFunction) => {
    try {
      const token = req.headers.authorization;
      if (!token) {
        throw new AppError(404, "you are unauthorized");
      }
      const verifiedUser = jwtHelpers.verifyToken(
        token,
        config.jwt.jwt_secret as string
      );

      req.user=verifiedUser;

      if (roles.length && !roles.includes(verifiedUser.role)) {
        throw new AppError(404, "YOu are not authorized");
      }

      next();
    } catch (error) {
      next(error);
    }
  };
};

export default auth;
