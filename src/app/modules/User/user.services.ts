import {
  Admin,
  Doctor,
  Patient,
  Prisma,
  PrismaClient,
  UserRole,
  UserStatus,
} from "@prisma/client";
import bcrypt from "bcrypt";
import { fileUploader } from "../../../helpers/fileUploader";
import { IFile } from "../../interfaces/file";
import { Request } from "express";
import { IPaginatioOptions } from "../../interfaces/pagination";
import { calcultaePagination } from "../../../helpers/paginationHelper";
import { userSearchAbleFields } from "./user.const";
import { IAuthUser } from "../../interfaces/common";

const prisma = new PrismaClient();

const createAdmin = async (req: Request): Promise<Admin> => {
  const file = req.file as IFile;

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

const createDoctor = async (req: Request): Promise<Doctor> => {
  const file = req.file as IFile;

  console.log(req.body, "body");

  if (file) {
    const uploadTCloudinary = await fileUploader.uploadToCloudinary(file);

    req.body.doctor.profilePhoto = uploadTCloudinary?.secure_url;

    console.log(req.body, "iam body data");
  }

  const hashPassword: string = await bcrypt.hash(req.body.password, 12);
  console.log(hashPassword, "iam hashed");

  const userData = {
    email: req.body?.doctor.email,
    password: hashPassword,
    role: UserRole.DOCTOR,
  };

  const result = await prisma.$transaction(async (transactionClient) => {
    const createdUserData = await transactionClient.user.create({
      data: userData,
    });
    const createdDoctorData = await transactionClient.doctor.create({
      data: req.body.doctor,
    });

    return createdDoctorData;
  });

  return result;
};

const createPatient = async (req: Request): Promise<Patient> => {
  const file = req.file as IFile;

  if (file) {
    const uploadedProfileImage = await fileUploader.uploadToCloudinary(file);
    req.body.patient.profilePhoto = uploadedProfileImage?.secure_url;
  }

  const hashedPassword: string = await bcrypt.hash(req.body.password, 12);

  const userData = {
    email: req.body.patient.email,
    password: hashedPassword,
    role: UserRole.PATIENT,
  };

  const result = await prisma.$transaction(async (transactionClient) => {
    await transactionClient.user.create({
      data: userData,
    });

    const createdPatientData = await transactionClient.patient.create({
      data: req.body.patient,
    });

    return createdPatientData;
  });

  return result;
};

const getAllFromDb = async (params: any, options: IPaginatioOptions) => {
  console.log(params, "params");

  const { limit, page, skip } = calcultaePagination(options);
  const { searchTerm, ...filterDaa } = params;

  const andCondition: Prisma.UserWhereInput[] = [];

  if (params.searchTerm) {
    andCondition.push({
      OR: userSearchAbleFields.map((field) => ({
        [field]: {
          contains: params.searchTerm,
          mode: "insensitive",
        },
      })),
    });
  }

  if (Object.keys(filterDaa).length > 0) {
    andCondition.push({
      AND: Object.keys(filterDaa).map((key) => ({
        [key]: {
          equals: (filterDaa as any)[key],
        },
      })),
    });
  }

  const whereCondition: Prisma.UserWhereInput =
    andCondition.length > 0 ? { AND: andCondition } : {};
  const result = await prisma.user.findMany({
    where: whereCondition,
    skip,
    take: limit,
    orderBy:
      options.sortBy && options.sortOrder
        ? {
            [options.sortBy]: options.sortOrder,
          }
        : {
            createdAt: "desc",
          },

    select: {
      id: true,
      role: true,
      needPasswordChange: true,
      status: true,
      createdAt: true,
      admin: true,
      patient: true,
      doctor: true,
      updatedAt: true,
    },

    //  include:{
    //   admin:true,
    //   patient:true,
    //   doctor:true

    //  }
  });

  const total = await prisma.user.count({
    where: whereCondition,
  });

  return {
    meta: {
      page,
      limit,
      total,
    },
    data: result,
  };
};

const changeProfileStatus = async (id: string, status: UserRole) => {
  const userData = await prisma.user.findUniqueOrThrow({
    where: {
      id,
    },
  });

  const updateUserStatus = await prisma.user.update({
    where: {
      id,
    },
    data: status,
  });

  return updateUserStatus;
};

const getMyProfile = async (user:IAuthUser) => {
  const userInfo = await prisma.user.findUnique({
    where: {
      email: user?.email,
    },
    select: {
      id: true,
      email: true,
      needPasswordChange: true,
      role: true,
      status: true,
    },
  });

  let profileInfo;

  if (userInfo?.role === UserRole.SUPER_ADMIN) {
    profileInfo = await prisma.admin.findUnique({
      where: {
        email: userInfo.email,
      },
    });
  } else if (userInfo?.role === UserRole.ADMIN) {
    profileInfo = await prisma.admin.findUnique({
      where: {
        email: userInfo.email,
      },
    });
  } else if (userInfo?.role === UserRole.DOCTOR) {
    profileInfo = await prisma.doctor.findUnique({
      where: {
        email: userInfo.email,
      },
    });
  } else if (userInfo?.role === UserRole.PATIENT) {
    profileInfo = await prisma.patient.findUnique({
      where: {
        email: userInfo.email,
      },
    });
  }

  return { ...userInfo, ...profileInfo };
};

const updateMyProfile = async (user:IAuthUser, req:Request) => {
  const userInfo = await prisma.user.findUnique({
    where: {
      email: user.email,
      status: UserStatus.ACTIVE,
    },
  });

  let profileInfo;
   const file = req.file as IFile

    
   if (file) {
     const uploadToCloudinary=await fileUploader.uploadToCloudinary(file);
      req.body.profilePhoto=uploadToCloudinary?.secure_url
   }

  if (userInfo?.role === UserRole.SUPER_ADMIN) {
    profileInfo = await prisma.admin.update({
      where: {
        email: userInfo.email,
      },
      data: req.body,
    });
  } else if (userInfo?.role === UserRole.ADMIN) {
    profileInfo = await prisma.admin.update({
      where: {
        email: userInfo.email,
      },
      data: req.body,
    });
  } else if (userInfo?.role === UserRole.DOCTOR) {
    profileInfo = await prisma.doctor.update({
      where: {
        email: userInfo.email,
      },
      data: req.body,
    });
  } else if (userInfo?.role === UserRole.PATIENT) {
    profileInfo = await prisma.patient.update({
      where: {
        email: userInfo.email,
      },
      data: req.body,
    });
  }

  return { ...profileInfo };
};

export const userServices = {
  createAdmin,
  createDoctor,
  createPatient,
  getAllFromDb,
  getMyProfile,
  changeProfileStatus,
  updateMyProfile,
};
