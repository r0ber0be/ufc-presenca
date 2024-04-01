/*
  Warnings:

  - The primary key for the `Professor` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `Professor` table. All the data in the column will be lost.
  - Added the required column `uid` to the `Professor` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Professor" (
    "uid" TEXT NOT NULL PRIMARY KEY,
    "displayName" TEXT NOT NULL,
    "photoURL" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "isSynced" BOOLEAN NOT NULL DEFAULT false
);
INSERT INTO "new_Professor" ("displayName", "email", "isSynced", "photoURL") SELECT "displayName", "email", "isSynced", "photoURL" FROM "Professor";
DROP TABLE "Professor";
ALTER TABLE "new_Professor" RENAME TO "Professor";
CREATE UNIQUE INDEX "Professor_uid_key" ON "Professor"("uid");
CREATE UNIQUE INDEX "Professor_email_key" ON "Professor"("email");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
