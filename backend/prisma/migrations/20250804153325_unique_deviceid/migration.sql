/*
  Warnings:

  - A unique constraint covering the columns `[deviceId]` on the table `Student` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Student_deviceId_key" ON "Student"("deviceId");
