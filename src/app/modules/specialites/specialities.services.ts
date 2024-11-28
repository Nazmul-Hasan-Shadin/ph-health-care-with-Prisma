import { Request } from "express";
import { fileUploader } from "../../../helpers/fileUploader";
import prisma from "../../../shared/prisma";
import { IFile } from "../../interfaces/file";

const insertIntoDb = async (req: Request) => {
  const file = req.file as IFile;

  if (file) {
    const uploadToCloudinary = await fileUploader.uploadToCloudinary(file);
    req.body.icon = uploadToCloudinary?.secure_url;
  }

  const result = await prisma.specialities.create({
    data: req.body,
  });

  return result;
};

const getAllSpecialitiesFromDb = async () => {
  const result = await prisma.specialities.findMany({});
  return result
};


const deleteSpecialitiesFromDb = async (id:string) => {
    const result = await prisma.specialities.delete({
        where:{
            id
        }
    });
    return result
  };


export const SpecialitiesServices = {
  insertIntoDb,
  getAllSpecialitiesFromDb,
  deleteSpecialitiesFromDb
};
