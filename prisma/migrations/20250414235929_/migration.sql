/*
  Warnings:

  - Made the column `price_id` on table `SubscriptionPurchaseProducts` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "SubscriptionPurchaseProducts" ALTER COLUMN "price_id" SET NOT NULL;
