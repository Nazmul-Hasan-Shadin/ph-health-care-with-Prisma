import { Prisma, PrismaClient } from "@prisma/client";
import { dir } from "console";

const prisma = new PrismaClient();

const getAllFromDb = async (params: any) => {
  const { searchTerm, ...filterDaa } = params;

  const andCondition: Prisma.AdminWhereInput[] = [];

  const adminSearchAbleField = ["name", "email"];

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

  const whereCondition: Prisma.AdminWhereInput = { AND: andCondition };
  const result = await prisma.admin.findMany({
    where: whereCondition,
  });
  return result;
};

export const AdminServices = {
  getAllFromDb,
};
