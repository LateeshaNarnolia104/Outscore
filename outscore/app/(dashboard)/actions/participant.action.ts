"use server";

import { joinTestSchema } from "@/validators/participant";
import { findPublishedTestByAccessCode } from "@/services/participant.service";

export async function joinTestAction(
  accessCode: string
) {
  const validatedData = joinTestSchema.safeParse({
    accessCode,
  });

  if (!validatedData.success) {
    return {
      success: false,
      message:
        validatedData.error.issues[0]?.message ??
        "Invalid access code",
    };
  }

  return findPublishedTestByAccessCode(
    validatedData.data.accessCode
  );
}

