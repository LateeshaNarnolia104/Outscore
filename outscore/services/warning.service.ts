import { prisma } from "@/lib/prisma";
import { WarningType } from "@prisma/client";

export async function recordWarning(
  participantId: string,
  type: WarningType,
  message?: string
) {
  const participant = await prisma.participant.findUnique({
    where: {
      id: participantId,
    },
    include: {
      test: {
        include: {
          settings: true,
        },
      },
    },
  });

  if (!participant) {
    throw new Error("Participant not found");
  }

  const warnings = participant.warnings + 1;

  await prisma.$transaction([
    prisma.warningLog.create({
      data: {
        participantId,
        type,
        message,
      },
    }),

    prisma.participant.update({
      where: {
        id: participant.id,
      },
      data: {
        warnings,
      },
    }),
  ]);

  const maxWarnings =
    participant.test.settings?.maxWarnings ?? 3;

  const exceeded = warnings >= maxWarnings;

  const autoSubmit =
    exceeded &&
    (participant.test.settings?.autoSubmitOnWarning ?? true);

  return {
  success: true as const,
    warnings,
    maxWarnings,
    remainingWarnings: Math.max(0, maxWarnings - warnings),
    exceeded,
    autoSubmit,
  };
}