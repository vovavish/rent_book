-- AlterTable
ALTER TABLE "users" ADD COLUMN     "card_numbers" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "phone_numbers" TEXT[] DEFAULT ARRAY[]::TEXT[];
