"use server";

import { revalidatePath } from "next/cache";

import { auth } from "@/auth";
import { createTest } from "@/services/test.service";
import { getHostedTests } from "@/services/test.service";
import {
  createTestSchema,
  CreateTestInput,
} from "@/validators/test";

export async function getHostedTestsAction() {
  const session = await auth();

  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  const tests = await getHostedTests(session.user.id);

  return tests;
}

export async function createTestAction(
  data: CreateTestInput
) {
  const session = await auth();

  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  const validatedData = createTestSchema.parse(data);

  await createTest(
    session.user.id,
    validatedData
  );

  revalidatePath("/dashboard");

  return {
    success: true,
  };
}