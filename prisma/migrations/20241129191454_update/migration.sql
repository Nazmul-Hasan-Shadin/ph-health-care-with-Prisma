/*
  Warnings:

  - The `maritalStatus` column on the `patient_healt_data` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "patient_healt_data" ALTER COLUMN "hasAllergies" DROP NOT NULL,
ALTER COLUMN "hasAllergies" SET DEFAULT false,
ALTER COLUMN "hasDiabetes" DROP NOT NULL,
ALTER COLUMN "smokingStatus" DROP NOT NULL,
ALTER COLUMN "smokingStatus" SET DEFAULT false,
ALTER COLUMN "dietaryPreferences" DROP NOT NULL,
ALTER COLUMN "pregnancyStatus" DROP NOT NULL,
ALTER COLUMN "pregnancyStatus" SET DEFAULT false,
ALTER COLUMN "mentalHealthHistory" DROP NOT NULL,
ALTER COLUMN "immunizationStatus" DROP NOT NULL,
ALTER COLUMN "hasPastSurgeries" DROP NOT NULL,
ALTER COLUMN "hasPastSurgeries" SET DEFAULT false,
ALTER COLUMN "recentAnxiety" DROP NOT NULL,
ALTER COLUMN "recentDepression" DROP NOT NULL,
ALTER COLUMN "recentDepression" SET DEFAULT false,
DROP COLUMN "maritalStatus",
ADD COLUMN     "maritalStatus" "MaritalStatus" NOT NULL DEFAULT 'UNMARRIED';
