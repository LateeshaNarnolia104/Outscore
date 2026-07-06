"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { WarningType } from "@prisma/client";
import { recordWarning } from "@/services/warning.service";

export async function recordWarningAction(
  testId: string,
  type: WarningType,
  message?: string
): Promise<
  | {
      success: true;
      warnings: number;
      maxWarnings: number;
      remainingWarnings: number;
      exceeded: boolean;
      autoSubmit: boolean;
    }
  | {
      success: false;
      message: string;
    }
> {
  const session = await auth();

  if (!session?.user?.id) {
    return {
      success: false,
      message: "Unauthorized",
    };
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
    return {
      success: false,
      message: "Participant not found",
    };
  }

  return await recordWarning(
    participant.id,
    type,
    message
  );
}