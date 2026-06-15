-- CreateEnum
CREATE TYPE "QuestionType" AS ENUM ('MCQ');

-- AlterEnum
ALTER TYPE "ParticipantStatus" ADD VALUE 'AUTO_SUBMITTED';

-- AlterTable
ALTER TABLE "options" ADD COLUMN     "position" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "questions" ADD COLUMN     "explanation" TEXT,
ADD COLUMN     "type" "QuestionType" NOT NULL DEFAULT 'MCQ';

-- AlterTable
ALTER TABLE "test_settings" ADD COLUMN     "copyAllowed" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "pasteAllowed" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "tabSwitchDetection" BOOLEAN NOT NULL DEFAULT true;

-- AlterTable
ALTER TABLE "tests" ADD COLUMN     "totalMarks" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "totalQuestions" INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "users" DROP COLUMN "role";

-- DropEnum
DROP TYPE "UserRole";

-- CreateIndex
CREATE UNIQUE INDEX "questions_testId_position_key" ON "questions"("testId", "position");
