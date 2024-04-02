/*
  Warnings:

  - You are about to drop the column `displayName` on the `Professor` table. All the data in the column will be lost.
  - You are about to drop the column `photoURL` on the `Professor` table. All the data in the column will be lost.
  - Added the required column `name` to the `Professor` table without a default value. This is not possible if the table is not empty.
  - Added the required column `picture` to the `Professor` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Professor" (
    "uid" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "picture" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "isSynced" BOOLEAN NOT NULL DEFAULT false
);
INSERT INTO "new_Professor" ("email", "isSynced", "uid") SELECT "email", "isSynced", "uid" FROM "Professor";
DROP TABLE "Professor";
ALTER TABLE "new_Professor" RENAME TO "Professor";
CREATE UNIQUE INDEX "Professor_uid_key" ON "Professor"("uid");
CREATE UNIQUE INDEX "Professor_email_key" ON "Professor"("email");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
