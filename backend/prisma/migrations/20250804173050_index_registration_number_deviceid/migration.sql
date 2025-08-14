-- DropIndex
DROP INDEX "Student_registrationNumber_idx";

-- CreateIndex
CREATE INDEX "Student_registrationNumber_deviceId_idx" ON "Student"("registrationNumber", "deviceId");
