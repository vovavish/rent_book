-- AlterTable
ALTER TABLE "Book" ADD COLUMN     "indexBBK" TEXT,
ADD COLUMN     "indexUDK" TEXT,
ADD COLUMN     "isnm" TEXT;

-- AlterTable
ALTER TABLE "Rental" ADD COLUMN     "bookIndexBBK" TEXT,
ADD COLUMN     "bookIndexUDK" TEXT,
ADD COLUMN     "bookIsnm" TEXT;
