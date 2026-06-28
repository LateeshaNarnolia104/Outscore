import { getParticipantDetailsAction } from "@/app/(dashboard)/actions/participant-result.action";

export default async function ParticipantDetailPage({
  params,
}: {
  params: Promise<{
    participantId: string;
  }>;
}) {
  const { participantId } = await params;

  const participant =
    await getParticipantDetailsAction(participantId);

  return (
    <main className="max-w-5xl mx-auto p-8">

      <h1 className="text-3xl font-bold">
        {participant.user.name}
      </h1>

      <p className="text-gray-500">
        {participant.user.email}
      </p>

      <div className="grid grid-cols-4 gap-6 mt-8">

        <div className="border rounded-xl p-5">
          <p className="text-sm text-gray-500">Score</p>
          <h2 className="text-3xl font-bold">
            {participant.score}
          </h2>
        </div>

        <div className="border rounded-xl p-5">
          <p className="text-sm text-gray-500">Status</p>
          <h2 className="text-xl font-bold">
            {participant.status}
          </h2>
        </div>

        <div className="border rounded-xl p-5">
          <p className="text-sm text-gray-500">
            Submitted
          </p>

          <h2 className="font-semibold">
            {participant.submittedAt
              ? new Date(
                  participant.submittedAt
                ).toLocaleString()
              : "-"}
          </h2>
        </div>

        <div className="border rounded-xl p-5">
          <p className="text-sm text-gray-500">
            Total Questions
          </p>

          <h2 className="text-3xl font-bold">
            {participant.test.totalQuestions}
          </h2>
        </div>

      </div>

      <div className="mt-10 space-y-8">

        {participant.answers.map((answer, index) => {

          const correctOption =
            answer.question.options.find(
              (option) => option.isCorrect
            );

          return (
            <div
              key={answer.id}
              className="border rounded-xl p-6"
            >
              <h2 className="font-bold text-lg mb-3">
                Question {index + 1}
              </h2>

              <p className="mb-5">
                {answer.question.questionText}
              </p>

              <div className="space-y-3">

                {answer.question.options.map((option) => {

                  const isCorrect =
                    option.isCorrect;

                  const isSelected =
                    option.id ===
                    answer.selectedOptionId;

                  return (
                    <div
                      key={option.id}
                      className={`border rounded-lg p-3 ${
                        isCorrect
                          ? "bg-green-100 border-green-400"
                          : isSelected
                          ? "bg-red-100 border-red-400"
                          : ""
                      }`}
                    >
                      {option.optionText}

                      {isCorrect && (
                        <span className="ml-3 font-semibold text-green-700">
                          ✓ Correct
                        </span>
                      )}

                      {!isCorrect &&
                        isSelected && (
                          <span className="ml-3 font-semibold text-red-700">
                            Selected
                          </span>
                        )}
                    </div>
                  );
                })}

              </div>

              <div className="mt-4 flex justify-between">

                <span>
                  Marks Awarded
                </span>

                <span className="font-bold">
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