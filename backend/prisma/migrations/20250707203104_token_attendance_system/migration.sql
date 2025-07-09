/*
  Warnings:

  - You are about to drop the column `numberOfStudents` on the `Class` table. All the data in the column will be lost.
  - You are about to drop the column `enrollmentId` on the `Student` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[registrationNumber]` on the table `Student` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `attendanceTokenId` to the `ClassAttendanceRecord` table without a default value. This is not possible if the table is not empty.
  - Added the required column `deviceId` to the `ClassAttendanceRecord` table without a default value. This is not possible if the table is not empty.
  - Added the required column `latitude` to the `ClassAttendanceRecord` table without a default value. This is not possible if the table is not empty.
  - Added the required column `longitude` to the `ClassAttendanceRecord` table without a default value. This is not possible if the table is not empty.
  - Added the required column `deviceId` to the `Student` table without a default value. This is not possible if the table is not empty.
  - Added the required column `registrationNumber` to the `Student` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "Student_enrollmentId_key";

-- AlterTable
ALTER TABLE "Class" DROP COLUMN "numberOfStudents";

-- AlterTable
ALTER TABLE "ClassAttendanceRecord" ADD COLUMN     "attendanceTokenId" TEXT NOT NULL,
ADD COLUMN     "deviceId" TEXT NOT NULL,
ADD COLUMN     "latitude" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "longitude" DOUBLE PRECISION NOT NULL;

-- AlterTable
ALTER TABLE "Lesson" ADD COLUMN     "latitude" DOUBLE PRECISION,
ADD COLUMN     "longitude" DOUBLE PRECISION;

-- AlterTable
ALTER TABLE "Student" DROP COLUMN "enrollmentId",
ADD COLUMN     "deviceId" TEXT NOT NULL,
ADD COLUMN     "registrationNumber" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "AttendanceToken" (
    "id" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "currentUsageCount" INTEGER NOT NULL DEFAULT 0,
    "used" BOOLEAN NOT NULL DEFAULT false,
    "lessonId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AttendanceToken_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "AttendanceToken_token_key" ON "AttendanceToken"("token");

-- CreateIndex
CREATE UNIQUE INDEX "AttendanceToken_lessonId_key" ON "AttendanceToken"("lessonId");

-- CreateIndex
CREATE INDEX "Class_teacherId_idx" ON "Class"("teacherId");

-- CreateIndex
CREATE INDEX "ClassAttendanceRecord_studentId_idx" ON "ClassAttendanceRecord"("studentId");

-- CreateIndex
CREATE INDEX "ClassAttendanceRecord_lessonId_idx" ON "ClassAttendanceRecord"("lessonId");

-- CreateIndex
CREATE INDEX "Lesson_classId_idx" ON "Lesson"("classId");

-- CreateIndex
CREATE UNIQUE INDEX "Student_registrationNumber_key" ON "Student"("registrationNumber");

-- CreateIndex
CREATE INDEX "Student_registrationNumber_idx" ON "Student"("registrationNumber");

-- CreateIndex
CREATE INDEX "Teacher_uid_idx" ON "Teacher"("uid");

-- AddForeignKey
ALTER TABLE "AttendanceToken" ADD CONSTRAINT "AttendanceToken_lessonId_fkey" FOREIGN KEY ("lessonId") REFERENCES "Lesson"("id") ON DELETE CASCADE ON UPDATE CASCADE;
