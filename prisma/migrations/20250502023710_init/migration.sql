-- CreateEnum
CREATE TYPE "role_user" AS ENUM ('ADMIN', 'USER');

-- CreateEnum
CREATE TYPE "status_subscription_purchase_product" AS ENUM ('ACTIVE', 'EXPIRE', 'CANCELED');

-- CreateTable
CREATE TABLE "user" (
    "id" SERIAL NOT NULL,
    "public_id" TEXT NOT NULL,
    "role" "role_user" NOT NULL DEFAULT 'USER',
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT,
    "is_verified_account" BOOLEAN NOT NULL DEFAULT false,
    "newsletter_subscription" BOOLEAN NOT NULL DEFAULT true,
    "terms_and_conditions_accepted" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "user_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_single_purchase" (
    "user_id" INTEGER NOT NULL,
    "single_purchase_products_id" INTEGER NOT NULL,

    CONSTRAINT "user_single_purchase_pkey" PRIMARY KEY ("user_id","single_purchase_products_id")
);

-- CreateTable
CREATE TABLE "user_subscription_purchase" (
    "status" "status_subscription_purchase_product" NOT NULL,
    "user_id" INTEGER NOT NULL,
    "subscription_purchase_products_id" INTEGER NOT NULL,

    CONSTRAINT "user_subscription_purchase_pkey" PRIMARY KEY ("user_id","subscription_purchase_products_id")
);

-- CreateTable
CREATE TABLE "single_purchase_product" (
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

    CONSTRAINT "single_purchase_product_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "subscription_purchase_product" (
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

    CONSTRAINT "subscription_purchase_product_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "verification_code" (
    "id" SERIAL NOT NULL,
    "public_id" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expires_at" TIMESTAMP(3) NOT NULL,
    "user_id" INTEGER NOT NULL,

    CONSTRAINT "verification_code_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "user_public_id_key" ON "user"("public_id");

-- CreateIndex
CREATE UNIQUE INDEX "user_email_key" ON "user"("email");

-- CreateIndex
CREATE UNIQUE INDEX "single_purchase_product_public_id_key" ON "single_purchase_product"("public_id");

-- CreateIndex
CREATE UNIQUE INDEX "single_purchase_product_price_id_key" ON "single_purchase_product"("price_id");

-- CreateIndex
CREATE UNIQUE INDEX "single_purchase_product_slug_key" ON "single_purchase_product"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "subscription_purchase_product_public_id_key" ON "subscription_purchase_product"("public_id");

-- CreateIndex
CREATE UNIQUE INDEX "subscription_purchase_product_price_id_key" ON "subscription_purchase_product"("price_id");

-- CreateIndex
CREATE UNIQUE INDEX "subscription_purchase_product_slug_key" ON "subscription_purchase_product"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "verification_code_public_id_key" ON "verification_code"("public_id");

-- CreateIndex
CREATE UNIQUE INDEX "verification_code_user_id_key" ON "verification_code"("user_id");

-- AddForeignKey
ALTER TABLE "user_single_purchase" ADD CONSTRAINT "user_single_purchase_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_single_purchase" ADD CONSTRAINT "user_single_purchase_single_purchase_products_id_fkey" FOREIGN KEY ("single_purchase_products_id") REFERENCES "single_purchase_product"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_subscription_purchase" ADD CONSTRAINT "user_subscription_purchase_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_subscription_purchase" ADD CONSTRAINT "user_subscription_purchase_subscription_purchase_products__fkey" FOREIGN KEY ("subscription_purchase_products_id") REFERENCES "subscription_purchase_product"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "verification_code" ADD CONSTRAINT "verification_code_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;
