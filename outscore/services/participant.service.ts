import { prisma } from "@/lib/prisma";

export async function findPublishedTestByAccessCode(
  accessCode: string
) {
  const test = await prisma.test.findUnique({
    where: {
      accessCode,
    },

    select: {
      id: true,
      title: true,
      description: true,
      duration: true,
      totalQuestions: true,
      totalMarks: true,
      status: true,

      settings: {
        select: {
          showResult: true,
        },
      },
    },
  });

  if (!test) {
    return {
      success: false,
      message: "Invalid access code",
    };
  }

  if (test.status !== "PUBLISHED") {
    return {
      success: false,
      message: "This test is not available to join",
    };
  }

  return {
    success: true,
    message: "Test found",
    data: test,
  };
}

