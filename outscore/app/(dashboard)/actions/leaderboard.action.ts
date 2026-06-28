"use server";

import { auth } from "@/auth";
import { getLeaderboard } from "@/services/leaderboard.service";
import { getParticipantRank } from "@/services/leaderboard.service";


export async function getLeaderboardAction(
  testId: string
) {
  const session = await auth();

  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  return getLeaderboard(testId);
}

export async function getParticipantRankAction(
  testId: string,
  participantId: string
) {
  return getParticipantRank(testId, participantId);
}