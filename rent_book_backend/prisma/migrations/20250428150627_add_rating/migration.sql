/*
  Warnings:

  - Added the required column `bookAuthor` to the `Rental` table without a default value. This is not possible if the table is not empty.
  - Added the required column `bookCategory` to the `Rental` table without a default value. This is not possible if the table is not empty.
  - Added the required column `bookCondition` to the `Rental` table without a default value. This is not possible if the table is not empty.
  - Added the required column `bookDescription` to the `Rental` table without a default value. This is not possible if the table is not empty.
  - Added the required column `bookLanguage` to the `Rental` table without a default value. This is not possible if the table is not empty.
  - Added the required column `bookPublishedYear` to the `Rental` table without a default value. This is not possible if the table is not empty.
  - Added the required column `bookTitle` to the `Rental` table without a default value. This is not possible if the table is not empty.
  - Added the required column `ownerLastname` to the `Rental` table without a default value. This is not possible if the table is not empty.
  - Added the required column `ownerName` to the `Rental` table without a default value. This is not possible if the table is not empty.
  - Added the required column `pricePerDay` to the `Rental` table without a default value. This is not possible if the table is not empty.
  - Added the required column `renterLastname` to the `Rental` table without a default value. This is not possible if the table is not empty.
  - Added the required column `renterName` to the `Rental` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Book" ADD COLUMN     "bookRating" DOUBLE PRECISION NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "Rental" ADD COLUMN     "bookAuthor" TEXT NOT NULL,
ADD COLUMN     "bookCategory" TEXT NOT NULL,
ADD COLUMN     "bookCondition" "Condition" NOT NULL,
ADD COLUMN     "bookCoverImages" TEXT[],
ADD COLUMN     "bookDescription" TEXT NOT NULL,
ADD COLUMN     "bookLanguage" TEXT NOT NULL,
ADD COLUMN     "bookPublishedYear" INTEGER NOT NULL,
ADD COLUMN     "bookRating" INTEGER,
ADD COLUMN     "bookTitle" TEXT NOT NULL,
ADD COLUMN     "deposit" DOUBLE PRECISION,
ADD COLUMN     "ownerLastname" TEXT NOT NULL,
ADD COLUMN     "ownerName" TEXT NOT NULL,
ADD COLUMN     "ownerPhones" TEXT[],
ADD COLUMN     "ownerRating" INTEGER,
ADD COLUMN     "ownerSurname" TEXT,
ADD COLUMN     "pricePerDay" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "renterLastname" TEXT NOT NULL,
ADD COLUMN     "renterName" TEXT NOT NULL,
ADD COLUMN     "renterPhones" TEXT[],
ADD COLUMN     "renterRating" INTEGER,
ADD COLUMN     "renterSurname" TEXT;

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "ownerRating" DOUBLE PRECISION NOT NULL DEFAULT 0,
ADD COLUMN     "readerRating" DOUBLE PRECISION NOT NULL DEFAULT 0;
