/*
  Warnings:

  - The primary key for the `doctor_scheduled` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `scheduleIds` on the `doctor_scheduled` table. All the data in the column will be lost.
  - Added the required column `scheduleId` to the `doctor_scheduled` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "doctor_scheduled" DROP CONSTRAINT "doctor_scheduled_scheduleIds_fkey";

-- AlterTable
ALTER TABLE "doctor_scheduled" DROP CONSTRAINT "doctor_scheduled_pkey",
DROP COLUMN "scheduleIds",
ADD COLUMN     "scheduleId" TEXT NOT NULL,
ADD CONSTRAINT "doctor_scheduled_pkey" PRIMARY KEY ("doctorId", "scheduleId");

-- AddForeignKey
ALTER TABLE "doctor_scheduled" ADD CONSTRAINT "doctor_scheduled_scheduleId_fkey" FOREIGN KEY ("scheduleId") REFERENCES "schedules"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
