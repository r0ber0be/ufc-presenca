/*
  Warnings:

  - You are about to drop the column `googleId` on the `Professor` table. All the data in the column will be lost.
  - You are about to drop the column `login` on the `Professor` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Professor" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "avatarUrl" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "isSynced" BOOLEAN NOT NULL DEFAULT false
);
INSERT INTO "new_Professor" ("avatarUrl", "email", "id", "isSynced", "name") SELECT "avatarUrl", "email", "id", "isSynced", "name" FROM "Professor";
DROP TABLE "Professor";
ALTER TABLE "new_Professor" RENAME TO "Professor";
CREATE UNIQUE INDEX "Professor_email_key" ON "Professor"("email");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
