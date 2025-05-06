-- CreateEnum
CREATE TYPE "Role" AS ENUM ('USER', 'ADMIN');

-- CreateEnum
CREATE TYPE "BookStatus" AS ENUM ('ACTIVE', 'RENTED', 'CLOSED');

-- CreateEnum
CREATE TYPE "Condition" AS ENUM ('NewEdition', 'UsedBook', 'RareEdition', 'AntiqueBook', 'ManuscriptEdition', 'NumberedEdition', 'SignedEdition', 'SmallPrintRun', 'OffPrintRun');

-- CreateEnum
CREATE TYPE "Format" AS ENUM ('SmallFormat', 'PocketEdition', 'Miniature', 'TinyBook', 'Folio');

-- CreateEnum
CREATE TYPE "Type" AS ENUM ('Book', 'Magazine', 'Newspaper', 'Dictionary', 'Encyclopedia', 'Reference', 'Textbook', 'Anthology', 'Songbook', 'Manga');

-- CreateEnum
CREATE TYPE "AgeRating" AS ENUM ('ZeroPlus', 'SixPlus', 'TwelvePlus', 'SixteenPlus', 'EighteenPlus');

-- CreateEnum
CREATE TYPE "Periodicity" AS ENUM ('NonPeriodic', 'Serial', 'Periodic', 'Continuing', 'Series');

-- CreateEnum
CREATE TYPE "MaterialConstruction" AS ENUM ('BookEdition', 'MagazineEdition', 'SheetEdition', 'Booklet', 'NewspaperEdition', 'CardEdition', 'Postcard', 'Poster', 'ValetEdition', 'ToyBook', 'MultiFormatEdition', 'CompositeEdition');

-- CreateEnum
CREATE TYPE "Category" AS ENUM ('ScienceFiction', 'Fantasy', 'AlternativeHistory', 'PostApocalypse', 'Cyberpunk', 'FairyTale', 'ClassicDetective', 'PoliceProcedural', 'PsychologicalThriller', 'SpyNovel', 'CrimeNovel', 'ContemporaryProse', 'HistoricalProse', 'SocialDrama', 'Saga', 'AdventureNovel', 'Romance', 'HistoricalRomance', 'EroticNovel', 'HumorousNovel', 'GothicNovel', 'Mysticism', 'Horror', 'SeaAdventure', 'Travel', 'YoungAdult', 'ChildrensFiction', 'ComicsGraphicNovels', 'BiographyMemoirs', 'Documentary', 'History', 'Journalism', 'Psychology', 'SelfDevelopment', 'BusinessEconomics', 'PoliticalScience', 'ReligionSpirituality', 'PopularScience', 'Guidebooks', 'Cookbooks', 'Essays', 'HumorSatire');

-- CreateEnum
CREATE TYPE "RentalStatus" AS ENUM ('PENDING', 'APPROVED_BY_OWNER', 'CONFIRMED', 'GIVEN_TO_READER', 'CANCELED', 'ACTIVE', 'RETURN_APPROVAL', 'COMPLETED', 'REJECTED');

-- CreateEnum
CREATE TYPE "SupportRequestStatus" AS ENUM ('REGISTERED', 'IN_PROGRESS', 'CLOSED');

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
    "phone_numbers" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "card_numbers" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "roles" "Role"[] DEFAULT ARRAY['USER']::"Role"[],
    "ownerRating" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "readerRating" DOUBLE PRECISION NOT NULL DEFAULT 0,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Book" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "card_number" TEXT NOT NULL DEFAULT '',
    "title" TEXT NOT NULL,
    "frequencyTitle" TEXT,
    "author" TEXT NOT NULL,
    "publisher" TEXT NOT NULL,
    "publishingCity" TEXT NOT NULL,
    "publishedYear" INTEGER NOT NULL,
    "print_run" INTEGER NOT NULL,
    "pages" INTEGER NOT NULL,
    "type" "Type" NOT NULL,
    "description" TEXT NOT NULL,
    "condition" "Condition" NOT NULL,
    "ageRestriction" "AgeRating" NOT NULL,
    "periodicity" "Periodicity",
    "materialConstruction" "MaterialConstruction",
    "format" "Format",
    "edition" INTEGER,
    "category" "Category"[],
    "weight" DOUBLE PRECISION,
    "language" TEXT,
    "cover_images_urls" TEXT[],
    "price" DOUBLE PRECISION NOT NULL,
    "deposit" DOUBLE PRECISION DEFAULT 0,
    "min_days_to_rent" INTEGER NOT NULL DEFAULT 0,
    "address" TEXT NOT NULL,
    "lat" DOUBLE PRECISION NOT NULL,
    "lon" DOUBLE PRECISION NOT NULL,
    "added_date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "availabilityStatus" "BookStatus" NOT NULL DEFAULT 'ACTIVE',
    "times_reported" INTEGER NOT NULL DEFAULT 0,
    "rental_count" INTEGER NOT NULL DEFAULT 0,
    "last_rented_date" TIMESTAMP(3),
    "rating" DOUBLE PRECISION,
    "bookRating" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Book_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Rental" (
    "id" SERIAL NOT NULL,
    "book_id" INTEGER NOT NULL,
    "renter_id" INTEGER NOT NULL,
    "owner_id" INTEGER NOT NULL,
    "ownerName" TEXT NOT NULL,
    "ownerLastname" TEXT NOT NULL,
    "ownerSurname" TEXT,
    "ownerPhones" TEXT[],
    "ownerCardNumber" TEXT NOT NULL,
    "renterName" TEXT NOT NULL,
    "renterLastname" TEXT NOT NULL,
    "renterSurname" TEXT,
    "renterPhones" TEXT[],
    "bookTitle" TEXT NOT NULL,
    "bookFrequencyTitle" TEXT,
    "bookAuthor" TEXT NOT NULL,
    "bookPublisher" TEXT NOT NULL,
    "bookPublishingCity" TEXT NOT NULL,
    "bookPublishedYear" INTEGER NOT NULL,
    "bookPrintRun" INTEGER NOT NULL,
    "bookPages" INTEGER NOT NULL,
    "bookType" "Type" NOT NULL,
    "bookDescription" TEXT NOT NULL,
    "bookCondition" "Condition" NOT NULL,
    "bookAgeRestriction" "AgeRating" NOT NULL,
    "bookPeriodicity" "Periodicity",
    "bookMaterialConstruction" "MaterialConstruction",
    "bookFormat" "Format",
    "bookEdition" INTEGER,
    "bookCategory" "Category"[],
    "bookWeight" DOUBLE PRECISION,
    "bookLanguage" TEXT,
    "bookCoverImages" TEXT[],
    "address" TEXT NOT NULL,
    "lat" DOUBLE PRECISION NOT NULL,
    "lon" DOUBLE PRECISION NOT NULL,
    "pricePerDay" DOUBLE PRECISION NOT NULL,
    "deposit" DOUBLE PRECISION,
    "price" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "ownerRating" INTEGER,
    "renterRating" INTEGER,
    "bookRating" INTEGER,
    "reviewContent" TEXT,
    "status" "RentalStatus" NOT NULL DEFAULT 'PENDING',
    "rentStartDate" TIMESTAMP(3),
    "rentEndDate" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Rental_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "support_requests" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "user_id" INTEGER NOT NULL,
    "status" "SupportRequestStatus" NOT NULL DEFAULT 'REGISTERED',
    "adminResponse" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "support_requests_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "reviews" (
    "id" SERIAL NOT NULL,
    "book_id" INTEGER NOT NULL,
    "user_id" INTEGER NOT NULL,
    "content" TEXT,
    "rating" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "reviews_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_FavoriteBooks" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,

    CONSTRAINT "_FavoriteBooks_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE INDEX "_FavoriteBooks_B_index" ON "_FavoriteBooks"("B");

-- AddForeignKey
ALTER TABLE "Book" ADD CONSTRAINT "Book_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Rental" ADD CONSTRAINT "Rental_book_id_fkey" FOREIGN KEY ("book_id") REFERENCES "Book"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Rental" ADD CONSTRAINT "Rental_renter_id_fkey" FOREIGN KEY ("renter_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Rental" ADD CONSTRAINT "Rental_owner_id_fkey" FOREIGN KEY ("owner_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "support_requests" ADD CONSTRAINT "support_requests_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reviews" ADD CONSTRAINT "reviews_book_id_fkey" FOREIGN KEY ("book_id") REFERENCES "Book"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reviews" ADD CONSTRAINT "reviews_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_FavoriteBooks" ADD CONSTRAINT "_FavoriteBooks_A_fkey" FOREIGN KEY ("A") REFERENCES "Book"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_FavoriteBooks" ADD CONSTRAINT "_FavoriteBooks_B_fkey" FOREIGN KEY ("B") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
