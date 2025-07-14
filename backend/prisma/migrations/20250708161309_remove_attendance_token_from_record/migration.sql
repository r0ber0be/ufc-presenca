/*
  Warnings:

  - You are about to drop the column `attendanceTokenId` on the `ClassAttendanceRecord` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "ClassAttendanceRecord" DROP COLUMN "attendanceTokenId";
