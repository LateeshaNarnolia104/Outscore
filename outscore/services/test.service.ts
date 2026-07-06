import { prisma } from "@/lib/prisma";
import { generateAccessCode } from "@/lib/access-code";
import { CreateTestInput } from "@/validators/test";
import { TestStatus } from "@prisma/client";

export async function createTest(hostId: string, data: CreateTestInput) {
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
  // First fetch only LIVE tests
  const liveTests = await prisma.test.findMany({
    where: {
      hostId,
      status: TestStatus.LIVE,
    },
    select: {
      id: true,
    },
  });

  // Auto-complete expired LIVE tests
  for (const test of liveTests) {
    await ensureTestCompletion(test.id);
  }

  // Fetch fresh data after status updates
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
      startedAt: true,
      endsAt: true,
      endedAt: true,

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

export async function publishTest(testId: string, hostId: string) {
  const test = await prisma.test.findFirst({
    where: {
      id: testId,
      hostId,
    },

    select: {
      id: true,
      status: true,
      totalQuestions: true,
      totalMarks: true,
    },
  });

  if (!test) {
    throw new Error("Test not found");
  }

  if (test.status !== "DRAFT") {
    throw new Error("Only draft tests can be published");
  }

  if (test.totalQuestions === 0) {
    throw new Error("Add at least one question before publishing");
  }

  if (test.totalMarks === 0) {
    throw new Error("Total marks cannot be zero");
  }

  return prisma.test.update({
    where: {
      id: testId,
    },
    data: {
      status: "PUBLISHED",
    },
  });
}

export async function getTestForHost(testId: string, hostId: string) {
  return prisma.test.findFirst({
    where: {
      id: testId,
      hostId,
    },
    include: {
      settings: true,
    },
  });
}

export async function startTest(testId: string, hostId: string) {
  const test = await prisma.test.findFirst({
    where: {
      id: testId,
      hostId,
    },
  });

  if (!test) {
    throw new Error("Test not found");
  }

  if (test.status !== "PUBLISHED") {
    throw new Error("Only published tests can be started");
  }

  const startedAt = new Date();

  const endsAt = new Date(startedAt.getTime() + test.duration * 60 * 1000);

  return prisma.test.update({
    where: {
      id: testId,
    },
    data: {
      status: "LIVE",
      startedAt,
      endsAt,
    },
  });
}

export async function endTest(
  testId: string,
  hostId: string
) {
  const test = await prisma.test.findFirst({
    where: {
      id: testId,
      hostId,
    },
  });

  if (!test) {
    throw new Error("Test not found");
  }

  if (test.status !== TestStatus.LIVE) {
    throw new Error("Only live tests can be ended");
  }

  return prisma.test.update({
    where: {
      id: testId,
    },
    data: {
      status: TestStatus.COMPLETED,
      endedAt: new Date(),
    },
  });
}


export async function ensureTestCompletion(
  testId: string
) {
  const test = await prisma.test.findUnique({
    where: {
      id: testId,
    },

    select: {
      id: true,
      status: true,
      endsAt: true,
    },
  });

  if (!test) {
    throw new Error("Test not found");
  }

  if (
    test.status === TestStatus.LIVE &&
    test.endsAt && new Date(test.endsAt).getTime() <= Date.now()
  ) {
    await prisma.test.update({
      where: {
        id: test.id,
      },

      data: {
        status: TestStatus.COMPLETED,
        endedAt: new Date(),
      },
    });

    return TestStatus.COMPLETED;
  }

  return test.status;
}