"use server";

import { auth } from "@/auth";
import { getParticipantDetails } from "@/services/participant-result.service";

export async function getParticipantDetailsAction(
  participantId: string
) {
  const session = await auth();

  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  return getParticipantDetails(
    participantId,
    session.user.id
  );
}