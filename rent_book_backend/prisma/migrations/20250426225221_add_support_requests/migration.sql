-- CreateEnum
CREATE TYPE "SupportRequestStatus" AS ENUM ('REGISTERED', 'IN_PROGRESS', 'CLOSED');

-- CreateTable
CREATE TABLE "support_requests" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "user_id" INTEGER NOT NULL,
    "status" "SupportRequestStatus" NOT NULL DEFAULT 'REGISTERED',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "support_requests_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "support_requests" ADD CONSTRAINT "support_requests_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
