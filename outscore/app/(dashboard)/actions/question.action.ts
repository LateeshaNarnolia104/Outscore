"use server";

import { auth } from "@/auth";
import { revalidatePath } from "next/cache";
import { deleteQuestion } from "@/services/question.service";
import { updateQuestion }
from "@/services/question.service";

import {
  createQuestionSchema,
  CreateQuestionInput,
} from "@/validators/question";

import { createQuestion } from "@/services/question.service";

export async function createQuestionAction(data: CreateQuestionInput) {
  const session = await auth();

  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  const validatedData = createQuestionSchema.parse(data);

  await createQuestion(validatedData);

  revalidatePath(`/dashboard/tests/${data.testId}`);

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

  await deleteQuestion(questionId);

  revalidatePath(
    `/dashboard/tests/${testId}`
  );

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

  await updateQuestion(
    questionId,
    data
  );

  revalidatePath(
    `/dashboard/tests/${data.testId}`
  );

  return {
    success: true,
  };
}