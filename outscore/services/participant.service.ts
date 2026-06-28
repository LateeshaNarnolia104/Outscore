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

  const participants = await prisma.participant.findMany({
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

    answers: true,
  },

  orderBy: [
    {
      score: "desc",
    },
    {
      createdAt: "asc",
    },
  ],
});

const submitted = participants.filter(
  (p) =>
    p.status === "SUBMITTED" ||
    p.status === "AUTO_SUBMITTED"
);

const highestScore =
  participants.length > 0
    ? Math.max(...participants.map((p) => p.score))
    : 0;

const averageScore =
  participants.length > 0
    ? participants.reduce((sum, p) => sum + p.score, 0) /
      participants.length
    : 0;

return {
  participants,
  stats: {
    totalParticipants: participants.length,
    submittedCount: submitted.length,
    highestScore,
    averageScore,
  },
};
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

export async function getParticipatedTests(userId: string) {
  return prisma.participant.findMany({
    where: {
      userId,
    },

    include: {
      test: {
        select: {
          id: true,
          title: true,
          description: true,
          duration: true,
          totalMarks: true,
          totalQuestions: true,
          status: true,
          accessCode: true,
          endedAt: true,
        },
      },
    },

    orderBy: {
      createdAt: "desc",
    },
  });
}
export async function getJoinedTests(userId: string) {
  return prisma.participant.findMany({
    where: {
      userId,
    },

    include: {
      test: {
        select: {
          id: true,
          title: true,
          description: true,
          accessCode: true,
          totalMarks: true,
          totalQuestions: true,
          status: true,
          createdAt: true,
        },
      },
    },

    orderBy: [
  {
    score: "desc",
  },
  {
    submittedAt: "asc",
  },
],
  });
}
export async function getParticipantResult(
  testId: string,
  userId: string
) {
  const participant = await prisma.participant.findUnique({
    where: {
      userId_testId: {
        userId,
        testId,
      },
    },

    include: {
      test: true,

      answers: {
        include: {
          question: {
            include: {
              options: {
                orderBy: {
                  position: "asc",
                },
              },
            },
          },

          selectedOption: true,
        },
      },
    },
  });

  if (!participant) {
    throw new Error("Result not found");
  }

  return participant;
}