import { getParticipantResultAction } from "@/app/(dashboard)/actions/participant.action";
import { getParticipantRankAction } from "@/app/(dashboard)/actions/leaderboard.action";

export default async function ResultPage({
  params,
}: {
  params: Promise<{
    testId: string;
  }>;
}) {
  const { testId } = await params;

  const participant = await getParticipantResultAction(testId);
  const leaderboard = await getParticipantRankAction(
    participant.test.id,
    participant.id,
  );
  const correct = participant.answers.filter((answer) => {
    const correctOption = answer.question.options.find(
      (option) => option.isCorrect,
    );

    return correctOption && answer.selectedOptionId === correctOption.id;
  }).length;

  const wrong = participant.answers.filter((answer) => {
    const correctOption = answer.question.options.find(
      (option) => option.isCorrect,
    );

    return (
      answer.selectedOptionId &&
      correctOption &&
      answer.selectedOptionId !== correctOption.id
    );
  }).length;

  const skipped = participant.test.totalQuestions - participant.answers.length;

  const accuracy =
    participant.answers.length === 0
      ? 0
      : ((correct / participant.answers.length) * 100).toFixed(1);

  return (
    <main className=" mx-auto p-8">
      <h1 className="text-3xl font-bold">{participant.test.title}</h1>

      <div className="mt-8 rounded-3xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-8 shadow-sm">
        <p className="text-sm uppercase tracking-[0.3em] text-neutral-500">
          Final Score
        </p>

        <div className="mt-3 flex items-end gap-3">
          <h2 className="text-6xl font-black">{participant.score}</h2>

          <span className="text-2xl text-neutral-500 mb-2">
            / {participant.test.totalMarks}
          </span>
        </div>

        <p className="mt-2 text-neutral-500">{participant.test.title}</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 mt-8">
        <div className="rounded-2xl border border-green-200 dark:border-green-900 bg-green-50 dark:bg-green-950/30 p-6 transition hover:-translate-y-1">
          <h3 className="text-4xl font-bold">{correct}</h3>
          <p className="text-sm text-neutral-500 mt-1">Correct</p>
        </div>

        <div className="rounded-2xl border border-red-200 dark:border-red-900 bg-red-50 dark:bg-red-950/30 p-6 transition hover:-translate-y-1">
          <h3 className="text-4xl font-bold">{wrong}</h3>
          <p className="text-sm text-neutral-500 mt-1">Wrong</p>
        </div>

        <div className="rounded-2xl border border-yellow-200 dark:border-yellow-900 bg-yellow-50 dark:bg-yellow-950/30 p-6 transition hover:-translate-y-1">
          <h3 className="text-4xl font-bold">{skipped}</h3>
          <p className="text-sm text-neutral-500 mt-1">Skipped</p>
        </div>

        <div className="rounded-2xl border border-blue-200 dark:border-blue-900 bg-blue-50 dark:bg-blue-950/30 p-6 transition hover:-translate-y-1">
          <h3 className="text-4xl font-bold">{accuracy}%</h3>
          <p className="text-sm text-neutral-500 mt-1">Accuracy</p>
        </div>
        <div className="rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-6">
          <h3 className="text-4xl font-bold">#{leaderboard?.rank}</h3>

          <p className="text-sm text-neutral-500 mt-1">Rank</p>

          <p className="text-xs text-neutral-400 mt-2">
            out of {leaderboard?.totalParticipants}
          </p>
        </div>
        <div className="rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-6">
          <h3 className="text-4xl font-bold">{leaderboard?.highestScore}</h3>

          <p className="text-sm text-neutral-500 mt-1">Highest Score</p>
        </div>
        <div className="rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-6">
          <h3 className="text-4xl font-bold">{leaderboard?.averageScore}</h3>

          <p className="text-sm text-neutral-500 mt-1">Average Score</p>
        </div>
        <div className="rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-6">
          <h3 className="text-4xl font-bold">{leaderboard?.percentile}%</h3>

          <p className="text-sm text-neutral-500 mt-1">Percentile</p>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-5 mt-6">
        <div className="rounded-2xl border border-neutral-200 dark:border-neutral-800 p-6 bg-white dark:bg-neutral-900">
          <p className="text-sm text-neutral-500">Questions</p>

          <h3 className="mt-2 text-3xl font-bold">
            {participant.test.totalQuestions}
          </h3>
        </div>

        <div className="rounded-2xl border border-neutral-200 dark:border-neutral-800 p-6 bg-white dark:bg-neutral-900">
          <p className="text-sm text-neutral-500">Status</p>

          <span
            className={`mt-3 inline-flex rounded-full px-4 py-2 text-sm font-semibold ${
              participant.status === "SUBMITTED"
                ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
            }`}
          >
            {participant.status.replace("_", " ")}
          </span>
        </div>
      </div>
      <div className="mt-10 space-y-8">
        {participant.answers.map((answer, index) => {
          const correctOption = answer.question.options.find(
            (option) => option.isCorrect,
          );

          return (
            <div key={answer.id} className="border rounded-xl p-6">
              <h2 className="font-bold text-lg mb-4">Question {index + 1}</h2>

              <p className="mb-5">{answer.question.questionText}</p>

              <div className="space-y-3">
                {answer.question.options.map((option) => {
                  const isCorrect = option.isCorrect;
                  const isSelected = option.id === answer.selectedOptionId;

                  return (
                    <div
                      key={option.id}
                      className={`border rounded-lg p-3 ${
                        isCorrect
                          ? "bg-green-100 border-green-400 text-black"
                          : isSelected
                            ? "bg-red-100 border-red-400"
                            : ""
                      }`}
                    >
                      {option.optionText}

                      {isCorrect && (
                        <span className="ml-3 text-green-700 font-semibold">
                          ✓ Correct
                        </span>
                      )}

                      {!isCorrect && isSelected && (
                        <span className="ml-3 text-red-700 font-semibold">
                          Your Answer
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>

              <div className="mt-5 flex justify-between text-sm">
                <span>Marks Awarded</span>

                <span className="font-bold">{answer.marksAwarded}</span>
              </div>
            </div>
          );
        })}
      </div>
    </main>
  );
}
