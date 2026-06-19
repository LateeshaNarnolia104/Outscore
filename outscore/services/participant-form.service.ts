import { prisma } from "@/lib/prisma";
import { ParticipantFields } from "@/validators/participant-fields";

export async function updateParticipantFields(
  testId: string,
  hostId: string,
  fields: ParticipantFields
) {
  // Verify ownership
  const test = await prisma.test.findFirst({
    where: {
      id: testId,
      hostId,
    },
    select: {
      id: true,
    },
  });

  if (!test) {
    return {
      success: false,
      message: "Test not found",
    };
  }

  await prisma.testSetting.update({
    where: {
      testId,
    },
    data: {
      participantFields: fields,
    },
  });

  return {
    success: true,
    message: "Participant fields updated successfully",
  };
}

