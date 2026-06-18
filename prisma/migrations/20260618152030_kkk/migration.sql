/*
  Warnings:

  - You are about to drop the column `sale_price` on the `Product` table. All the data in the column will be lost.
  - You are about to drop the column `stock_qty` on the `Product` table. All the data in the column will be lost.
  - The `status` column on the `PurchaseOrder` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - Added the required column `variant_id` to the `ImportDetail` table without a default value. This is not possible if the table is not empty.
  - Added the required column `variant_id` to the `PurchaseDetail` table without a default value. This is not possible if the table is not empty.
  - Added the required column `variant_id` to the `SaleDetail` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "PromotionStatus" AS ENUM ('ACTIVE', 'INACTIVE');

-- CreateEnum
CREATE TYPE "PurchaseOrderStatus" AS ENUM ('PENDING', 'ORDERED', 'COMPLETED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "PurchasePaymentStatus" AS ENUM ('UNPAID', 'PAID');

-- CreateEnum
CREATE TYPE "ImportStatus" AS ENUM ('PENDING', 'COMPLETED', 'CANCELLED');

-- AlterTable
ALTER TABLE "Customer" ALTER COLUMN "point" SET DEFAULT 0,
ALTER COLUMN "point" SET DATA TYPE DOUBLE PRECISION;

-- AlterTable
ALTER TABLE "Import" ADD COLUMN     "status" "ImportStatus" NOT NULL DEFAULT 'PENDING';

-- AlterTable
ALTER TABLE "ImportDetail" ADD COLUMN     "variant_id" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Product" DROP COLUMN "sale_price",
DROP COLUMN "stock_qty";

-- AlterTable
ALTER TABLE "PurchaseDetail" ADD COLUMN     "variant_id" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "PurchaseOrder" ADD COLUMN     "paid_amount" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "payment_status" "PurchasePaymentStatus" NOT NULL DEFAULT 'UNPAID',
DROP COLUMN "status",
ADD COLUMN     "status" "PurchaseOrderStatus" NOT NULL DEFAULT 'PENDING';

-- AlterTable
ALTER TABLE "SaleDetail" ADD COLUMN     "variant_id" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "ProductVariant" (
    "variant_id" TEXT NOT NULL,
    "product_id" TEXT NOT NULL,
    "sku" TEXT NOT NULL,
    "color" TEXT NOT NULL,
    "size" TEXT NOT NULL,
    "purchase_price" INTEGER NOT NULL,
    "sale_price" INTEGER NOT NULL,
    "stock_qty" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ProductVariant_pkey" PRIMARY KEY ("variant_id")
);

-- CreateTable
CREATE TABLE "Promotion" (
    "promotion_id" TEXT NOT NULL,
    "promotion_code" TEXT NOT NULL,
    "promotion_name" TEXT NOT NULL,
    "discount_value" INTEGER NOT NULL,
    "start_date" TIMESTAMP(3) NOT NULL,
    "end_date" TIMESTAMP(3) NOT NULL,
    "status" "PromotionStatus" NOT NULL DEFAULT 'ACTIVE',
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Promotion_pkey" PRIMARY KEY ("promotion_id")
);

-- CreateTable
CREATE TABLE "PromotionProduct" (
    "id" TEXT NOT NULL,
    "promotion_id" TEXT NOT NULL,
    "product_id" TEXT NOT NULL,

    CONSTRAINT "PromotionProduct_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ProductVariant_sku_key" ON "ProductVariant"("sku");

-- CreateIndex
CREATE INDEX "ProductVariant_product_id_idx" ON "ProductVariant"("product_id");

-- CreateIndex
CREATE UNIQUE INDEX "Promotion_promotion_code_key" ON "Promotion"("promotion_code");

-- CreateIndex
CREATE INDEX "PromotionProduct_promotion_id_idx" ON "PromotionProduct"("promotion_id");

-- CreateIndex
CREATE INDEX "PromotionProduct_product_id_idx" ON "PromotionProduct"("product_id");

-- CreateIndex
CREATE UNIQUE INDEX "PromotionProduct_promotion_id_product_id_key" ON "PromotionProduct"("promotion_id", "product_id");

-- AddForeignKey
ALTER TABLE "ProductVariant" ADD CONSTRAINT "ProductVariant_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "Product"("product_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PromotionProduct" ADD CONSTRAINT "PromotionProduct_promotion_id_fkey" FOREIGN KEY ("promotion_id") REFERENCES "Promotion"("promotion_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PromotionProduct" ADD CONSTRAINT "PromotionProduct_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "Product"("product_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PurchaseDetail" ADD CONSTRAINT "PurchaseDetail_variant_id_fkey" FOREIGN KEY ("variant_id") REFERENCES "ProductVariant"("variant_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ImportDetail" ADD CONSTRAINT "ImportDetail_variant_id_fkey" FOREIGN KEY ("variant_id") REFERENCES "ProductVariant"("variant_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SaleDetail" ADD CONSTRAINT "SaleDetail_variant_id_fkey" FOREIGN KEY ("variant_id") REFERENCES "ProductVariant"("variant_id") ON DELETE RESTRICT ON UPDATE CASCADE;
