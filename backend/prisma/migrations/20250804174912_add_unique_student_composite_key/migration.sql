/*
  Warnings:

  - A unique constraint covering the columns `[registrationNumber,deviceId]` on the table `Student` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "Student_registrationNumber_deviceId_idx";

-- CreateIndex
CREATE UNIQUE INDEX "Student_registrationNumber_deviceId_key" ON "Student"("registrationNumber", "deviceId");
