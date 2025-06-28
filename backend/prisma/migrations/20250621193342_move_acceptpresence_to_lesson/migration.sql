/*
  Warnings:

  - The values [MONDAY,TUESDAY,WEDNESDAY,THURSDAY,FRIDAY,SATURDAY,SUNDAY] on the enum `WeekDay` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `acceptPresenceByQRCode` on the `Class` table. All the data in the column will be lost.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "WeekDay_new" AS ENUM ('SEG', 'TER', 'QUA', 'QUI', 'SEX', 'SAB', 'DOM');
ALTER TABLE "Schedule" ALTER COLUMN "weekDay" TYPE "WeekDay_new" USING ("weekDay"::text::"WeekDay_new");
ALTER TYPE "WeekDay" RENAME TO "WeekDay_old";
ALTER TYPE "WeekDay_new" RENAME TO "WeekDay";
DROP TYPE "WeekDay_old";
COMMIT;

-- AlterTable
ALTER TABLE "Class" DROP COLUMN "acceptPresenceByQRCode";

-- AlterTable
ALTER TABLE "Lesson" ADD COLUMN     "acceptPresenceByQRCode" BOOLEAN NOT NULL DEFAULT false;
