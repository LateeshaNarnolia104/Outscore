import { prisma } from "@/lib/prisma";

export async function getLeaderboard(testId: string) {
  const participants = await prisma.participant.findMany({
    where: {
      testId,
      OR: [
        { status: "SUBMITTED" },
        { status: "AUTO_SUBMITTED" },
      ],
    },

    include: {
      user: {
        select: {
          name: true,
          email: true,
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

  const totalParticipants = participants.length;

  const highestScore =
    participants.length > 0 ? participants[0].score : 0;

  const averageScore =
    participants.length > 0
      ? participants.reduce((sum, p) => sum + p.score, 0) /
        participants.length
      : 0;

  const leaderboard = participants.map((participant, index) => ({
    ...participant,

    rank: index + 1,

    totalParticipants,

    highestScore,

    averageScore: Number(averageScore.toFixed(2)),

    percentile:
      totalParticipants === 0
        ? 0
        : Number(
            (
              ((totalParticipants - index) /
                totalParticipants) *
              100
            ).toFixed(2)
          ),
  }));

  return leaderboard;
}
export async function getParticipantRank(
  testId: string,
  participantId: string
) {
  const leaderboard = await getLeaderboard(testId);

  return leaderboard.find(
    (participant) => participant.id === participantId
  );
}