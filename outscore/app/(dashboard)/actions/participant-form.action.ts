"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

import { updateParticipantFields } from "@/services/participant-form.service";
import { participantFieldsSchema } from "@/validators/participant-fields";

async function ensureDraftTest(testId: string, hostId: string) {
  const test = await prisma.test.findFirst({
    where: {
      id: testId,
      hostId,
    },
    select: {
      status: true,
    },
  });

  if (!test) {
    return {
      success: false,
      message: "Test not found",
    };
  }

  if (test.status !== "DRAFT") {
    return {
      success: false,
      message:
        "Participant form can only be edited while the test is in draft.",
    };
  }

  return null;
}

export async function updateParticipantFieldsAction(
  testId: string,
  fields: unknown
) {
  const session = await auth();

  if (!session?.user?.id) {
    return {
      success: false,
      message: "Unauthorized",
    };
  }

  const validatedFields = participantFieldsSchema.safeParse(fields);

  if (!validatedFields.success) {
    return {
      success: false,
      message: "Invalid participant fields",
    };
  }

  const draftError = await ensureDraftTest(testId, session.user.id);

  if (draftError) {
    return draftError;
  }

  return updateParticipantFields(
    testId,
    session.user.id,
    validatedFields.data
  );
}