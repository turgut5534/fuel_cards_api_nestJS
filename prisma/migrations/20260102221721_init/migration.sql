-- CreateEnum
CREATE TYPE "TransactionType" AS ENUM ('spend', 'topup');

-- CreateTable
CREATE TABLE "users" (
    "user_id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "name" TEXT,
    "token" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "users_pkey" PRIMARY KEY ("user_id")
);

-- CreateTable
CREATE TABLE "card" (
    "card_id" SERIAL NOT NULL,
    "card_name" TEXT NOT NULL,
    "balance" DECIMAL(10,2) NOT NULL,
    "user_id" INTEGER NOT NULL,

    CONSTRAINT "card_pkey" PRIMARY KEY ("card_id")
);

-- CreateTable
CREATE TABLE "transactions" (
    "transaction_id" SERIAL NOT NULL,
    "card_id" INTEGER NOT NULL,
    "transaction_type" "TransactionType" NOT NULL,
    "amount" DECIMAL(10,2) NOT NULL,
    "transaction_date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "new_balance" DECIMAL(10,2) NOT NULL,
    "fuel_price" DECIMAL(10,2),
    "liters" DECIMAL(10,3),

    CONSTRAINT "transactions_pkey" PRIMARY KEY ("transaction_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "users_token_key" ON "users"("token");

-- CreateIndex
CREATE INDEX "card_user_id_idx" ON "card"("user_id");

-- CreateIndex
CREATE INDEX "transactions_card_id_idx" ON "transactions"("card_id");

-- AddForeignKey
ALTER TABLE "card" ADD CONSTRAINT "card_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("user_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "transactions" ADD CONSTRAINT "transactions_card_id_fkey" FOREIGN KEY ("card_id") REFERENCES "card"("card_id") ON DELETE CASCADE ON UPDATE CASCADE;
