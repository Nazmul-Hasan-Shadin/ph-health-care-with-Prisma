import prisma from "../../../shared/prisma";

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
};
