/*
  Warnings:

  - The primary key for the `UserSinglePurchases` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `authId` on the `UserSinglePurchases` table. All the data in the column will be lost.
  - The primary key for the `UserSubscriptionPurchases` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `authId` on the `UserSubscriptionPurchases` table. All the data in the column will be lost.
  - Added the required column `authPublicId` to the `UserSinglePurchases` table without a default value. This is not possible if the table is not empty.
  - Added the required column `authPublicId` to the `UserSubscriptionPurchases` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "UserSinglePurchases" DROP CONSTRAINT "UserSinglePurchases_authId_fkey";

-- DropForeignKey
ALTER TABLE "UserSubscriptionPurchases" DROP CONSTRAINT "UserSubscriptionPurchases_authId_fkey";

-- AlterTable
ALTER TABLE "UserSinglePurchases" DROP CONSTRAINT "UserSinglePurchases_pkey",
DROP COLUMN "authId",
ADD COLUMN     "authPublicId" UUID NOT NULL,
ADD CONSTRAINT "UserSinglePurchases_pkey" PRIMARY KEY ("authPublicId", "singlePurchaseProductsId");

-- AlterTable
ALTER TABLE "UserSubscriptionPurchases" DROP CONSTRAINT "UserSubscriptionPurchases_pkey",
DROP COLUMN "authId",
ADD COLUMN     "authPublicId" UUID NOT NULL,
ADD CONSTRAINT "UserSubscriptionPurchases_pkey" PRIMARY KEY ("authPublicId", "subscriptionPurchaseProductsId");

-- AddForeignKey
ALTER TABLE "UserSinglePurchases" ADD CONSTRAINT "UserSinglePurchases_authPublicId_fkey" FOREIGN KEY ("authPublicId") REFERENCES "Auth"("public_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserSubscriptionPurchases" ADD CONSTRAINT "UserSubscriptionPurchases_authPublicId_fkey" FOREIGN KEY ("authPublicId") REFERENCES "Auth"("public_id") ON DELETE CASCADE ON UPDATE CASCADE;
