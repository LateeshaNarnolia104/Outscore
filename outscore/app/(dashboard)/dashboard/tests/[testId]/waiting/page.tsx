import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import WaitingRoomClient from "@/components/join/WaitingRoomClient";

type WaitingPageProps = {
  params: Promise<{
    testId: string;
  }>;
};

export default async function WaitingPage({ params }: WaitingPageProps) {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/login");
  }

  const { testId } = await params;

  // Retrieve participant and test details
  const participant = await prisma.participant.findUnique({
    where: {
      userId_testId: {
        userId: session.user.id,
        testId,
      },
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
    redirect("/join");
  }

  // Resolve dynamic name from registration details or fallback to session
  const details = (participant.details as Record<string, any>) || {};
  const participantFieldsJson = participant.test.settings?.participantFields;
  const participantFields: any[] = Array.isArray(participantFieldsJson) ? (participantFieldsJson as any[]) : [];

  const nameField = participantFields.find((f: any) =>
    f && typeof f.label === "string" && f.label.toLowerCase().includes("name")
  );

  let name = "";
  if (nameField && nameField.id) {
    name = details[nameField.id];
  }
  if (!name) {
    name = session.user.name || "Candidate";
  }

  return (
    <WaitingRoomClient
      testId={testId}
      testTitle={participant.test.title}
      participantName={name}
    />
  );
}
