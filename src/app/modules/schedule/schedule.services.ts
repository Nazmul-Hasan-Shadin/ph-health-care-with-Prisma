import { addHours, addMinutes, format } from "date-fns";
import prisma from "../../../shared/prisma";

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

export const ScheduleService = {
  insertIntoDb,
};
