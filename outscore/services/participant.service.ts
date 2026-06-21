import { prisma } from "@/lib/prisma";

export async function findPublishedTestByAccessCode(accessCode: string) {
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
          participantFields: true,
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

export async function getParticipantsByTestId(testId: string, hostId: string) {
  const test = await prisma.test.findFirst({
    where: {
      id: testId,
      hostId,
    },
  });

  if (!test) {
    throw new Error("Test not found or unauthorized");
  }

  return prisma.participant.findMany({
    where: {
      testId,
    },
    include: {
      user: {
        select: {
          name: true,
          email: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });
}

export async function getAttemptTest(testId: string, userId: string) {
  const participant = await prisma.participant.findUnique({
    where: {
      userId_testId: {
        userId,
        testId,
      },
    },

    include: {
      test: {
        include: {
          questions: {
            orderBy: {
              position: "asc",
            },

            include: {
              options: {
                orderBy: {
                  position: "asc",
                },
              },
            },
          },
        },
      },

      answers: true,
    },
  });

  if (!participant) {
    throw new Error("Participant not found");
  }

  if (participant.test.status !== "LIVE") {
    throw new Error("Test is not live");
  }

  return participant;
}
