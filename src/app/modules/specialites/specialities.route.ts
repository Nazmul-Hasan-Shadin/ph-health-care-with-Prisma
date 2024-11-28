import express, { NextFunction, Request, Response } from "express";

import auth from "../../middlewares/auth";
import { UserRole } from "@prisma/client";
import { SpecialitiesController } from "./specialities.controller";
import { fileUploader } from "../../../helpers/fileUploader";
import { SpecialitiesValidation } from "./specilities.validation";

const router = express.Router();

router.post(
  "/",

  fileUploader.upload.single("file"),

  (req: Request, res: Response, next: NextFunction) => {
    req.body = SpecialitiesValidation.create.parse(JSON.parse(req.body.data));

    return SpecialitiesController.insertIntoDb(req, res, next);
  }
);

router.get("/", SpecialitiesController.getAllSpecialitiees);

router.delete("/:id", SpecialitiesController.deleteSpecialitiees);

export const SpecialitiesRoutes = router;
