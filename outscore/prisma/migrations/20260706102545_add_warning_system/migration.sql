/*
  Warnings:

  - You are about to drop the column `warningCount` on the `participants` table. All the data in the column will be lost.
  - You are about to drop the column `warningType` on the `warning_logs` table. All the data in the column will be lost.
  - Added the required column `type` to the `warning_logs` table without a default value. This is not possible if the table is not empty.

*/
-- AlterEnum
ALTER TYPE "WarningType" ADD VALUE 'WINDOW_BLUR';

-- AlterTable
ALTER TABLE "participants" DROP COLUMN "warningCount",
ADD COLUMN     "warnings" INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "warning_logs" DROP COLUMN "warningType",
ADD COLUMN     "message" TEXT,
ADD COLUMN     "type" "WarningType" NOT NULL;
