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
    "newsletter_subscription" BOOLEAN NOT NULL DEFAULT false,
    "terms_and_conditions_accepted" BOOLEAN NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Auth_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "VerificationCodes" (
    "id" SERIAL NOT NULL,
    "public_id" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expires_at" TIMESTAMP(3) NOT NULL,
    "auth_id" INTEGER NOT NULL,

    CONSTRAINT "VerificationCodes_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Auth_public_id_key" ON "Auth"("public_id");

-- CreateIndex
CREATE UNIQUE INDEX "Auth_email_key" ON "Auth"("email");

-- CreateIndex
CREATE UNIQUE INDEX "VerificationCodes_public_id_key" ON "VerificationCodes"("public_id");

-- CreateIndex
CREATE UNIQUE INDEX "VerificationCodes_auth_id_key" ON "VerificationCodes"("auth_id");

-- AddForeignKey
ALTER TABLE "VerificationCodes" ADD CONSTRAINT "VerificationCodes_auth_id_fkey" FOREIGN KEY ("auth_id") REFERENCES "Auth"("id") ON DELETE CASCADE ON UPDATE CASCADE;
