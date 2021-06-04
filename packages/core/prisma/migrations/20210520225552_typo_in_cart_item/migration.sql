/*
  Warnings:

  - You are about to drop the column `cardId` on the `CartItem` table. All the data in the column will be lost.
  - Added the required column `cartId` to the `CartItem` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "CartItem" DROP CONSTRAINT "CartItem_cardId_fkey";

-- AlterTable
ALTER TABLE "CartItem" DROP COLUMN "cardId",
ADD COLUMN     "cartId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "CartItem" ADD FOREIGN KEY ("cartId") REFERENCES "Cart"("id") ON DELETE CASCADE ON UPDATE CASCADE;
