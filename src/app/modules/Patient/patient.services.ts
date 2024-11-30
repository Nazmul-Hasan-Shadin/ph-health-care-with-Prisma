import { Patient, Prisma, UserStatus } from "@prisma/client";
import prisma from "../../../shared/prisma";
import { IPatientFilterRequest, IPatientUpdate } from "./patient.interface";

import { IPaginatioOptions } from "../../interfaces/pagination";
import { calcultaePagination } from "../../../helpers/paginationHelper";
import { patientSearchableFields } from "./patient.const";

const getAllFromDB = async (
  filters: IPatientFilterRequest,
  options: IPaginatioOptions
) => {
  const { limit, page, skip } = calcultaePagination(options);
  const { searchTerm, ...filterData } = filters;

  const andConditions = [];

  if (searchTerm) {
    andConditions.push({
      OR: patientSearchableFields.map((field) => ({
        [field]: {
          contains: searchTerm,
          mode: "insensitive",
        },
      })),
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
  andConditions.push({
    isDeleted: false,
  });

  const whereConditions: Prisma.PatientWhereInput =
    andConditions.length > 0 ? { AND: andConditions } : {};

  const result = await prisma.patient.findMany({
    where: whereConditions,
    skip,
    take: limit,
    orderBy:
      options.sortBy && options.sortOrder
        ? { [options.sortBy]: options.sortOrder }
        : {
            createdAt: "desc",
          },
    include: {
      medicalReport: true,
      patientHealthData: true,
    },
  });
  const total = await prisma.patient.count({
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

const getByIdFromDB = async (id: string): Promise<Patient | null> => {
  const result = await prisma.patient.findUnique({
    where: {
      id,
      isDeleted: false,
    },
    include: {
      medicalReport: true,
      patientHealthData: true,
    },
  });
  return result;
};

const updatePatientIntoDb = async (id: string, payload: any):Promise<Patient | null> => {
  const { patientHealthData, medicalReport, ...patientData } = payload;

  const patientInfo = await prisma.patient.findUnique({
    where: {
      id,
    },
  });

  const result = await prisma.$transaction(async (transactionClient) => {
    //update patient data
    const updatedPatient = await prisma.patient.update({
      where: {
        id,
      },
      data: patientData,
      include: {
        patientHealthData: true,
        medicalReport: true,
      },
    });

    //create or update patient helath data

    if (patientHealthData) {
      const helathData = await transactionClient.patientHealthData.upsert({
        where: {
          patientId: patientInfo!.id,
        },
        update: patientHealthData,
        create: {
          ...patientHealthData,
          patientId: patientInfo?.id,
        },
      });
      console.log(helathData, "bro");
    }

    if (medicalReport) {
      const report = await transactionClient.medicalReport.create({
        data: { ...medicalReport, patientId: patientInfo?.id },
      });
    }
  });

  const responseData = await prisma.patient.findUnique({
    where: { id: patientInfo?.id },
    include: {
      patientHealthData: true,
      medicalReport: true,
    },
  });

  return responseData;
};

    
  const deleteFromDb= async(id:string)=>{

      
   const result= await prisma.$transaction(async(transactionClient)=>{
     
    await transactionClient.medicalReport.deleteMany({
      where:{
        patientId:id
      }
    })


    await transactionClient.patientHealthData.delete({
      where:{
        patientId:id
      }
    })

   const deletedPatient= await transactionClient.patient.delete({
      where:{
        id:id
      }
    })

    await transactionClient.user.delete({
      where:{
        email:deletedPatient.email
      }
    })






   })

    return result

     
  }

export const PatientService = {
  getAllFromDB,
  getByIdFromDB,
  updatePatientIntoDb,
  deleteFromDb
};
