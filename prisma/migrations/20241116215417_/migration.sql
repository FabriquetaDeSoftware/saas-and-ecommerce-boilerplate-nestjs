/*
  Warnings:

  - Added the required column `terms_and_conditions_accepted` to the `Auth` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Auth" ADD COLUMN     "newsletter_subscription" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "terms_and_conditions_accepted" BOOLEAN NOT NULL;
