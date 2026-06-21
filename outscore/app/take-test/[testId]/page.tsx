import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { getAttemptTest } from "@/services/participant.service";
import AttemptTest from "@/components/test/AttemptTest";
import TestTimer from "@/components/test/TestTimer";
import SubmitTestButton from "@/components/test/SubmitTestButton";

type TakeTestPageProps = {
  params: Promise<{
    testId: string;
  }>;
};

export default async function TakeTestPage({ params }: TakeTestPageProps) {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/login");
  }

  const { testId } = await params;

  const participant = await getAttemptTest(testId, session.user.id);

  const initialAnswers: Record<string, string> = Object.fromEntries(
    participant.answers
      .filter((answer) => answer.selectedOptionId !== null)
      .map((answer) => [answer.questionId, answer.selectedOptionId!]),
  );

  return (
    <main className="max-w-5xl mx-auto p-8">
      <h1 className="text-3xl font-bold">{participant.test.title}</h1>

      <p className="mt-2 text-neutral-500">
        Questions: {participant.test.questions.length}
      </p>

      <div className="mt-6">
        <TestTimer endsAt={participant.test.endsAt!} testId={testId} />
      </div>

      <div className="mt-4">
        <SubmitTestButton testId={testId} />
      </div>

      <div className="mt-8">
        <AttemptTest
          testId={testId}
          questions={participant.test.questions}
          initialAnswers={initialAnswers}
        />
      </div>
    </main>
  );
}
