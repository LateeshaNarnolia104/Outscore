import { prisma } from "@/lib/prisma";

export async function getParticipantDetails(
  participantId: string,
  hostId: string
) {
  const participant = await prisma.participant.findUnique({
    where: {
      id: participantId,
    },

    include: {
      user: {
        select: {
          name: true,
          email: true,
        },
      },

      test: true,

      answers: {
        include: {
          selectedOption: true,

          question: {
            include: {
              options: {
                orderBy: {
                  position: "asc",
                },
              },
            },
          },
        },

        orderBy: {
          answeredAt: "asc",
        },
      },
    },
  });

  if (!participant) {
    throw new Error("Participant not found");
  }

  if (participant.test.hostId !== hostId) {
    throw new Error("Unauthorized");
  }

  return participant;
}