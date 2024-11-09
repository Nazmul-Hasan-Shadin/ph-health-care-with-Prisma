import { NextFunction, Response } from "express";
import { AnyZodObject } from "zod";

export const validateRequest = (zodSchema: AnyZodObject) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      await zodSchema.parseAsync({
        body: req.body,
      });

      next();
    } catch (err) {
      next(err);
    }
  };
};
