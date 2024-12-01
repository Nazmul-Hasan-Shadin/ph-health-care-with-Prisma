import { addHours, addMinutes, format } from "date-fns";
import prisma from "../../../shared/prisma";
import { IPaginatioOptions } from "../../interfaces/pagination";
import { calcultaePagination } from "../../../helpers/paginationHelper";
import { Prisma } from "@prisma/client";
import { IAuthUser } from "../../interfaces/common";
import { ScriptSnapshot } from "typescript";

const insertIntoDb = async (payload) => {
  const { startTime, endTime, startDate, endDate } = payload;

  const currentDate = new Date(startDate); //start date
  const lastDate = new Date(endDate); //end date
  console.log(currentDate);
  console.log(lastDate);

  const interval = 30;
  const schedules = [];
  while (currentDate <= lastDate) {
    //   start date with time
    const startDateTime = new Date(
      addMinutes(
        addHours(
          `${format(currentDate, "yyy-MM-dd")}`,
          Number(startTime.split(":")[0])
        ),
        Number(startTime.split(":")[1])
      )
    );

    console.log(startDateTime);

    const endDateTime = new Date(
      addMinutes(
        addHours(
          `${format(currentDate, "yyyy-MM-dd")}`,
          Number(endTime.split(":")[0])
        ),
        Number(endTime.split(":")[1])
      )
    );

    while (startDateTime <= endDateTime) {
      {
        const scheduleData = {
          startDateTime: startDateTime,
          endDateTime: addMinutes(startDateTime, interval),
        };

        const existingSchedule = await prisma.schedule.findFirst({
          where: {
            startDateTime: scheduleData.startDateTime,
            endDateTime: scheduleData.endDateTime,
          },
        });

        if (!existingSchedule) {
          const result = await prisma.schedule.create({
            data: scheduleData,
          });
          schedules.push(result);
        }

        startDateTime.setMinutes(startDateTime.getMinutes() + interval);
      }
    }

    currentDate.setDate(currentDate.getDate() + 1);
  }
  return schedules;
};

const getAllFromDB = async (filters: any, options: IPaginatioOptions, user) => {
  const { limit, page, skip } = calcultaePagination(options);
  const { startDate, endDate, ...filterData } = filters;

  console.log(startDate, endDate);

  const andConditions = [];

  if (startDate && endDate) {
    andConditions.push({
      AND: [
        {
          startDateTime: {
            gte: startDate,
          },
        },

        {
          endDateTime: {
            lte: endDate,
          },
        },
      ],
    });
  }

  if (Object.keys(filterData).length > 0) {
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

  const whereConditions: Prisma.ScheduleWhereInput =
    andConditions.length > 0 ? { AND: andConditions } : {};

  const doctorSchedule = await prisma.doctorSchedule.findMany({
    where: {
      doctor: {
        email: user.email,
      },
    },
  });

  console.log(doctorSchedule, "ho bro");

  const doctorScheduleIds = doctorSchedule.map(
    (schedule) => schedule.scheduleId
  );

  // find doctor booked scedule

  const result = await prisma.schedule.findMany({
    where: {
      ...whereConditions,
      id: {
        notIn: doctorScheduleIds,
      },
    },
    skip,
    take: limit,
    orderBy:
      options.sortBy && options.sortOrder
        ? { [options.sortBy]: options.sortOrder }
        : {
            createdAt: "desc",
          },
  });
  const total = await prisma.schedule.count({
    where: {
      ...whereConditions,
      id: {
        notIn: doctorScheduleIds,
      },
    },
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


  






export const ScheduleService = {
  insertIntoDb,
  getAllFromDB,
};
