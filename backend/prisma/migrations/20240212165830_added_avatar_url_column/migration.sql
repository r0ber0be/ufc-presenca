/*
  Warnings:

  - Added the required column `avatarUrl` to the `Professor` table without a default value. This is not possible if the table is not empty.

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
INSERT INTO "new_Professor" ("email", "id", "isSynced", "name") SELECT "email", "id", "isSynced", "name" FROM "Professor";
DROP TABLE "Professor";
ALTER TABLE "new_Professor" RENAME TO "Professor";
CREATE UNIQUE INDEX "Professor_email_key" ON "Professor"("email");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
