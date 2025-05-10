-- AlterTable
ALTER TABLE "Book" ADD COLUMN     "isCashPayment" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "Rental" ADD COLUMN     "bookIsCashPayment" BOOLEAN NOT NULL DEFAULT false;
