-- CreateEnum
CREATE TYPE "RolesUser" AS ENUM ('ADMIN', 'USER');

-- CreateEnum
CREATE TYPE "StatusSubscriptionPurchaseProducts" AS ENUM ('ACTIVE', 'EXPIRE', 'CANCELED');

-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "public_id" TEXT NOT NULL,
    "role" "RolesUser" NOT NULL DEFAULT 'USER',
    "email" TEXT NOT NULL,
    "password" TEXT,
    "is_verified_account" BOOLEAN NOT NULL DEFAULT false,
    "newsletter_subscription" BOOLEAN NOT NULL DEFAULT true,
    "terms_and_conditions_accepted" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserSinglePurchases" (
    "user_id" INTEGER NOT NULL,
    "single_purchase_products_id" INTEGER NOT NULL,

    CONSTRAINT "UserSinglePurchases_pkey" PRIMARY KEY ("user_id","single_purchase_products_id")
);

-- CreateTable
CREATE TABLE "UserSubscriptionPurchases" (
    "status" "StatusSubscriptionPurchaseProducts" NOT NULL,
    "user_id" INTEGER NOT NULL,
    "subscription_purchase_products_id" INTEGER NOT NULL,

    CONSTRAINT "UserSubscriptionPurchases_pkey" PRIMARY KEY ("user_id","subscription_purchase_products_id")
);

-- CreateTable
CREATE TABLE "SinglePurchaseProducts" (
    "id" SERIAL NOT NULL,
    "public_id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "price" INTEGER NOT NULL,
    "price_id" TEXT,
    "slug" TEXT NOT NULL,
    "image" TEXT[],
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
    "price_id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "image" TEXT[],
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
    "user_id" INTEGER NOT NULL,

    CONSTRAINT "VerificationCodes_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_public_id_key" ON "User"("public_id");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "SinglePurchaseProducts_public_id_key" ON "SinglePurchaseProducts"("public_id");

-- CreateIndex
CREATE UNIQUE INDEX "SinglePurchaseProducts_price_id_key" ON "SinglePurchaseProducts"("price_id");

-- CreateIndex
CREATE UNIQUE INDEX "SinglePurchaseProducts_slug_key" ON "SinglePurchaseProducts"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "SubscriptionPurchaseProducts_public_id_key" ON "SubscriptionPurchaseProducts"("public_id");

-- CreateIndex
CREATE UNIQUE INDEX "SubscriptionPurchaseProducts_price_id_key" ON "SubscriptionPurchaseProducts"("price_id");

-- CreateIndex
CREATE UNIQUE INDEX "SubscriptionPurchaseProducts_slug_key" ON "SubscriptionPurchaseProducts"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "VerificationCodes_public_id_key" ON "VerificationCodes"("public_id");

-- CreateIndex
CREATE UNIQUE INDEX "VerificationCodes_user_id_key" ON "VerificationCodes"("user_id");

-- AddForeignKey
ALTER TABLE "UserSinglePurchases" ADD CONSTRAINT "UserSinglePurchases_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserSinglePurchases" ADD CONSTRAINT "UserSinglePurchases_single_purchase_products_id_fkey" FOREIGN KEY ("single_purchase_products_id") REFERENCES "SinglePurchaseProducts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserSubscriptionPurchases" ADD CONSTRAINT "UserSubscriptionPurchases_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserSubscriptionPurchases" ADD CONSTRAINT "UserSubscriptionPurchases_subscription_purchase_products_i_fkey" FOREIGN KEY ("subscription_purchase_products_id") REFERENCES "SubscriptionPurchaseProducts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VerificationCodes" ADD CONSTRAINT "VerificationCodes_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
