/*
  Warnings:

  - A unique constraint covering the columns `[employeeId,dayOfWeek]` on the table `WorkingHours` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "WorkingHours_employeeId_dayOfWeek_key" ON "WorkingHours"("employeeId", "dayOfWeek");
