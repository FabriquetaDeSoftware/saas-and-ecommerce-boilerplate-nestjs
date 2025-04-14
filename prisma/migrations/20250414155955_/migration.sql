/*
  Warnings:

  - The `image` column on the `SinglePurchaseProducts` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - A unique constraint covering the columns `[price_id]` on the table `SinglePurchaseProducts` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[price_id]` on the table `SubscriptionPurchaseProducts` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "SinglePurchaseProducts" ADD COLUMN     "price_id" TEXT,
DROP COLUMN "image",
ADD COLUMN     "image" TEXT[];

-- AlterTable
ALTER TABLE "SubscriptionPurchaseProducts" ADD COLUMN     "price_id" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "SinglePurchaseProducts_price_id_key" ON "SinglePurchaseProducts"("price_id");

-- CreateIndex
CREATE UNIQUE INDEX "SubscriptionPurchaseProducts_price_id_key" ON "SubscriptionPurchaseProducts"("price_id");
