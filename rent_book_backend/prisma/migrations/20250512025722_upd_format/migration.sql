/*
  Warnings:

  - The values [SmallFormat,PocketEdition,Miniature,TinyBook,Folio] on the enum `Format` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "Format_new" AS ENUM ('ExtraLarge', 'Large', 'MediumLarge', 'Standard', 'Small', 'ExtraSmall');
ALTER TABLE "Book" ALTER COLUMN "format" TYPE "Format_new" USING ("format"::text::"Format_new");
ALTER TABLE "Rental" ALTER COLUMN "bookFormat" TYPE "Format_new" USING ("bookFormat"::text::"Format_new");
ALTER TYPE "Format" RENAME TO "Format_old";
ALTER TYPE "Format_new" RENAME TO "Format";
DROP TYPE "Format_old";
COMMIT;
