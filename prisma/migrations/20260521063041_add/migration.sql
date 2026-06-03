/*
  Warnings:

  - You are about to drop the column `address` on the `Customer` table. All the data in the column will be lost.
  - You are about to drop the column `address` on the `Employee` table. All the data in the column will be lost.
  - You are about to drop the column `position` on the `Employee` table. All the data in the column will be lost.
  - You are about to drop the `Point` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[purchase_id]` on the table `Import` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[sale_id]` on the table `Refund` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "Point" DROP CONSTRAINT "Point_customer_id_fkey";

-- AlterTable
ALTER TABLE "Customer" DROP COLUMN "address",
ADD COLUMN     "district" TEXT,
ADD COLUMN     "province" TEXT,
ADD COLUMN     "village" TEXT;

-- AlterTable
ALTER TABLE "Employee" DROP COLUMN "address",
DROP COLUMN "position",
ADD COLUMN     "District" TEXT,
ADD COLUMN     "Province" TEXT,
ADD COLUMN     "Village" TEXT;

-- DropTable
DROP TABLE "Point";

-- CreateIndex
CREATE UNIQUE INDEX "Import_purchase_id_key" ON "Import"("purchase_id");

-- CreateIndex
CREATE UNIQUE INDEX "Refund_sale_id_key" ON "Refund"("sale_id");

-- AddForeignKey
ALTER TABLE "RefundDetail" ADD CONSTRAINT "RefundDetail_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "Product"("product_id") ON DELETE CASCADE ON UPDATE CASCADE;
