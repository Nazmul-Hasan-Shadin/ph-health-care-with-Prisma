import { Prisma } from "@prisma/client";
import { calcultaePagination } from "../../../helpers/paginationHelper";
import prisma from "../../../shared/prisma";
import { IAuthUser } from "../../interfaces/common";
import { IPaginatioOptions } from "../../interfaces/pagination";
import AppError from "../../Errors/AppError";

const insertIntoDb = async (
  user: any,
  payload: {
    scheduleIds: string[];
  }
) => {
  console.log(payload.scheduleIds);

  const doctorData = await prisma.doctor.findUniqueOrThrow({
    where: {
      email: user.email,
    },
  });

  const doctorScheduledata = payload?.scheduleIds?.map((scheduleId) => ({
    doctorId: doctorData.id,
    scheduleId,
  }));

  const result = await prisma.doctorSchedule.createMany({
    data: doctorScheduledata,
  });

  return result;
};

const getMySchedule = async (
  filters: any,
  options: IPaginatioOptions,
  user: IAuthUser
) => {
  const { limit, page, skip } = calcultaePagination(options);
  const { startDate, endDate, ...filterData } = filters;

  console.log(filterData, "ifilterddat");

  const andConditions = [];

  if (startDate && endDate) {
    andConditions.push({
      AND: [
        {
          schedule: {
            startDateTime: {
              lte: startDate,
            },
          },
        },

        {
          schedule: {
            endDateTime: {
              lte: endDate,
            },
          },
        },
      ],
    });
  }

  if (Object.keys(filterData).length > 0) {
    if (
      typeof filterData.isBooked === "string" &&
      filterData.isBooked === "true"
    ) {
      filterData.isBooked = true;
    } else if (
      typeof filterData.isBooked === "string" &&
      filterData.isBooked === "false"
    ) {
      filterData.isBooked = false;
    }

    andConditions.push({
      AND: Object.keys(filterData).map((key) => {
        return {
          [key]: {
            equals: (filterData as any)[key],
          },
        };
      }),
    });
  }

  const whereConditions: Prisma.DoctorScheduleWhereInput =
    andConditions.length > 0 ? { AND: andConditions } : {};

  // find doctor booked scedule

  const result = await prisma.doctorSchedule.findMany({
    where: whereConditions,
    skip,
    take: limit,
    orderBy:
      options.sortBy && options.sortOrder
        ? { [options.sortBy]: options.sortOrder }
        : {},
  });
  const total = await prisma.doctorSchedule.count({
    where: whereConditions,
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

const deleteFromDb = async (user: IAuthUser, scheduleId: string) => {
  const doctorData = await prisma.doctor.findUniqueOrThrow({
    where: {
      email: user?.email,
    },
  });

  const isBookedSchedule = await prisma.doctorSchedule.findFirst({
    where: {
      doctorId: doctorData.id,
      scheduleId: scheduleId,

      isBooked: true,
    },
  });

  if (isBookedSchedule) {
    throw new AppError(
      500,
      "You can not delete the schedule because of the schedule is already booked!"
    );
  }

  const result = await prisma.doctorSchedule.delete({
    where: {
      doctorId_scheduleId: {
        doctorId: doctorData.id,
        scheduleId: scheduleId,
      },
    },
  });

  return result;
};

export const DoctorScheduleServices = {
  insertIntoDb,
  getMySchedule,
  deleteFromDb,
};
