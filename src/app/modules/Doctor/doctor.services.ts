import { calcultaePagination } from "../../../helpers/paginationHelper";
import prisma from "../../../shared/prisma";
import { doctorSearchableFields } from "./doctor.const";
import { Doctor, Prisma } from "@prisma/client";

const getAllDoctorFromDb = async (filters, options) => {
  console.log("iam hit");

  const { searchTerm, specialities, ...filterData } = filters;
  console.log(searchTerm, "iam specialiti");

  const { limit, page, skip } = calcultaePagination(options);

  const andCondition: Prisma.DoctorWhereInput[] = [];

  if (searchTerm) {
    andCondition.push({
      OR: doctorSearchableFields.map((field) => ({
        [field]: {
          contains: searchTerm,
          mode: "insensitive",
        },
      })),
    });
  }

  //doctor> doctorspecialities> specialities-->title

  if (specialities && specialities.length > 0) {
    andCondition.push({
      doctorSpecialties: {
        some: {
          Specialities: {
            title: {
              contains: specialities,
              mode: "insensitive",
            },
          },
        },
      },
    });
  }

  if (Object.keys(filterData).length > 0) {
    const filterCondition = Object.keys(filterData).map((key) => ({
      [key]: {
        equals: filterData[key],
      },
    }));
    andCondition.push(...filterCondition);
  }

  andCondition.push({
    isDeleted: false,
  });

  const whereCondition: Prisma.DoctorWhereInput =
    andCondition.length > 0 ? { AND: andCondition } : {};

  const result = await prisma.doctor.findMany({
    where: whereCondition,
    skip,
    take: limit,
    include: {
      doctorSpecialties: {
        include: {
          Specialities: true,
        },
      },
    },
  });

  const total = await prisma.doctor.count({
    where: whereCondition,
  });

  return {
    meta: {
      total,
      page,
      limit,
    },
    data: result,
  };
};

const getByIdFromDB = async (id: string): Promise<Doctor | null> => {
  const result = await prisma.doctor.findUnique({
    where: {
      id,
      isDeleted: false,
    },
    include: {
      doctorSpecialties: {
        include: {
          Specialities: true,
        },
      },
    },
  });
  return result;
};

const updateDoctorIntoDb = async (id: string, payload: any) => {
  const { specialities, ...doctorData } = payload;

  console.log(specialities, doctorData);

  const doctorInfo = await prisma.doctor.findUniqueOrThrow({
    where: {
      id,
    },
  });

  await prisma.$transaction(async (transactionClient) => {
    const updateDoctorData = await transactionClient.doctor.update({
      where: {
        id,
      },
      data: doctorData,
      include: {
        doctorSpecialties: true,
      },
    });

    if (specialities && specialities.length > 0) {
      //delete  specilities
      const deleteSpecialities = specialities.filter(
        (speciality) => speciality.isDeleted
      );

      for (const specalities of deleteSpecialities) {
        await transactionClient.doctorSpecialties.deleteMany({
          where: {
            doctorId: doctorInfo.id,
            specialitiesId: specalities.specialitiesId,
          },
        });
      }

      //   create specilities
      const createSpecialities = specialities.filter(
        (speciality) => !speciality.isDeleted
      );

      for (const specalities of createSpecialities) {
        await transactionClient.doctorSpecialties.create({
          data: {
            doctorId: doctorInfo.id,
            specialitiesId: specalities.specialitiesId,
          },
        });
      }
    }

    // for (const specalitiId of specialities) {
    //   const createDoctorSpecialties =
    //     await transactionClient.doctorSpecialties.create({
    //       data: {
    //         doctorId: doctorInfo.id,
    //         specialitiesId: specalitiId,
    //       },
    //     });
    // }

    return updateDoctorData;
  });

  const result = await prisma.doctor.findUnique({
    where: {
      id: doctorInfo.id,
    },
    include: {
      doctorSpecialties: {
        include: {
          Specialities: true,
        },
      },
    },
  });

  return result;
};

export const DoctorServices = {
  updateDoctorIntoDb,
  getAllDoctorFromDb,
  getByIdFromDB,
};
