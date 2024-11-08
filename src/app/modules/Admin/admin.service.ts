import { Admin, Prisma, PrismaClient, UserStatus } from "@prisma/client";
import { dir } from "console";
import { adminSearchAbleField } from "./admin.const";
import { calcultaePagination } from "../../../helpers/paginationHelper";
import prisma from "../../../shared/prisma";

const getAllFromDb = async (params: any, options: any) => {
  const { limit, page, skip } = calcultaePagination(options);
  const { searchTerm, ...filterDaa } = params;

  const andCondition: Prisma.AdminWhereInput[] = [];

  if (params.searchTerm) {
    andCondition.push({
      OR: adminSearchAbleField.map((field) => ({
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
          equals: filterDaa[key],
        },
      })),
    });
  }

  andCondition.push({
    isDeleted: false,
  });

  const whereCondition: Prisma.AdminWhereInput = { AND: andCondition };
  const result = await prisma.admin.findMany({
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
  });

  const total = await prisma.admin.count({
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

const getByIdFromDb = async (id: string): Promise<Admin | null> => {
  const result = await prisma.admin.findUnique({
    where: {
      id: id,
      isDeleted: false,
    },
  });

  return result;
};

const updateIntoDb = async (
  id: string,
  data: Partial<Admin>
): Promise<Admin> => {
  await prisma.admin.findUniqueOrThrow({
    where: {
      id,
    },
  });
  const result = await prisma.admin.update({
    where: {
      id,
      isDeleted: false,
    },
    data,
  });

  return result;
};

const deleteFormDb = async (id: string): Promise<Admin | null> => {
  await prisma.admin.findUniqueOrThrow({
    where: {
      id,
    },
  });

  const result = await prisma.$transaction(async (transactionClient) => {
    const adminDeletedData = await transactionClient.admin.delete({
      where: {
        id,
      },
    });

    await transactionClient.user.delete({
      where: {
        email: adminDeletedData.email,
      },
    });

    return adminDeletedData;
  });
  return result;
};

const softDeleteFromDb = async (id: string) => {
  const result = await prisma.$transaction(async (transactionClient) => {
    const adminDeletedData = await transactionClient.admin.update({
      where: {
        id,
        isDeleted: false,
      },
      data: {
        isDeleted: true,
      },
    });

    await transactionClient.user.update({
      where: {
        email: adminDeletedData.email,
      },
      data: {
        status: UserStatus.DELETED,
      },
    });

    return adminDeletedData;
  });
  return result;
};

export const AdminServices = {
  getAllFromDb,
  getByIdFromDb,
  updateIntoDb,
  deleteFormDb,
  softDeleteFromDb,
};
