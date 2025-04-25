-- CreateEnum
CREATE TYPE "Role" AS ENUM ('USER', 'ADMIN');

-- CreateEnum
CREATE TYPE "BookStatus" AS ENUM ('ACTIVE', 'RENTED', 'CLOSED');

-- CreateEnum
CREATE TYPE "Condition" AS ENUM ('NEW', 'GOOD', 'WORN', 'DAMAGED');

-- CreateEnum
CREATE TYPE "Format" AS ENUM ('HARDCOVER', 'PAPERBACK');

-- CreateEnum
CREATE TYPE "RentalStatus" AS ENUM ('PENDING', 'APPROVED_BY_OWNER', 'CONFIRMED', 'ACTIVE', 'RETURN_REQUESTED', 'COMPLETED', 'REJECTED');

-- CreateTable
CREATE TABLE "users" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "name" TEXT NOT NULL,
    "lastname" TEXT NOT NULL,
    "surname" TEXT,
    "email" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "refreshTokenHash" TEXT,
    "roles" "Role"[] DEFAULT ARRAY['USER']::"Role"[],

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Book" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "user_id" INTEGER NOT NULL,
    "condition" "Condition" NOT NULL,
    "publishedYear" INTEGER NOT NULL,
    "isbn" TEXT NOT NULL,
    "language" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "cover_image_url" TEXT NOT NULL,
    "author" TEXT NOT NULL,
    "publisher" TEXT,
    "series" TEXT,
    "edition" TEXT,
    "pages" INTEGER,
    "dimensions" TEXT,
    "format" "Format",
    "print_run" INTEGER,
    "weight" INTEGER,
    "age_restriction" TEXT,
    "price" DOUBLE PRECISION NOT NULL,
    "availabilityStatus" "BookStatus" NOT NULL DEFAULT 'ACTIVE',
    "tags" TEXT[],
    "added_date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "last_rented_date" TIMESTAMP(3),
    "rental_count" INTEGER NOT NULL DEFAULT 0,
    "rating" DOUBLE PRECISION,
    "times_reported" INTEGER NOT NULL DEFAULT 0,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Book_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Rental" (
    "id" SERIAL NOT NULL,
    "book_id" INTEGER NOT NULL,
    "renter_id" INTEGER NOT NULL,
    "owner_id" INTEGER NOT NULL,
    "status" "RentalStatus" NOT NULL DEFAULT 'PENDING',
    "rentStartDate" TIMESTAMP(3),
    "rentEndDate" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Rental_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Book_isbn_key" ON "Book"("isbn");

-- AddForeignKey
ALTER TABLE "Book" ADD CONSTRAINT "Book_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Rental" ADD CONSTRAINT "Rental_book_id_fkey" FOREIGN KEY ("book_id") REFERENCES "Book"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Rental" ADD CONSTRAINT "Rental_renter_id_fkey" FOREIGN KEY ("renter_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Rental" ADD CONSTRAINT "Rental_owner_id_fkey" FOREIGN KEY ("owner_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
