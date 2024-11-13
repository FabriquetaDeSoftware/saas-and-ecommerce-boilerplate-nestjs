-- CreateEnum
CREATE TYPE "RolesAuth" AS ENUM ('ADMIN', 'USER');

-- CreateTable
CREATE TABLE "Auth" (
    "id" SERIAL NOT NULL,
    "public_id" TEXT NOT NULL,
    "role" "RolesAuth" NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "is_verified_account" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Auth_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Auth_public_id_key" ON "Auth"("public_id");

-- CreateIndex
CREATE UNIQUE INDEX "Auth_email_key" ON "Auth"("email");
