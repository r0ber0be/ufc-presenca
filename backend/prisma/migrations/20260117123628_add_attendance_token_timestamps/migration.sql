/*
  Warnings:

  - You are about to drop the column `classBlock` on the `Class` table. All the data in the column will be lost.
  - You are about to drop the column `classRoom` on the `Class` table. All the data in the column will be lost.
  - Added the required column `capacityOfEnrollments` to the `Class` table without a default value. This is not possible if the table is not empty.
  - Added the required column `location` to the `Class` table without a default value. This is not possible if the table is not empty.
  - Added the required column `ongoingSemester` to the `Class` table without a default value. This is not possible if the table is not empty.
  - Added the required column `quantityOfEnrollments` to the `Class` table without a default value. This is not possible if the table is not empty.
  - Added the required column `semesterBeginsIn` to the `Class` table without a default value. This is not possible if the table is not empty.
  - Added the required column `semesterEndsIn` to the `Class` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "AttendanceToken" ADD COLUMN     "issuedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "revokedAt" TIMESTAMP(3),
ADD COLUMN     "usedAt" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "Class" DROP COLUMN "classBlock",
DROP COLUMN "classRoom",
ADD COLUMN     "capacityOfEnrollments" INTEGER NOT NULL,
ADD COLUMN     "current" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "location" TEXT NOT NULL,
ADD COLUMN     "ongoingSemester" TEXT NOT NULL,
ADD COLUMN     "quantityOfEnrollments" INTEGER NOT NULL,
ADD COLUMN     "semesterBeginsIn" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "semesterEndsIn" TIMESTAMP(3) NOT NULL;
