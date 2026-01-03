/*
  Warnings:

  - A unique constraint covering the columns `[card_name]` on the table `card` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "card_card_name_key" ON "card"("card_name");
