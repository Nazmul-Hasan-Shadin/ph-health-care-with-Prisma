-- CreateTable
CREATE TABLE "specialties" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "icon" TEXT NOT NULL,

    CONSTRAINT "specialties_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "doctro_specialiteis" (
    "specialitiesId" TEXT NOT NULL,
    "doctorId" TEXT NOT NULL,

    CONSTRAINT "doctro_specialiteis_pkey" PRIMARY KEY ("specialitiesId","doctorId")
);

-- AddForeignKey
ALTER TABLE "doctro_specialiteis" ADD CONSTRAINT "doctro_specialiteis_specialitiesId_fkey" FOREIGN KEY ("specialitiesId") REFERENCES "specialties"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "doctro_specialiteis" ADD CONSTRAINT "doctro_specialiteis_doctorId_fkey" FOREIGN KEY ("doctorId") REFERENCES "doctors"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
