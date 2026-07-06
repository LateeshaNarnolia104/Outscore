"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

import {
  createQuestion,
  deleteQuestion,
  updateQuestion,
} from "@/services/question.service";

import {
  createQuestionSchema,
  CreateQuestionInput,
} from "@/validators/question";

async function ensureDraftTest(testId: string, hostId: string) {
  const test = await prisma.test.findFirst({
    where: {
      id: testId,
      hostId,
    },
    select: {
      status: true,
    },
  });

  if (!test) {
    throw new Error("Test not found");
  }

  if (test.status !== "DRAFT") {
    throw new Error(
      "Questions can only be modified while the test is in draft."
    );
  }
}

export async function createQuestionAction(data: CreateQuestionInput) {
  const session = await auth();

  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  const validatedData = createQuestionSchema.parse(data);

  await ensureDraftTest(validatedData.testId, session.user.id);

  await createQuestion(validatedData);

  revalidatePath(`/dashboard/tests/${validatedData.testId}`);

  return {
    success: true,
  };
}

export async function deleteQuestionAction(
  questionId: string,
  testId: string
) {
  const session = await auth();

  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  await ensureDraftTest(testId, session.user.id);

  await deleteQuestion(questionId);

  revalidatePath(`/dashboard/tests/${testId}`);

  return {
    success: true,
  };
}

export async function updateQuestionAction(
  questionId: string,
  data: CreateQuestionInput
) {
  const session = await auth();

  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  const validatedData = createQuestionSchema.parse(data);

  await ensureDraftTest(validatedData.testId, session.user.id);

  await updateQuestion(questionId, validatedData);

  revalidatePath(`/dashboard/tests/${validatedData.testId}`);

  return {
    success: true,
  };
}