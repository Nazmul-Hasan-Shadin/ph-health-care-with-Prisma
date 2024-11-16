import { PrismaClient, UserRole } from "@prisma/client";
import bcrypt from "bcrypt";
import { fileUploader } from "../../../helpers/fileUploader";

const prisma = new PrismaClient();

const createAdmin = async (req: any) => {
  const file = req.file;

  console.log(req.body, "body");

  if (file) {
    const uploadTCloudinary = await fileUploader.uploadToCloudinary(file);
  
    
    req.body.admin.profilePhoto = uploadTCloudinary?.secure_url;

    console.log(req.body, "iam body data");
  }



  const hashPassword: string = await bcrypt.hash(req.body.password, 12);
  console.log(hashPassword, "iam hashed");

  const userData = {
    email: req.body?.admin.email,
    password: hashPassword,
    role: UserRole.ADMIN,
  };

  const result = await prisma.$transaction(async (transactionClient) => {
    const createdUserData = await transactionClient.user.create({
      data: userData,
    });
    const createdAdminData = await transactionClient.admin.create({
      data: req.body.admin,
    });

    return createdAdminData;
  });

  return result;
};

export const userServices = {
  createAdmin,
};
