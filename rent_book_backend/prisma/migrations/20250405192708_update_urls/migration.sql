/*
  Warnings:

  - You are about to drop the column `cover_image_url` on the `Book` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Book" DROP COLUMN "cover_image_url",
ADD COLUMN     "cover_images_urls" TEXT[];
