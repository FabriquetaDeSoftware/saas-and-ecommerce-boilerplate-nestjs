/*
  Warnings:

  - Added the required column `role` to the `Auth` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "RolesAuth" AS ENUM ('ADMIN', 'USER');

-- AlterTable
ALTER TABLE "Auth" ADD COLUMN     "role" "RolesAuth" NOT NULL;
