-- CreateEnum
CREATE TYPE "RolesAuth" AS ENUM ('ADMIN', 'USER');

-- CreateEnum
CREATE TYPE "StatusSubscriptionPurchaseProducts" AS ENUM ('ACTIVE', 'EXPIRE', 'CANCELED');

-- CreateTable
CREATE TABLE "Auth" (
    "id" SERIAL NOT NULL,
    "public_id" TEXT NOT NULL,
    "role" "RolesAuth" NOT NULL DEFAULT 'USER',
    "email" TEXT NOT NULL,
    "password" TEXT,
    "is_verified_account" BOOLEAN NOT NULL DEFAULT false,
    "newsletter_subscription" BOOLEAN NOT NULL DEFAULT true,
    "terms_and_conditions_accepted" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Auth_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserSinglePurchases" (
    "authId" INTEGER NOT NULL,
    "singlePurchaseProductsId" INTEGER NOT NULL,

    CONSTRAINT "UserSinglePurchases_pkey" PRIMARY KEY ("authId","singlePurchaseProductsId")
);

-- CreateTable
CREATE TABLE "UserSubscriptionPurchases" (
    "status" "StatusSubscriptionPurchaseProducts" NOT NULL,
    "authId" INTEGER NOT NULL,
    "subscriptionPurchaseProductsId" INTEGER NOT NULL,

    CONSTRAINT "UserSubscriptionPurchases_pkey" PRIMARY KEY ("authId","subscriptionPurchaseProductsId")
);

-- CreateTable
CREATE TABLE "SinglePurchaseProducts" (
    "id" SERIAL NOT NULL,
    "public_id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "price" INTEGER NOT NULL,
    "slug" TEXT NOT NULL,
    "image" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SinglePurchaseProducts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SubscriptionPurchaseProducts" (
    "id" SERIAL NOT NULL,
    "public_id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "price" INTEGER NOT NULL,
    "slug" TEXT NOT NULL,
    "image" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SubscriptionPurchaseProducts_pkey" PRIMARY KEY ("id")
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
CREATE UNIQUE INDEX "SinglePurchaseProducts_public_id_key" ON "SinglePurchaseProducts"("public_id");

-- CreateIndex
CREATE UNIQUE INDEX "SinglePurchaseProducts_slug_key" ON "SinglePurchaseProducts"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "SubscriptionPurchaseProducts_public_id_key" ON "SubscriptionPurchaseProducts"("public_id");

-- CreateIndex
CREATE UNIQUE INDEX "SubscriptionPurchaseProducts_slug_key" ON "SubscriptionPurchaseProducts"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "VerificationCodes_public_id_key" ON "VerificationCodes"("public_id");

-- CreateIndex
CREATE UNIQUE INDEX "VerificationCodes_auth_id_key" ON "VerificationCodes"("auth_id");

-- AddForeignKey
ALTER TABLE "UserSinglePurchases" ADD CONSTRAINT "UserSinglePurchases_authId_fkey" FOREIGN KEY ("authId") REFERENCES "Auth"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserSinglePurchases" ADD CONSTRAINT "UserSinglePurchases_singlePurchaseProductsId_fkey" FOREIGN KEY ("singlePurchaseProductsId") REFERENCES "SinglePurchaseProducts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserSubscriptionPurchases" ADD CONSTRAINT "UserSubscriptionPurchases_authId_fkey" FOREIGN KEY ("authId") REFERENCES "Auth"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserSubscriptionPurchases" ADD CONSTRAINT "UserSubscriptionPurchases_subscriptionPurchaseProductsId_fkey" FOREIGN KEY ("subscriptionPurchaseProductsId") REFERENCES "SubscriptionPurchaseProducts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VerificationCodes" ADD CONSTRAINT "VerificationCodes_auth_id_fkey" FOREIGN KEY ("auth_id") REFERENCES "Auth"("id") ON DELETE CASCADE ON UPDATE CASCADE;
