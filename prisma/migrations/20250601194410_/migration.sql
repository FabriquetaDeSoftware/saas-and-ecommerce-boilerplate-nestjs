-- CreateTable
CREATE TABLE "one_time_password" (
    "id" SERIAL NOT NULL,
    "public_id" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expires_at" TIMESTAMP(3) NOT NULL,
    "user_id" INTEGER NOT NULL,

    CONSTRAINT "one_time_password_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "one_time_password_public_id_key" ON "one_time_password"("public_id");

-- CreateIndex
CREATE UNIQUE INDEX "one_time_password_user_id_key" ON "one_time_password"("user_id");

-- AddForeignKey
ALTER TABLE "one_time_password" ADD CONSTRAINT "one_time_password_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;
