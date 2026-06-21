"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export async function saveAnswerAction(
  testId: string,
  questionId: string,
  selectedOptionId: string,
) {
  const session = await auth();

  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  const participant = await prisma.participant.findUnique({
    where: {
      userId_testId: {
        userId: session.user.id,
        testId,
      },
    },

    include: {
      test: true,
    },
  });

  if (!participant) {
    throw new Error("Participant not found");
  }

  if (participant.test.status !== "LIVE") {
    throw new Error("Test is not live");
  }

  if (
    participant.status === "SUBMITTED" ||
    participant.status === "AUTO_SUBMITTED"
  ) {
    throw new Error("Test already submitted");
  }

  await prisma.participantAnswer.upsert({
    where: {
      participantId_questionId: {
        participantId: participant.id,
        questionId,
      },
    },

    update: {
      selectedOptionId,
    },

    create: {
      participantId: participant.id,
      questionId,
      selectedOptionId,
    },
  });

  return {
    success: true,
  };
}

export async function submitTestAction(testId: string, autoSubmit = false) {
  const session = await auth();

  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  const participant = await prisma.participant.findUnique({
    where: {
      userId_testId: {
        userId: session.user.id,
        testId,
      },
    },

    include: {
      answers: {
        include: {
          question: {
            include: {
              options: true,
            },
          },
        },
      },
    },
  });

  if (!participant) {
    throw new Error("Participant not found");
  }

  if (
    participant.status === "SUBMITTED" ||
    participant.status === "AUTO_SUBMITTED"
  ) {
    return {
      success: true,
    };
  }

  let totalScore = 0;

  for (const answer of participant.answers) {
    const correctOption = answer.question.options.find(
      (option) => option.isCorrect,
    );

    let marksAwarded = 0;

    // Unanswered
    if (!answer.selectedOptionId) {
      marksAwarded = 0;
    }

    // Correct
    else if (correctOption && answer.selectedOptionId === correctOption.id) {
      marksAwarded = answer.question.marks;
    }

    // Wrong
    else {
      marksAwarded = -answer.question.negativeMarks;
    }

    totalScore += marksAwarded;

    await prisma.participantAnswer.update({
      where: {
        id: answer.id,
      },
      data: {
        marksAwarded,
      },
    });
  }

  await prisma.participant.update({
    where: {
      id: participant.id,
    },
    data: {
      score: totalScore,

      status: autoSubmit ? "AUTO_SUBMITTED" : "SUBMITTED",

      submittedAt: new Date(),
    },
  });

  return {
    success: true,
    score: totalScore,
  };
}
