import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { getAttemptTest } from "@/services/participant.service";
import AttemptTest from "@/components/test/AttemptTest";
import TestTimer from "@/components/test/TestTimer";
import SubmitTestButton from "@/components/test/SubmitTestButton";
import Proctoring from "@/components/test/Proctoring";

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

  if (
    participant.status === "SUBMITTED" ||
    participant.status === "AUTO_SUBMITTED"
  ) {
    redirect(`/take-test/${testId}/submitted`);
  }

  const initialAnswers: Record<string, string> = Object.fromEntries(
    participant.answers
      .filter((answer) => answer.selectedOptionId !== null)
      .map((answer) => [answer.questionId, answer.selectedOptionId!]),
  );

  return (
    <main className="w-full min-h-screen mx-auto p-8">
      <div
  className="
    sticky
    top-0
    z-50
    mb-8
    rounded-3xl
    border
    border-neutral-800
    bg-[#111111]
    px-8
    py-6
  "
>
  <div className="flex items-center justify-between mt-4 px-4 py-8 gap-8">

    <div>

      <h1 className="text-3xl font-bold text-white">
        {participant.test.title}
      </h1>

      <p className="mt-2 text-neutral-500">
        {participant.test.questions.length} Questions
      </p>

    </div>

    <div className="flex items-center gap-6">

      <TestTimer
        endsAt={participant.test.endsAt!}
        testId={testId}
      />

      <SubmitTestButton testId={testId} />

    </div>

  </div>

  <Proctoring testId={testId} />

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
