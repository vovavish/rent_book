/*
  Warnings:

  - Made the column `message` on table `Rental` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Rental" ALTER COLUMN "message" SET NOT NULL;
