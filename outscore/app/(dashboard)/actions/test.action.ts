"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { publishTest } from "@/services/test.service";
import { auth } from "@/auth";
import { createTest } from "@/services/test.service";
import { getHostedTests } from "@/services/test.service";
import { startTest, endTest, } from "@/services/test.service";
import { createTestSchema, CreateTestInput } from "@/validators/test";
import { ensureTestCompletion } from "@/services/test.service";

export async function getHostedTestsAction() {
  const session = await auth();

  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  const tests = await getHostedTests(session.user.id);

  return tests;
}

export async function createTestAction(data: CreateTestInput) {
  const session = await auth();

  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  const validatedData = createTestSchema.parse(data);

  await createTest(session.user.id, validatedData);

  revalidatePath("/dashboard");

  return {
    success: true,
  };
}

export async function publishTestAction(testId: string) {
  const session = await auth();

  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  await publishTest(testId, session.user.id);

  revalidatePath("/dashboard");

  return {
    success: true,
    message: "Test published successfully",
  };
}

export async function startTestAction(testId: string) {
  const session = await auth();

  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  await startTest(testId, session.user.id);

  revalidatePath("/dashboard");

  return {
    success: true,
    message: "Test started successfully",
  };
}

export async function getTestStatusAction(testId: string) {
  await ensureTestCompletion(testId);

  const test = await prisma.test.findUnique({
    where: {
      id: testId,
    },

    select: {
      status: true,
    },
  });

  return test?.status ?? null;
}

export async function endTestAction(
  testId: string
) {
  const session = await auth();

  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  await endTest(testId, session.user.id);

  revalidatePath("/dashboard");

  return {
    success: true,
    message: "Test ended successfully",
  };
}
