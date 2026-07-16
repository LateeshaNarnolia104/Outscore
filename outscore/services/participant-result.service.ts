import { prisma } from "@/lib/prisma";

export async function getParticipantDetails(
  participantId: string,
  hostId: string,
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

      test: {
        select: {
          title: true,
          totalMarks: true,
          totalQuestions: true,
          hostId: true,
        },
      },
      warningLogs: {
        orderBy: {
          createdAt: "asc",
        },
      },

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
