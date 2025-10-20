/*
  Warnings:

  - You are about to drop the column `address` on the `PatientForm` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "PatientForm" DROP COLUMN "address",
ALTER COLUMN "symptoms" DROP NOT NULL;
