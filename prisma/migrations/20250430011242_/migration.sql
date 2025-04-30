/*
  Warnings:

  - The primary key for the `UserSinglePurchases` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `authId` on the `UserSinglePurchases` table. All the data in the column will be lost.
  - You are about to drop the column `singlePurchaseProductsId` on the `UserSinglePurchases` table. All the data in the column will be lost.
  - The primary key for the `UserSubscriptionPurchases` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `authId` on the `UserSubscriptionPurchases` table. All the data in the column will be lost.
  - You are about to drop the column `subscriptionPurchaseProductsId` on the `UserSubscriptionPurchases` table. All the data in the column will be lost.
  - You are about to drop the column `auth_id` on the `VerificationCodes` table. All the data in the column will be lost.
  - You are about to drop the `Auth` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[user_id]` on the table `VerificationCodes` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `single_purchase_products_id` to the `UserSinglePurchases` table without a default value. This is not possible if the table is not empty.
  - Added the required column `user_id` to the `UserSinglePurchases` table without a default value. This is not possible if the table is not empty.
  - Added the required column `subscription_purchase_products_id` to the `UserSubscriptionPurchases` table without a default value. This is not possible if the table is not empty.
  - Added the required column `user_id` to the `UserSubscriptionPurchases` table without a default value. This is not possible if the table is not empty.
  - Added the required column `user_id` to the `VerificationCodes` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "RolesUser" AS ENUM ('ADMIN', 'USER');

-- DropForeignKey
ALTER TABLE "UserSinglePurchases" DROP CONSTRAINT "UserSinglePurchases_authId_fkey";

-- DropForeignKey
ALTER TABLE "UserSinglePurchases" DROP CONSTRAINT "UserSinglePurchases_singlePurchaseProductsId_fkey";

-- DropForeignKey
ALTER TABLE "UserSubscriptionPurchases" DROP CONSTRAINT "UserSubscriptionPurchases_authId_fkey";

-- DropForeignKey
ALTER TABLE "UserSubscriptionPurchases" DROP CONSTRAINT "UserSubscriptionPurchases_subscriptionPurchaseProductsId_fkey";

-- DropForeignKey
ALTER TABLE "VerificationCodes" DROP CONSTRAINT "VerificationCodes_auth_id_fkey";

-- DropIndex
DROP INDEX "VerificationCodes_auth_id_key";

-- AlterTable
ALTER TABLE "UserSinglePurchases" DROP CONSTRAINT "UserSinglePurchases_pkey",
DROP COLUMN "authId",
DROP COLUMN "singlePurchaseProductsId",
ADD COLUMN     "single_purchase_products_id" INTEGER NOT NULL,
ADD COLUMN     "user_id" INTEGER NOT NULL,
ADD CONSTRAINT "UserSinglePurchases_pkey" PRIMARY KEY ("user_id", "single_purchase_products_id");

-- AlterTable
ALTER TABLE "UserSubscriptionPurchases" DROP CONSTRAINT "UserSubscriptionPurchases_pkey",
DROP COLUMN "authId",
DROP COLUMN "subscriptionPurchaseProductsId",
ADD COLUMN     "subscription_purchase_products_id" INTEGER NOT NULL,
ADD COLUMN     "user_id" INTEGER NOT NULL,
ADD CONSTRAINT "UserSubscriptionPurchases_pkey" PRIMARY KEY ("user_id", "subscription_purchase_products_id");

-- AlterTable
ALTER TABLE "VerificationCodes" DROP COLUMN "auth_id",
ADD COLUMN     "user_id" INTEGER NOT NULL;

-- DropTable
DROP TABLE "Auth";

-- DropEnum
DROP TYPE "RolesAuth";

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

-- CreateIndex
CREATE UNIQUE INDEX "User_public_id_key" ON "User"("public_id");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

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
