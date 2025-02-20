/*
  Warnings:

  - You are about to drop the column `stock` on the `Products` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[slug]` on the table `Products` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `slug` to the `Products` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "Products_name_key";

-- AlterTable
ALTER TABLE "Products" DROP COLUMN "stock",
ADD COLUMN     "slug" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Products_slug_key" ON "Products"("slug");
