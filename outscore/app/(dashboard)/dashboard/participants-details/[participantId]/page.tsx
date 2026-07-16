import { getParticipantDetailsAction } from "@/app/(dashboard)/actions/participant-result.action";
import Link from "next/link";

export default async function ParticipantDetailPage({
  params,
}: {
  params: Promise<{
    participantId: string;
  }>;
}) {
  const { participantId } = await params;

  const participant = await getParticipantDetailsAction(participantId);

  return (
    <main className="max-w-7xl mx-auto px-8 py-6">
      <Link
        href={`/dashboard/tests/${participant.testId}/participants`}
        className="
    inline-flex
    items-center
    gap-2
    border-neutral-300
    dark:border-neutral-700
    px-4
    py-2
    text-sm
    font-medium
    text-neutral-800
    dark:text-neutral-500
    hover:text-white
    transition
    mb-4
  "
      >
        ← Back to Leaderboard
      </Link>
      <h1 className="text-2xl font-bold text-white">{participant.user.name}</h1>

      <p className="text-sm text-neutral-400 mt-1">{participant.user.email}</p>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
        <div className="border rounded-xl p-5">
          <p className="text-sm text-gray-500">Score</p>
          <h2 className="text-3xl font-bold">{participant.score}</h2>
        </div>

        <div className="border rounded-xl p-5">
          <p className="text-sm text-gray-500">Status</p>
          <h2 className="text-xl font-bold">{participant.status}</h2>
        </div>

        <div className="border rounded-xl p-5">
          <p className="text-sm text-gray-500">Submitted</p>

          <h2 className="font-semibold">
            {participant.submittedAt
              ? new Date(participant.submittedAt).toLocaleString()
              : "-"}
          </h2>
        </div>

        <div className="border rounded-xl p-5">
          <p className="text-sm text-gray-500">Total Questions</p>

          <h2 className="text-2xl font-bold">
            {participant.test.totalQuestions}
          </h2>
        </div>
      </div>
      <div className="mt-6 rounded-3xl border border-neutral-800 bg-neutral-900 p-6">
        <h2 className="text-lg font-semibold flex items-center gap-2">
          Proctoring Report
        </h2>

        <p className="mt-2 text-neutral-400">
          Total Warnings: {participant.warningLogs.length}
        </p>

        <div className="mt-6 space-y-4">
          {participant.warningLogs.length === 0 ? (
            <div className="rounded-xl border border-green-500/20 bg-green-500/10 p-4">
              <p className="text-green-400 font-medium">
                ✅ No suspicious activity detected.
              </p>
            </div>
          ) : (
            participant.warningLogs.map((warning) => (
              <div key={warning.id} className="rounded-xl bg-neutral-800 p-4">
                <div className="flex justify-between">
                  <span className="font-semibold text-red-400">
                    {warning.type.replaceAll("_", " ")}
                  </span>

                  <span className="text-sm text-neutral-500">
                    {new Date(warning.createdAt).toLocaleString()}
                  </span>
                </div>

                {warning.message && (
                  <p className="mt-2 text-neutral-300">{warning.message}</p>
                )}
              </div>
            ))
          )}
        </div>
      </div>

      <div className="mt-6 space-y-8">
        {participant.answers.map((answer, index) => {
          const correctOption = answer.question.options.find(
            (option) => option.isCorrect,
          );

          return (
            <div
              key={answer.id}
              className="rounded-3xl border border-neutral-800 bg-neutral-900 p-5 shadow-sm"
            >
              <h2 className="text-base font-semibold text-neutral-200">
                Question {index + 1}
              </h2>

              <p className="mt-2 mb-4 text-neutral-300">
                {answer.question.questionText}
              </p>

              <div className="space-y-3">
                {answer.question.options.map((option) => {
                  const isCorrect = option.isCorrect;

                  const isSelected = option.id === answer.selectedOptionId;

                  return (
                    <div
                      key={option.id}
                      className={`rounded-xl border p-3 transition ${
                        isCorrect
                          ? "border-green-500 bg-green-500/10"
                          : isSelected
                            ? "border-red-500 bg-red-500/10"
                            : "border-neutral-700 bg-neutral-800"
                      }`}
                    >
                      {option.optionText}

                      {isCorrect && (
                        <span className="ml-3 rounded-full bg-green-500 px-2 py-1 text-xs font-semibold text-white">
                          Correct
                        </span>
                      )}

                      {!isCorrect && isSelected && (
                        <span className="ml-3 rounded-full bg-red-500 px-2 py-1 text-xs font-semibold text-white">
                          Selected
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>

              <div className="mt-5 flex items-center justify-between border-t border-neutral-800 pt-4">
                {" "}
                <span className="text-sm text-neutral-400">Marks Awarded</span>
                <span className="rounded-lg bg-green-500 px-3 py-1 text-sm font-bold text-white">
                  {answer.marksAwarded}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </main>
  );
}
