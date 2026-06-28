"use server";

import { joinTestSchema } from "@/validators/participant";
import {
  findPublishedTestByAccessCode,
  getJoinedTests,
  getParticipantResult,
} from "@/services/participant.service";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { ParticipantField } from "@/validators/participant-fields";

export async function joinTestAction(accessCode: string) {
  const validatedData = joinTestSchema.safeParse({
    accessCode,
  });

  if (!validatedData.success) {
    return {
      success: false,
      message: validatedData.error.issues[0]?.message ?? "Invalid access code",
    };
  }

  return findPublishedTestByAccessCode(validatedData.data.accessCode);
}

export async function createParticipantAction(input: {
  accessCode: string;
  details: Record<string, any>;
}) {
  const session = await auth();
  if (!session?.user?.id) {
    return {
      success: false,
      message: "Unauthorized. Please sign in to join the test.",
    };
  }
  const userId = session.user.id;

  const parsedAccessCode = joinTestSchema.safeParse({
    accessCode: input.accessCode,
  });
  if (!parsedAccessCode.success) {
    return {
      success: false,
      message:
        parsedAccessCode.error.issues[0]?.message ?? "Invalid access code",
    };
  }

  const uppercaseAccessCode = parsedAccessCode.data.accessCode;

  const test = await prisma.test.findUnique({
    where: {
      accessCode: uppercaseAccessCode,
    },
    include: {
      settings: true,
    },
  });

  if (!test) {
    return {
      success: false,
      message: "Test not found",
    };
  }

  if (test.status !== "PUBLISHED") {
    return {
      success: false,
      message: "This test is not available to join.",
    };
  }

  const participantFieldsJson = test.settings?.participantFields;
  const participantFields: ParticipantField[] = Array.isArray(
    participantFieldsJson,
  )
    ? (participantFieldsJson as unknown as ParticipantField[])
    : [];

  const detailsErrors: string[] = [];
  const validatedDetails: Record<string, any> = {};

  for (const field of participantFields) {
    const value = input.details[field.id];

    if (field.required) {
      if (
        value === undefined ||
        value === null ||
        String(value).trim() === ""
      ) {
        detailsErrors.push(`${field.label} is required.`);
        continue;
      }
    }

    if (value !== undefined && value !== null && String(value).trim() !== "") {
      const trimmedValue = String(value).trim();

      if (field.type === "email") {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(trimmedValue)) {
          detailsErrors.push(`${field.label} must be a valid email.`);
          continue;
        }
        validatedDetails[field.id] = trimmedValue;
      } else if (field.type === "number") {
        const num = Number(trimmedValue);
        if (isNaN(num)) {
          detailsErrors.push(`${field.label} must be a number.`);
          continue;
        }
        validatedDetails[field.id] = num;
      } else {
        validatedDetails[field.id] = trimmedValue;
      }
    } else {
      validatedDetails[field.id] = "";
    }
  }

  if (detailsErrors.length > 0) {
    return {
      success: false,
      message: detailsErrors.join(" "),
    };
  }

  // Prevent duplicate participant for same user + test
  const existingParticipant = await prisma.participant.findUnique({
    where: {
      userId_testId: {
        userId,
        testId: test.id,
      },
    },
  });

  if (existingParticipant) {
    return {
      success: true,
      participantId: existingParticipant.id,
      message: "Resuming existing attempt.",
    };
  }

  try {
    const participant = await prisma.participant.create({
      data: {
        userId,
        testId: test.id,
        details: validatedDetails,
        status: "NOT_STARTED",
      },
    });

    return {
      success: true,
      participantId: participant.id,
    };
  } catch (error) {
    console.error("Failed to create participant:", error);
    return {
      success: false,
      message: "An error occurred while registering for the test.",
    };
  }
}

export async function submitTestAction(testId: string) {
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
    throw new Error("Already submitted");
  }


let score = 0;

for (const answer of participant.answers) {

  const correctOption = answer.question.options.find(
    (option) => option.isCorrect
  );

  if (!correctOption) continue;

  let marksAwarded = 0;

  if (answer.selectedOptionId === correctOption.id) {
    marksAwarded = answer.question.marks;
  } else if (answer.selectedOptionId) {
    marksAwarded = -answer.question.negativeMarks;
  }

  score += marksAwarded;

  await prisma.participantAnswer.update({
    where: {
      participantId_questionId: {
        participantId: participant.id,
        questionId: answer.question.id,
      },
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
      score,
      status: "SUBMITTED",
      submittedAt: new Date(),
    },
  });

  return {
    success: true,
    score,
  };
}

export async function saveAnswerAction(
  questionId: string,
  optionId: string,
  testId: string,
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
  });

  if (!participant) {
    throw new Error("Participant not found");
  }

  await prisma.participantAnswer.upsert({
    where: {
      participantId_questionId: {
        participantId: participant.id,
        questionId,
      },
    },

    update: {
      selectedOptionId: optionId,
      answeredAt: new Date(),
    },

    create: {
      participantId: participant.id,
      questionId,
      selectedOptionId: optionId,
    },
  });

  return {
    success: true,
  };
}

export async function getJoinedTestsAction() {
  const session = await auth();

  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  return await getJoinedTests(session.user.id);
}

export async function getParticipantResultAction(testId: string) {
  const session = await auth();

  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  return getParticipantResult(testId, session.user.id);
}
