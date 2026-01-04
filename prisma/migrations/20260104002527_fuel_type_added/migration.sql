-- CreateEnum
CREATE TYPE "FuelType" AS ENUM ('petrol', 'diesel', 'lpg');

-- AlterTable
ALTER TABLE "transactions" ADD COLUMN     "fuel_type" "FuelType" NOT NULL DEFAULT 'lpg';
