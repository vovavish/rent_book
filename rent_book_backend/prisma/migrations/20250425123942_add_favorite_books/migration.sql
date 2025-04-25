-- CreateTable
CREATE TABLE "_FavoriteBooks" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,

    CONSTRAINT "_FavoriteBooks_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_FavoriteBooks_B_index" ON "_FavoriteBooks"("B");

-- AddForeignKey
ALTER TABLE "_FavoriteBooks" ADD CONSTRAINT "_FavoriteBooks_A_fkey" FOREIGN KEY ("A") REFERENCES "Book"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_FavoriteBooks" ADD CONSTRAINT "_FavoriteBooks_B_fkey" FOREIGN KEY ("B") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
