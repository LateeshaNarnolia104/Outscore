import { prisma } from "@/lib/prisma";
import { generateAccessCode } from "@/lib/access-code";
import { CreateTestInput } from "@/validators/test";

export async function createTest(
  hostId: string,
  data: CreateTestInput
) {
  let accessCode = generateAccessCode();

  let existingTest = await prisma.test.findUnique({
    where: {
      accessCode,
    },
  });

  while (existingTest) {
    accessCode = generateAccessCode();

    existingTest = await prisma.test.findUnique({
      where: {
        accessCode,
      },
    });
  }

  const test = await prisma.test.create({
    data: {
      hostId,

      title: data.title,

      description:
        data.description && data.description.trim() !== ""
          ? data.description
          : null,

      duration: data.duration,

      accessCode,

      settings: {
        create: {},
      },
    },

    include: {
      settings: true,
    },
  });

  return test;
}



export async function getHostedTests(hostId: string) {
  const tests = await prisma.test.findMany({
    where: {
      hostId,
    },

    select: {
      id: true,
      title: true,
      description: true,
      accessCode: true,
      duration: true,
      status: true,
      totalMarks: true,
      totalQuestions: true,
      createdAt: true,

      settings: {
        select: {
          fullscreenRequired: true,
          maxWarnings: true,
          shuffleQuestions: true,
        },
      },
    },

    orderBy: {
      createdAt: "desc",
    },
  });

  return tests;
}

